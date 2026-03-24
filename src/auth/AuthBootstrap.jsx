import { useEffect } from 'react';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useRecipeStore } from '../store/useRecipeStore';

export default function AuthBootstrap() {
    const authFetch = useAuthFetch();
    const setAuthFetch = useRecipeStore(s => s.setAuthFetch);

    useEffect(() => {
        setAuthFetch(authFetch);
    }, [authFetch, setAuthFetch]);

    return null;
}
