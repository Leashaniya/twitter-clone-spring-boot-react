// Selectors for auth state
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectJwt = (state) => state.auth.jwt;
export const selectUpdateUser = (state) => state.auth.updateUser;
export const selectSearchResult = (state) => state.auth.searchResult; 