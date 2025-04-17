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
        const jwt = localStorage.getItem("jwt");
        
        if (!jwt) {
            throw new Error("Authentication token not found");
        }

        // Debug logging for FormData contents
        console.log("FormData contents before sending:");
        for (let [key, value] of postData.entries()) {
            console.log(`${key}:`, value);
        }

        const response = await api.post("/api/twits/create", postData, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                // Let axios set the Content-Type for FormData
            }
        });

        console.log("Post creation response:", response.data);
        
        if (response.status === 201 || response.status === 200) {
            dispatch({ type: CREATE_POST, payload: response.data });
            // Refresh posts after successful creation
            dispatch(getAllPosts());
            return { success: true, data: response.data };
        } else {
            throw new Error("Unexpected response status: " + response.status);
        }
    } catch (error) {
        console.error("Error creating post:", error);
        console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        dispatch({ type: CREATE_POST, payload: error.message });
        return { success: false, error: error.message };
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