import { useEffect } from 'react';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useAuthStore } from '../store/useAuthStore';
import { useRecipeStore } from '../store/useRecipeStore';

export default function AuthBootstrap() {
    const authFetch = useAuthFetch();
    const accessToken = useAuthStore(s => s.accessToken);
    const setAuthFetch = useRecipeStore(s => s.setAuthFetch);

    useEffect(() => {
        if (accessToken) {
            setAuthFetch(authFetch);
        }
    }, [authFetch, setAuthFetch, accessToken]);

    return null;
}
