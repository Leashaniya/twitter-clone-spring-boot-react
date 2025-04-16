import { 
    CREATE_POST, 
    GET_ALL_POSTS, 
    GET_USER_POSTS, 
    GET_USER_LIKED_POSTS,
    LIKE_POST,
    DELETE_POST,
    UPDATE_POST,
    ADD_COMMENT
} from "./ActionType";

const initialState = {
    posts: [],
    userPosts: [],
    likedPosts: [],
    loading: false,
    error: null,
};

export const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts],
            };
        case GET_ALL_POSTS:
            return {
                ...state,
                posts: action.payload,
            };
        case GET_USER_POSTS:
            return {
                ...state,
                userPosts: action.payload,
            };
        case GET_USER_LIKED_POSTS:
            return {
                ...state,
                likedPosts: action.payload,
            };
        case LIKE_POST:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.postId
                        ? { ...post, liked: !post.liked, likes: action.payload.data.likes }
                        : post
                ),
                userPosts: state.userPosts.map(post =>
                    post.id === action.payload.postId
                        ? { ...post, liked: !post.liked, likes: action.payload.data.likes }
                        : post
                ),
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload),
                userPosts: state.userPosts.filter(post => post.id !== action.payload),
            };
        case UPDATE_POST:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.id
                        ? { ...post, ...action.payload }
                        : post
                ),
                userPosts: state.userPosts.map(post =>
                    post.id === action.payload.id
                        ? { ...post, ...action.payload }
                        : post
                ),
            };
        case ADD_COMMENT:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.postId
                        ? {
                            ...post,
                            comments: [...(post.comments || []), action.payload.comment],
                        }
                        : post
                ),
                userPosts: state.userPosts.map(post =>
                    post.id === action.payload.postId
                        ? {
                            ...post,
                            comments: [...(post.comments || []), action.payload.comment],
                        }
                        : post
                ),
            };
        default:
            return state;
    }
}; 