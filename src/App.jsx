import { useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router";
import { useRecipes } from "./hooks/useRecipes";
import ListView from "./views/listView";
import "tailwindcss";
import './App.css'
import RecipeView from "./views/recipeView";

export default function App() {
    const nav = useNavigate(),
        { recipes, loading } = useRecipes(),
        [query, setQuery] = useState("");

    if (loading) return (<div className="text-lg">Loading recipes...</div>)

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        nav("/list/" + e.target.value);
    }

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchChange();
        }
    }

    return (
        <div className="m-2">
            <table>
                <tbody>
                    <tr>
                        <td >
                            <Link to="/">
                                <div className="border-1 rounded-sm border-sky-700 mr-2 pt-2 h-[45px] w-[45px] text-center text-lg font-bold">R</div>
                            </Link>
                        </td>
                        <td className="w-full sm:w-100">
                            <input className="border-1 rounded-sm border-sky-700 p-2 focus:border-1 focus:border-sky-700 h-[45px] w-[100%]" type="text" value={query} onChange={handleSearchChange} onKeyDown={handleSearchKeyDown} placeholder="Search" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <Routes>
                <Route index element={<ListView recipes={recipes} />} />
                <Route path="/list/:q" element={<ListView recipes={recipes} />} />
                <Route path="/rec/:id" element={<RecipeView recipes={recipes} />} />
                <Route path="*" element={<ListView recipes={recipes} />} />
            </Routes>
        </div >
    );
}
