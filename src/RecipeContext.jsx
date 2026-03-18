import { useState, useEffect, useContext, createContext } from "react";

const RecipeContext = createContext(null);

export default function RecipeProvider({ children }) {
    const [recipes, setRecipes] = useState();

    useEffect(() => {
        async function getRecipes() {
            const BASE_API_URL = document.location.href.indexOf("localhost") > 0 ? "http://localhost:3300/" : "https://rec60.netlify.app/",
                res = await fetch(`${BASE_API_URL}.netlify/functions/server/recipes/?111`),
                recs = await res.json();

            setRecipes(recs.data);
        }

        if (!recipes || !recipes.length) {
            getRecipes();
        }
    }, []);

    return (
        <RecipeContext.Provider value={{ recipes }}>
            {children}
        </RecipeContext.Provider>
    )
};

export const useRecipes = () => {
    return useContext(RecipeContext).recipes;
};
