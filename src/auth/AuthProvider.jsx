import { Auth0Provider } from '@auth0/auth0-react';

const AUTH0_DOMAIN = "4threalm.auth0.com";
const AUTH0_AUDIANCE = "https://rec60-api";
const AUTH0_CLIENT_ID = "Am89W4XYUiPAIcog9q4D7J5D6Xo3EJMw";

export default function AuthProvider({ children }) {
    return (
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            }}
            cacheLocation="localstorage"
            useRefreshTokens={true}
        >
            {children}
        </Auth0Provider>
    );
}
