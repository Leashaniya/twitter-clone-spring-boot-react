export const createPost = (postData) => async (dispatch) => {
    try {
        console.log("Creating post with data:", postData);

        const formData = new FormData();
        formData.append("content", postData.content);
        
        if (postData.image) {
            formData.append("image", postData.image);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*'
            }
        };

        const { data } = await api.post("/api/twits/create", formData, config);
        console.log("Created post response:", data);
        
        dispatch({ type: CREATE_POST, payload: data });
        return { success: true, data };
    } catch (error) {
        console.error("Error creating post:", error.response?.data || error.message);
        
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

export const updatePost = (postId, postData) => async (dispatch) => {
    try {
        console.log("Updating post with data:", postData);

        const formData = new FormData();
        formData.append("content", postData.content);
        
        if (postData.image) {
            formData.append("image", postData.image);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*'
            }
        };

        const { data } = await api.put(`/api/twits/${postId}`, formData, config);
        console.log("Updated post response:", data);
        
        dispatch({ type: UPDATE_POST, payload: data });
        return { success: true, data };
    } catch (error) {
        console.error("Error updating post:", error.response?.data || error.message);
        
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

        if (!error.response) {
            return { success: false, error: "Network error. Please check your connection." };
        }
        
        if (error.response.status === 401) {
            return { success: false, error: "Please sign in to update a post." };
        }

        return { 
            success: false, 
            error: error.response?.data?.message || error.message || "Failed to update post. Please try again." 
        };
    }
};

export const deletePost = (postId) => async (dispatch) => {
    try {
        console.log("Deleting post with ID:", postId);
        
        const { data } = await api.delete(`/api/twits/${postId}`);
        console.log("Delete post response:", data);
        
        dispatch({ type: DELETE_POST, payload: postId });
        return { success: true, data };
    } catch (error) {
        console.error("Error deleting post:", error.response?.data || error.message);
        
        if (!error.response) {
            return { success: false, error: "Network error. Please check your connection." };
        }
        
        if (error.response.status === 401) {
            return { success: false, error: "Please sign in to delete a post." };
        }

        return { 
            success: false, 
            error: error.response?.data?.message || error.message || "Failed to delete post. Please try again." 
        };
    }
}; 