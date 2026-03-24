import { Navigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading, } = useAuthStore();

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (!isAuthenticated) {
        return (<Navigate to="/" replace />);
    }

    return children;
}
