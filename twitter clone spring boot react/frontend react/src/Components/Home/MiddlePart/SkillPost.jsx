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
    DialogActions
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CommentIcon from '@mui/icons-material/Comment'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch, useSelector } from 'react-redux'
import { likePost, deletePost, updatePost } from '../../../Store/Post/Action'

// Helper function to format relative time
const getRelativeTime = (dateString) => {
    try {
        if (!dateString) {
            return 'Just now'; // Default fallback for missing dates
        }

        const now = new Date();
        const postDate = new Date(dateString);

        // Check if the date is valid
        if (isNaN(postDate.getTime())) {
            console.warn('Invalid date format:', dateString);
            return 'Recently'; // Fallback for invalid dates
        }

        const diffInSeconds = Math.floor((now - postDate) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return postDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Recently'; // Fallback for any errors
    }
};

const SkillPost = ({ post }) => {
    const theme = useSelector((state) => state.theme.currentTheme);
    const auth = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [commentOpen, setCommentOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [editContent, setEditContent] = useState(post?.content || '');
    const isOwner = post?.user_id === auth?.id;

    if (!post) return null;

    // Format the post date for display
    const formattedDate = post.created_at 
        ? new Date(post.created_at).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        : 'Recent post';

    const handleLike = () => {
        dispatch(likePost(post.id));
    };

    const handleComment = () => {
        setCommentOpen(true);
    };

    const handleEdit = () => {
        setEditOpen(true);
        setEditContent(post.content);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this skill post?')) {
            dispatch(deletePost(post.id));
        }
    };

    const handleUpdatePost = () => {
        dispatch(updatePost(post.id, { content: editContent }));
        setEditOpen(false);
    };

    return (
        <>
            <Card className={`w-full mb-4 ${theme === "dark" ? "bg-[#0D0D0D] text-white" : ""}`}>
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
                        <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                            <span>@{post.user?.fullName?.split(" ").join("_").toLowerCase() || 'anonymous'}</span>
                            <span className="mx-1">·</span>
                            <span title={formattedDate}>{getRelativeTime(post.created_at)}</span>
                        </div>
                    }
                    action={
                        isOwner && (
                            <div>
                                <IconButton onClick={handleEdit}>
                                    <EditIcon className="text-gray-500" />
                                </IconButton>
                                <IconButton onClick={handleDelete}>
                                    <DeleteIcon className="text-gray-500" />
                                </IconButton>
                            </div>
                        )
                    }
                />
                <CardContent>
                    <Typography 
                        variant="body1" 
                        className={`whitespace-pre-wrap ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                    >
                        {post.content}
                    </Typography>

                    {/* Display images in a grid */}
                    {post.images && post.images.length > 0 && (
                        <div className={`mt-4 grid grid-cols-${post.images.length} gap-4`}>
                            {post.images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image}
                                        alt={`Skill content ${index + 1}`}
                                        className="w-full rounded-lg object-cover"
                                        style={{ aspectRatio: '16/9' }}
                                    />
                                </div>
                            ))}
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
                    <IconButton onClick={handleLike} aria-label="like">
                        {post.is_liked ? (
                            <FavoriteIcon className="text-red-500" />
                        ) : (
                            <FavoriteBorderIcon className="text-gray-500 hover:text-red-500" />
                        )}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {post.likes?.length || 0}
                    </Typography>
                    <IconButton onClick={handleComment} aria-label="comment">
                        <CommentIcon className="text-gray-500 hover:text-blue-500" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {post.comments?.length || 0}
                    </Typography>
                </CardActions>
            </Card>

            {/* Comment Dialog */}
            <Dialog open={commentOpen} onClose={() => setCommentOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Comment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Your comment"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCommentOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                        // TODO: Implement add comment
                        setCommentOpen(false);
                    }}>Post</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Skill Post</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Update your skill description"
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
                    <Button onClick={handleUpdatePost}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SkillPost; 