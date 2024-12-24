import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../utils/auth.jsx'

const PrivateRoute = ({ children, keyType }) => {
    if (auth.isAuthenticated(keyType)) {
        return children;
    }
    return <Navigate to="/login" />;
};

export default PrivateRoute;
