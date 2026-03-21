import { useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router";
import { useRecipes } from "./hooks/useRecipes.js";
import { useAuth0 } from '@auth0/auth0-react';
import ListView from "./views/listView";
import RecipeView from "./views/recipeView";
import RecipeEdit from "./views/recipeEdit";
import AuthButtons from "./parts/AuthButtons";

import "tailwindcss";
import './App.css'

export default function App() {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const nav = useNavigate(),
        { recipes, loading, error } = useRecipes(),
        [query, setQuery] = useState("");

    if (isLoading) return (<div className="text-lg">Auth provider is loading...</div>)
    if (loading) return (<div className="text-lg">Loading recipes...</div>)
    if (error) { return (<div className="txt-lg">Error... {error}</div>) }

    if (!isAuthenticated) {
        loginWithRedirect();
        return;
    }

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        nav("/list/" + e.target.value);
    }

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchChange(e);
        }
    }

    return (
        <div className="m-2">
            <AuthButtons />
            <table>
                <tbody>
                    <tr>
                        <td className="">
                            <Link to="/">
                                <div className="border rounded-sm border-sky-700 mr-2 h-[45px] w-[45px] text-2xl font-bold flex items-center justify-center">
                                    <span className="-mt-[5px]">R</span>
                                </div>
                            </Link>
                        </td>
                        <td className="w-full sm:w-100">
                            <input
                                className="w-full border text-xl pl-2 pb-2 rounded-sm border-sky-700 focus:border-1 focus:border-sky-700 h-[45px]"
                                type="text"
                                value={query}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Search"
                            />
                        </td>
                        <td className="">
                            <Link to="/edit/">
                                <div className="border rounded-sm border-sky-700 ml-2 h-[45px] w-[45px] text-4xl font-mono font-bold flex items-center justify-center">
                                    <span className="-mt-[5px]">+</span>
                                </div>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>

            <Routes>
                <Route index element={<ListView recipes={recipes} />} />
                <Route path="/list/:query" element={<ListView recipes={recipes} />} />
                <Route path="/rec/:id" element={<RecipeView recipes={recipes} />} />
                <Route path="/edit/:id?" element={<RecipeEdit recipes={recipes} />} />
                <Route path="*" element={<ListView recipes={recipes} />} />
            </Routes>
        </div >
    );
}
