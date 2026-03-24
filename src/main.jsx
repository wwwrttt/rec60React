import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthHydrator } from './auth/AuthHydrator.js'
import AuthProvider from './auth/AuthProvider.jsx'
import AuthBootstrap from './auth/AuthBootstrap.jsx'
import App from "./App.jsx"

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AuthHydrator>
                    <AuthBootstrap />
                    <App />
                </AuthHydrator>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)
