import { Avatar, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getAllPosts } from "../../../Store/Post/Action";
import { uploadToCloudinary } from "../../../Utils/UploadToCloudinary";
import BackdropComponent from "../../Backdrop/Backdrop";
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SkillPost from './SkillPost';
import { toast } from "react-hot-toast";

const MAX_IMAGES = 3;
const MAX_VIDEO_DURATION = 30; // in seconds

const validationSchema = Yup.object().shape({
  content: Yup.string()
    .required("Skill description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

const HomeSection = () => {
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const posts = useSelector((state) => state.post.posts);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const checkVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > MAX_VIDEO_DURATION) {
          reject(new Error(`Video duration must not exceed ${MAX_VIDEO_DURATION} seconds`));
        }
        setVideoDuration(video.duration);
        resolve(true);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (values, actions) => {
    try {
      if (!values.content.trim()) {
        toast.error("Please enter a skill description");
        return;
      }

      setUploadingMedia(true);
      const formData = new FormData();
      
      // Add content
      formData.append("content", values.content.trim());

      // Handle images
      if (selectedImages.length > 0) {
        try {
          console.log("Starting image upload to Cloudinary...");
          console.log("Selected images:", selectedImages);
          
          // Upload first image to Cloudinary
          const image = selectedImages[0];
          console.log("Uploading image:", image.name);
          const imageUrl = await uploadToCloudinary(image, "image");
          console.log("Image uploaded successfully to Cloudinary:", imageUrl);
          
          // Add image URL to FormData
          formData.append("image", imageUrl);
          
          console.log("FormData after adding image:");
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
          }
        } catch (error) {
          console.error("Error during image upload process:", error);
          toast.error("Failed to upload image. Please try again.");
          setUploadingMedia(false);
          return;
        }
      }

      // Get the JWT token
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        toast.error("Please sign in to create a post");
        setUploadingMedia(false);
        return;
      }

      console.log("Sending post data to server...");
      const result = await dispatch(createPost(formData));
      
      if (result.success) {
        console.log("Post created successfully:", result.data);
        toast.success("Post created successfully!");
        actions.resetForm();
        setSelectedImages([]);
        setSelectedVideo(null);
        setVideoDuration(0);
        // Refresh posts after successful creation
        dispatch(getAllPosts());
      } else {
        throw new Error(result.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "An error occurred while creating the post");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleVideoSelect = async (event) => {
    if (event.target.files?.[0]) {
      if (selectedImages.length > 0) {
        alert("You cannot upload both images and video in the same post");
        event.target.value = null;
        return;
      }

      const file = event.target.files[0];
      try {
        await checkVideoDuration(file);
        setSelectedVideo(file);
      } catch (error) {
        alert(error.message);
        event.target.value = null;
      }
    }
    event.target.value = null;
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    if (selectedImages.length + files.length > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images per skill post`);
      return;
    }
    if (selectedVideo) {
      alert("You cannot upload both images and video in the same post");
      return;
    }
    setSelectedImages(prev => [...prev, ...files]);
    event.target.value = null;
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    setVideoDuration(0);
  };

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="space-y-5">
      <section>
        <h1 className="py-5 text-xl font-bold opacity-90">Share Your Skills</h1>
        <div className="border border-gray-100 p-5 rounded-lg">
          <div className="flex space-x-5">
            <Avatar alt={auth.user?.fullName} src={auth.user?.image} />
            <div className="w-full">
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <textarea
                    name="content"
                    placeholder="Share your skills and knowledge... (Describe what you're teaching or showcasing)"
                    className="border-none outline-none text-xl bg-transparent w-full resize-none"
                    rows={3}
                    {...formik.getFieldProps("content")}
                  />
                  {formik.errors.content && formik.touched.content && (
                    <span className="text-red-500">{formik.errors.content}</span>
                  )}
                </div>

                {/* Preview selected images */}
                {selectedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <IconButton
                          size="small"
                          className="absolute top-1 right-1 bg-black bg-opacity-50 hover:bg-opacity-70"
                          onClick={() => removeImage(index)}
                          aria-label={`Remove image ${index + 1}`}
                          tabIndex={0}
                        >
                          <CloseIcon className="text-white" fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview selected video */}
                {selectedVideo && (
                  <div className="mt-4 relative">
                    <video
                      src={URL.createObjectURL(selectedVideo)}
                      className="w-full max-h-96 rounded-lg"
                      controls
                    />
                    <div className="absolute top-1 right-1 flex items-center space-x-2">
                      <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {videoDuration.toFixed(1)}s
                      </span>
                      <IconButton
                        size="small"
                        className="bg-black bg-opacity-50 hover:bg-opacity-70"
                        onClick={removeVideo}
                        aria-label="Remove video"
                        tabIndex={0}
                      >
                        <CloseIcon className="text-white" fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-5">
                  <div className="flex space-x-5 items-center">
                    <label className="flex items-center space-x-2 rounded-md cursor-pointer" title={`Upload up to ${MAX_IMAGES} images`}>
                      <ImageIcon className="text-[#1d9bf0]" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                        disabled={selectedVideo !== null}
                      />
                      <span className="text-sm text-gray-500">{`(${selectedImages.length}/${MAX_IMAGES})`}</span>
                    </label>
                    <label className="flex items-center space-x-2 rounded-md cursor-pointer" title={`Upload video (max ${MAX_VIDEO_DURATION}s)`}>
                      <VideoLibraryIcon className="text-[#1d9bf0]" />
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoSelect}
                        disabled={selectedImages.length > 0}
                      />
                    </label>
                  </div>

                  <div>
                    <Button
                      sx={{
                        width: "100%",
                        borderRadius: "20px",
                        paddingY: "8px",
                        paddingX: "20px",
                        bgcolor: "#1d9bf0",
                      }}
                      variant="contained"
                      type="submit"
                      disabled={uploadingMedia || !formik.values.content.trim()}
                    >
                      Share Skill
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-5 text-gray-500">
            No skills shared yet. Be the first to share your knowledge!
          </div>
        ) : (
          posts.map((item) => (
            <SkillPost key={item.id} post={item} />
          ))
        )}
      </section>

      <BackdropComponent open={uploadingMedia} />
    </div>
  );
};

export default HomeSection;
