import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAuthFetch } from '../hooks/useAuthFetch';

export default function AuthButtons() {
    const { loginWithRedirect, logout } = useAuth0();
    const { isAuthenticated, user } = useAuthStore();

    const authFetch = useAuthFetch();
    const [pageUser, setPageUser] = useState();

    if (!isAuthenticated) {
        return (
            <button
                onClick={() => loginWithRedirect()}
                className="px-3 py-1 border rounded"
            >
                Log In
            </button>
        );
    }

    const getPageUser = async () => {
        const res = await authFetch("http://localhost:3300/pageuser");
        const data = await res.json();

        if (data) {
            setPageUser(data);
        }
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm">{user?.name}</span>
            <button
                onClick={() =>
                    logout({ logoutParams: { returnTo: window.location.origin } })
                }
                className="px-3 py-1 border rounded"
            >
                Log Out
            </button>
            <button onClick={getPageUser}>Page User</button>
            {pageUser &&
                <div>Server says:  {JSON.stringify(pageUser)}</div>
            }
        </div>
    );
}
