import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import RecipeProvider from './RecipeContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <RecipeProvider>
                <App />
            </RecipeProvider>
        </BrowserRouter>
    </StrictMode>,
)
