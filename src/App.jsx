import { useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router";
import { useRecipes } from "./hooks/useRecipes";
import ListView from "./views/listView";
import RecipeView from "./views/recipeView";
import RecipeEdit from "./views/recipeEdit";
import "tailwindcss";
import './App.css'

export default function App() {
    const nav = useNavigate(),
        { recipes, loading, error } = useRecipes(),
        [query, setQuery] = useState("");

    if (loading) return (<div className="text-lg">Loading recipes...</div>)
    if (error) { return (<div className="txt-lg">Error... {error}</div>) }

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
            <table>
                <tbody>
                    <tr>
                        <td className="">
                            <Link to="/">
                                <div className="inline-block border-1 rounded-sm border-sky-700 mr-2 pt-1 h-[45px] w-[45px] text-center text-xl font-bold">R</div>
                            </Link>
                        </td>
                        <td className="w-full sm:w-100">
                            <input
                                className="w-full border-1 text-xl pl-2 pb-2 rounded-sm border-sky-700 focus:border-1 focus:border-sky-700 h-[45px]"
                                type="text"
                                value={query}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Search"
                            />
                        </td>
                        <td className="">
                            <Link to="/edit/">
                                <div className="inline-block border-1 rounded-sm border-sky-700 ml-2 h-[45px] w-[45px] text-center text-3xl font-bold">+</div>
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
