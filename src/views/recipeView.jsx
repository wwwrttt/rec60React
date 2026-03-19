import { useParams, useNavigate } from "react-router";
import { useRecipes } from "../hooks/useRecipes";

export default function RecipeView() {
    const { id } = useParams();
    const { recipes, deleteRecipe } = useRecipes();
    const nav = useNavigate();

    const recipe = recipes.find((r) => { return r._id === id })
    if (!recipe) return (<div className="text-xl text-red-500 mt-6 ml-2">The requested recipe could be found.</div>)

    const toHtml = (raw) => {
        let lines = raw.split("\n");
        let uid = 0;

        return (
            <div style={{ qqqfontFamily: "monospace" }}>
                {lines.map((l) => { return (<div key={uid++}>{l}<br /></div>) })}
            </div >
        )
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to permenently delete this recipe?")) {
            deleteRecipe(id);
            nav("/");
        }
    }

    window.scrollTo(0, 0);

    return (
        <div className="m-3 max-w-150 select-none" onClick={() => nav("/edit/" + id)}>
            <div className="mb-4 text-xl p-2 inline-block">
                {recipe.name}
            </div>
            <div className="float-right">
                <button className="border rounded-lg p-2 ml-5" onClick={() => handleDelete(recipe._id)}>Delete</button>
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
                <div className="mb-4 px-4 py-2 border-1 border-gray-700 rounded-lg inline-block">
                    {recipe.author}
                </div>
            }

            {recipe.category &&
                <div className="mb-4 ml-5 px-4 py-2 border-1 border-gray-700 rounded-lg inline-block">
                    {recipe.category}
                </div>
            }
        </div>
    );
}
