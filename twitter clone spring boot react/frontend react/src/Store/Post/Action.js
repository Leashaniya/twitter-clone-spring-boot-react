import { 
    CREATE_POST, 
    GET_ALL_POSTS, 
    GET_USER_POSTS, 
    GET_USER_LIKED_POSTS,
    LIKE_POST,
    DELETE_POST,
    UPDATE_POST,
    ADD_COMMENT,
    UNLIKE_POST
} from "./ActionType";
import { api } from "../../Config/apiConfig";

export const createPost = (postData) => async (dispatch) => {
    try {
        console.log("Creating post with data:", postData);

        // Ensure we're working with FormData
        let formDataToSend = new FormData();

        // If postData is already FormData, copy its contents
        if (postData instanceof FormData) {
            for (let pair of postData.entries()) {
                formDataToSend.append(pair[0], pair[1]);
            }
        } else {
            // If postData is a regular object, convert it to FormData
            Object.keys(postData).forEach(key => {
                if (Array.isArray(postData[key])) {
                    postData[key].forEach(item => {
                        formDataToSend.append(key, item);
                    });
                } else {
                    formDataToSend.append(key, postData[key]);
                }
            });
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*'
            }
        };

        // Log the final FormData contents for debugging
        console.log("Final FormData contents:");
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0], ':', pair[1]);
        }

        const { data } = await api.post("/api/twits/create", formDataToSend, config);
        console.log("Created post response:", data);
        
        if (!data) {
            throw new Error("No data received from server");
        }

        dispatch({ type: CREATE_POST, payload: data });
        
        // Refresh the posts feed
        await dispatch(getAllPosts());
        return { success: true, data };
    } catch (error) {
        console.error("Error creating post:", error.response?.data || error.message);
        
        // Log detailed error information
        if (error.response?.status === 415) {
            console.error("Content Type Error Details:", {
                headers: error.config?.headers,
                data: error.config?.data,
                isFormData: error.config?.data instanceof FormData
            });
            return { 
                success: false, 
                error: "Server configuration issue. Please try again later or contact support." 
            };
        }

        // Handle specific error cases
        if (!error.response) {
            return { success: false, error: "Network error. Please check your connection." };
        }
        
        if (error.response.status === 401) {
            return { success: false, error: "Please sign in to create a post." };
        }

        return { 
            success: false, 
            error: error.response?.data?.message || error.message || "Failed to create post. Please try again." 
        };
    }
};

export const getAllPosts = () => async (dispatch) => {
    try {
        console.log("Fetching all posts...");
        const { data } = await api.get("/api/twits/");
        console.log("Fetched posts:", data);
        dispatch({ type: GET_ALL_POSTS, payload: data });
    } catch (error) {
        console.error("Error fetching all posts:", error.response?.data || error.message);
    }
};

export const getUserPosts = (userId) => async (dispatch) => {
    try {
        console.log("Fetching user posts for userId:", userId);
        const { data } = await api.get(`/api/twits/user/${userId}`);
        console.log("Fetched user posts:", data);
        dispatch({ type: GET_USER_POSTS, payload: data });
    } catch (error) {
        console.error("Error fetching user posts:", error.response?.data || error.message);
    }
};

export const findPostsByLikesContainUser = (userId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/twits/liked/${userId}`);
        console.log("Liked posts response:", data);
        dispatch({ type: GET_USER_LIKED_POSTS, payload: data });
    } catch (error) {
        console.error("Error fetching liked posts:", error.response?.data || error.message);
    }
};

export const likePost = (postId) => async (dispatch) => {
    try {
        console.log("Liking post with ID:", postId);
        const { data } = await api.put(`/api/twits/${postId}/like`);
        console.log("Like response:", data);
        dispatch({ type: LIKE_POST, payload: data });
    } catch (error) {
        console.error("Error liking post:", error.response?.data || error.message);
    }
};

export const unlikePost = (postId) => async (dispatch) => {
    try {
        console.log("Unliking post with ID:", postId);
        const { data } = await api.put(`/api/twits/${postId}/unlike`);
        console.log("Unlike response:", data);
        dispatch({ type: UNLIKE_POST, payload: data });
    } catch (error) {
        console.error("Error unliking post:", error.response?.data || error.message);
    }
};

export const deletePost = (postId) => async (dispatch) => {
    try {
        await api.delete(`/api/twits/${postId}`);
        dispatch({ type: DELETE_POST, payload: postId });
    } catch (error) {
        console.error("Error deleting post:", error.response?.data || error.message);
    }
};

export const updatePost = (postId, postData) => async (dispatch) => {
    try {
        const { data } = await api.put(`/api/twits/${postId}`, postData);
        dispatch({ type: UPDATE_POST, payload: data });
    } catch (error) {
        console.error("Error updating post:", error.response?.data || error.message);
    }
};

export const addComment = (postId, comment) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/twits/${postId}/comment`, { content: comment });
        dispatch({ type: ADD_COMMENT, payload: { postId, comment: data } });
        dispatch(getAllPosts());
    } catch (error) {
        console.error("Error adding comment:", error.response?.data || error.message);
    }
}; 