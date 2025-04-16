import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const { auth } = useSelector((state) => state);
    
    if (!auth.jwt) {
        // Redirect them to the login page if not authenticated
        return <Navigate to="/signin" />;
    }
    
    return children;
};

export default PrivateRoute; 