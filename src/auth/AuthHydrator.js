import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthStore } from "../store/useAuthStore";

export function AuthHydrator({ children }) {
    const {
        isLoading,
        isAuthenticated,
        user,
        getAccessTokenSilently
    } = useAuth0();

    const setAuth = useAuthStore((s) => s.setAuth);
    const hasHydrated = useRef(false);

    useEffect(() => {
        if (isLoading || hasHydrated.current) return;

        const hydrate = async () => {
            try {
                let token = null;

                if (isAuthenticated) {
                    token = await getAccessTokenSilently();
                }

                setAuth({
                    isLoading: false,
                    isAuthenticated,
                    user,
                    accessToken: token
                });
            } catch (e) {
                console.error("Auth hydration failed", e);
            } finally {
                hasHydrated.current = true;
            }
        };

        hydrate();
    }, [isLoading, isAuthenticated, user, getAccessTokenSilently, setAuth]);

    return children;
}
