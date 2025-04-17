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
import { getAllTweets } from "../../../Store/Tweet/Action";
import TwitCard from "./TwitCard/TwitCard";

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
  const { twit, auth } = useSelector((state) => state);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        console.log("Fetching tweets...");
        const token = localStorage.getItem("jwt");
        if (!token) {
          console.error("No JWT token found");
          return;
        }
        await dispatch(getAllTweets());
      } catch (error) {
        console.error("Error fetching tweets:", error);
        toast.error("Failed to load tweets. Please try again.");
      }
    };

    fetchTweets();
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
      {twit.loading ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : twit.error ? (
        <div className="text-center p-4 text-red-500">
          <p>Error loading tweets: {twit.error}</p>
          <button 
            onClick={() => dispatch(getAllTweets())}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : twit.twits?.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          No tweets found. Be the first to tweet!
        </div>
      ) : (
        <>
          {twit.twits?.map((item) => (
            <TwitCard key={item.id} twit={item} />
          ))}
        </>
      )}
    </div>
  );
};

export default HomeSection;
