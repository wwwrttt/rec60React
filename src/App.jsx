import { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router";
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthStore } from "./store/useAuthStore.js";
import { useRecipeStore } from "./store/useRecipeStore.js";
import ListView from "./views/ListView.jsx";
import RecipeView from "./views/RecipeView.jsx";
import RecipeEdit from "./views/RecipeEdit.jsx";
import UserView from "./views/UserView.jsx";

import "tailwindcss";
import './App.css'

export default function App() {
    const { loginWithRedirect, logout } = useAuth0();
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const navigate = useNavigate();
    const { recipes, fetchRecipes, loading, error } = useRecipeStore();
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (isAuthenticated && !recipes.length) {// Only fetch if empty (prevents refetch on navigation)
            fetchRecipes();
        }
    }, [isAuthenticated, recipes, fetchRecipes]);

    if (isLoading) return (<div className="text-lg">Starting up...</div>)

    if (!isAuthenticated) {
        loginWithRedirect();
        return;
    }

    if (!recipes.length) {
        if (loading) return (<div className="text-lg">Loading recipes...</div>)
        if (error) {
            console.error(`Recipe fetch error: ${error}`);
            return (
                <div className="m-5 text-xl text-red-400">
                    Sorry about this, but the following error occurred while loading your recipes:
                    <br /><br />
                    {error}
                    <br />
                    <br />
                    <button className="text-white text-lg border rounded-lg p-2 bg-zinc-700" onClick={() => logout()}>Logout</button>
                </div>
            )
        }
    }

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        navigate("/list/" + e.target.value);
    }

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchChange(e);
        }
    }

    return (
        <div className="m-2 max-w-150 relative">
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
                        <td className="w-85 sm:w-100">
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
                            <div
                                onClick={() => navigate("/user")}
                                className="ml-2 cursor-pointer absolute top-[2px] right-[.6rem]"
                                title={user?.name}
                            >
                                {user?.picture &&
                                    <img src={user.picture}
                                        className="border rounded-full border-3 border-sky-700 h-[45px] w-[45px] text-2xl font-mono font-bold flex items-center justify-center cursor-pointer"
                                    />
                                }

                                {!user || !user.picture &&
                                    <div className="border rounded-full border-3 border-sky-800 h-[45px] w-[45px] text-2xl font-mono font-bold flex items-center justify-center">
                                        BL
                                    </div>
                                }
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <Routes>
                <Route index element={<ListView />} />
                <Route path="/list/:query" element={<ListView />} />
                <Route path="/rec/:id" element={<RecipeView />} />
                <Route path="/edit/:id?" element={<RecipeEdit />} />
                <Route path="/user" element={<UserView />} />
                <Route path="*" element={<ListView />} />
            </Routes>
        </div >
    );
}
