import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { auth } = useSelector((store) => store);
    const jwt = localStorage.getItem("jwt");

    // Check both JWT in localStorage and auth state
    if (!jwt || !auth.jwt || !auth.user) {
        return <Navigate to="/signin" />;
    }

    return children;
};

export default PrivateRoute; 