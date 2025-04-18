import React, { useState } from 'react'
import { 
    Avatar, 
    Card, 
    CardContent, 
    CardHeader, 
    CardActions, 
    IconButton, 
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ImageList,
    ImageListItem,
    Modal,
    Box
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CommentIcon from '@mui/icons-material/Comment'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { likePost, deletePost, updatePost } from '../../../Store/Post/Action'

// Helper function to format relative time
const getRelativeTime = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const SkillPost = ({ post }) => {
    const dispatch = useDispatch();
    const { auth, theme } = useSelector(state => state);
    const [editOpen, setEditOpen] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    
    const isOwner = post.user?.id === auth.user?.id;
    const formattedDate = new Date(post.created_at).toLocaleString();
    const isLiked = post.likes?.some(like => like.id === auth.user?.id);

    const handleLike = () => {
        dispatch(likePost(post.id));
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this skill post?')) {
            try {
                const response = await dispatch(deletePost(post.id));
                if (!response.success) {
                    alert(response.error || 'Failed to delete post. Please try again.');
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                alert('An error occurred while deleting the post. Please try again.');
            }
        }
    };

    const handleEdit = () => {
        setEditContent(post.content);
        setEditOpen(true);
    };

    const handleUpdatePost = () => {
        const formData = new FormData();
        formData.append('content', editContent);
        
        // Keep existing media
        if (post.images) {
            formData.append('images', JSON.stringify(post.images));
        }
        if (post.video) {
            formData.append('video', post.video);
            if (post.videoDuration) {
                formData.append('videoDuration', post.videoDuration);
            }
        }

        dispatch(updatePost(post.id, formData));
        setEditOpen(false);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseImagePreview = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <Card className={`w-full mb-4 ${theme.currentTheme === "dark" ? "bg-[#0D0D0D] text-white" : ""}`}>
                <CardHeader
                    avatar={
                        <Avatar 
                            src={post.user?.image} 
                            alt={post.user?.fullName || 'User'}
                        />
                    }
                    title={
                        <div className="flex items-center">
                            <span className="font-bold">{post.user?.fullName || 'Anonymous'}</span>
                            <span className="ml-2 text-sm text-gray-500">shared a skill</span>
                        </div>
                    }
                    subheader={
                        <div className={theme.currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}>
                            <span>@{post.user?.fullName?.split(" ").join("_").toLowerCase() || 'anonymous'}</span>
                            <span className="mx-1">·</span>
                            <span title={formattedDate}>{getRelativeTime(post.created_at)}</span>
                        </div>
                    }
                    action={
                        isOwner && (
                            <div>
                                <IconButton onClick={handleEdit}>
                                    <EditIcon className={theme.currentTheme === "dark" ? "text-gray-400" : "text-gray-500"} />
                                </IconButton>
                                <IconButton onClick={handleDelete}>
                                    <DeleteIcon className={theme.currentTheme === "dark" ? "text-gray-400" : "text-gray-500"} />
                                </IconButton>
                            </div>
                        )
                    }
                />
                <CardContent>
                    <Typography 
                        variant="body1" 
                        className={`whitespace-pre-wrap ${theme.currentTheme === "dark" ? "text-white" : "text-gray-800"}`}
                    >
                        {post.content}
                    </Typography>

                    {/* Display images in a responsive grid */}
                    {post.images && post.images.length > 0 && (
                        <div className="mt-4">
                            <div className={`grid gap-2 ${
                                post.images.length === 1 ? 'grid-cols-1' :
                                post.images.length === 2 ? 'grid-cols-2' :
                                post.images.length === 3 ? 'grid-cols-2' :
                                'grid-cols-2'
                            }`}>
                                {post.images.map((image, index) => (
                                    <div 
                                        key={index}
                                        className={`relative ${
                                            post.images.length === 3 && index === 0 ? 'col-span-2' : ''
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Skill content ${index + 1}`}
                                            loading="lazy"
                                            className="rounded-lg w-full h-full object-cover cursor-pointer transition-transform hover:opacity-90"
                                            style={{
                                                aspectRatio: post.images.length === 1 ? '16/9' :
                                                            post.images.length === 2 ? '1/1' :
                                                            post.images.length === 3 && index === 0 ? '16/9' : '1/1'
                                            }}
                                            onClick={() => handleImageClick(image)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Display video */}
                    {post.video && (
                        <div className="mt-4 relative">
                            <video
                                src={post.video}
                                controls
                                className="w-full rounded-lg"
                                style={{ aspectRatio: '16/9' }}
                            />
                            {post.videoDuration && (
                                <span className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                    {Math.round(post.videoDuration)}s
                                </span>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardActions disableSpacing>
                    <IconButton onClick={handleLike}>
                        {isLiked ? (
                            <FavoriteIcon className="text-red-500" />
                        ) : (
                            <FavoriteBorderIcon className={theme.currentTheme === "dark" ? "text-gray-400" : "text-gray-500"} />
                        )}
                    </IconButton>
                    <span className={theme.currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}>
                        {post.likes?.length || 0}
                    </span>

                    <IconButton 
                        className="ml-2"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <CommentIcon className={theme.currentTheme === "dark" ? "text-gray-400" : "text-gray-500"} />
                    </IconButton>
                    <span className={theme.currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}>
                        {post.comments?.length || 0}
                    </span>
                </CardActions>
            </Card>

            {/* Edit Dialog */}
            <Dialog 
                open={editOpen} 
                onClose={() => setEditOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Skill Post</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleUpdatePost}
                        variant="contained"
                        disabled={!editContent.trim() || editContent === post.content}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Preview Modal */}
            <Modal
                open={!!selectedImage}
                onClose={handleCloseImagePreview}
                aria-labelledby="image-preview-modal"
                className="flex items-center justify-center"
            >
                <Box className="relative max-w-[90vw] max-h-[90vh] outline-none">
                    <IconButton
                        onClick={handleCloseImagePreview}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75 z-10"
                        size="small"
                    >
                        <CloseIcon className="text-white" />
                    </IconButton>
                    <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    />
                </Box>
            </Modal>
        </>
    );
};

export default SkillPost; 