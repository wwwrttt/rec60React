import { useAuth0 } from '@auth0/auth0-react';
import { useAuthStore } from '../store/useAuthStore';

export function useAuthFetch() {
    const { logout } = useAuth0();
    const token = useAuthStore(s => s.accessToken);

    const authFetch = async (url, options = {}) => {
        try {
            const res = await fetch(url, {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 401) {
                // token expired or invalid
                logout({ logoutParams: { returnTo: window.location.origin } });
                return;
            }

            return res;
        } catch (err) {
            console.error('Auth fetch error', err);
            throw err;
        }
    };

    return authFetch;
}
