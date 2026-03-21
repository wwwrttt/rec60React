import { useAuth0 } from '@auth0/auth0-react';

export default function AuthButtons() {
    const {
        loginWithRedirect,
        logout,
        isAuthenticated,
        user,
    } = useAuth0();

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
        </div>
    );
}
