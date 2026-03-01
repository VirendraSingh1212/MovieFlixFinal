import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const user = localStorage.getItem('user');

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
