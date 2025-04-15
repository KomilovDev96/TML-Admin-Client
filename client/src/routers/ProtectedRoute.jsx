// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token'); // Проверяем токен

    if (!token) {
        return <Navigate to="/login" replace />; // Редирект, если нет токена
    }

    return <Outlet />; // Рендерим дочерние роуты, если токен есть
};

export default ProtectedRoute;