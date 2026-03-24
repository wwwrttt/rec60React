import { useParams, useNavigate } from "react-router";
import { useRecipeStore } from "../store/useRecipeStore.js";

export default function RecipeView() {
    const { id } = useParams();
    const { recipes } = useRecipeStore();
    const nav = useNavigate();

    if (!recipes || !recipes.length) return;

    const recipe = recipes.find((r) => { return r._id === id })
    if (!recipe) return (<div className="text-xl text-red-500 mt-6 ml-2">The requested recipe could be found.</div>)

    const toHtml = (raw) => {
        let lines = raw.split("\n");
        let uid = 0;

        return (
            <>
                {lines.map((l) => { return (<div key={uid++}>{l}<br /></div>) })}
            </>
        )
    }

    window.scrollTo(0, 0);

    return (
        <div className="mt-3 select-none" onClick={() => nav("/edit/" + id)}>
            <div className="mb-5 mt-2 ml-1 text-xl inline-block">
                {recipe.name}
            </div>

            <div className="mb-4 border-1 p-2 border-gray-700 rounded-lg">
                {toHtml(recipe.ingredients)}
            </div>

            {recipe.directions &&
                <div className="mt-2 mb-4 p-2 border-1 border-gray-700 rounded-lg">
                    {toHtml(recipe.directions)}
                </div>
            }

            {recipe.author &&
                <div className="mb-4 mr-5 px-4 py-2 border-1 border-gray-700 rounded-lg inline-block">
                    {recipe.author}
                </div>
            }

            {recipe.category &&
                <div className="mb-4 px-4 py-2 border-1 border-gray-700 rounded-lg inline-block">
                    {recipe.category}
                </div>
            }
        </div>
    );
}
