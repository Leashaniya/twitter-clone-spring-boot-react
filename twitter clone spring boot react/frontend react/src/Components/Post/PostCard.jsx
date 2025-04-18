import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../../Store/Post/Action';
import EditPostModal from './EditPostModal';

const PostCard = ({ post }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    // Debug logging
    useEffect(() => {
        console.log('Current user:', user);
        console.log('Post user:', post.user);
        console.log('Post:', post);
    }, [user, post]);

    // Updated ownership check
    const isPostOwner = user && post.user && (
        user.id === post.user.id || 
        user._id === post.user._id || 
        user.id === post.userId
    );

    const handleDelete = async () => {
        try {
            await dispatch(deletePost(post.id));
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <img
                        src={post.user?.image || "/default-avatar.png"}
                        alt={post.user?.fullName || "User"}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                        <h3 className="font-semibold">{post.user?.fullName || "Anonymous"}</h3>
                        <p className="text-gray-500 text-sm">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                
                {isPostOwner && (
                    <div className="relative flex space-x-2">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>

                        {showDeleteConfirm && (
                            <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                <div className="py-1">
                                    <p className="px-4 py-2 text-sm text-gray-700">Are you sure?</p>
                                    <button
                                        onClick={handleDelete}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Yes, Delete Post
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="mb-4">{post.content}</p>

            {post.image && (
                <img
                    src={post.image}
                    alt="Post content"
                    className="w-full rounded-lg mb-4"
                />
            )}

            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-blue-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Like
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-blue-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Comment
                    </button>
                </div>
            </div>

            {showEditModal && (
                <EditPostModal
                    post={post}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </div>
    );
};

export default PostCard; 