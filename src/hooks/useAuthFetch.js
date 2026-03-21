import { useAuth0 } from '@auth0/auth0-react';

export function useAuthFetch() {
    const { getAccessTokenSilently, logout } = useAuth0();

    const authFetch = async (url, options = {}) => {
        try {
            const token = await getAccessTokenSilently();

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
