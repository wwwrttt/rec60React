import { useParams } from "react-router";
import { useRecipes } from "../hooks/useRecipes";
import { useNavigate } from "react-router";

export default function RecipeView() {
    const params = useParams();
    const { recipes, loading, error, deleteRecipe } = useRecipes();
    const nav = useNavigate();

    if (loading) { return (<div className="txt-lg">Still loading recipes...</div>) }
    if (error) { return (<div className="txt-lg">Error... {error}</div>) }

    let uid = 0;
    const toHtml = (raw) => {
        let lines = raw.split("\n");

        return (
            lines.map((l) => {
                return (<div key={uid++}>{l}<br /></div>)
            })
        )
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to permenently delete this recipe?")) {
            deleteRecipe(id);
            nav("/");
        }
    }

    window.scrollTo(0, 0);

    const recipe = recipes.find((r) => { return r._id === params.id })

    if (!recipe) return (<div className="text-xl text-red-500 mt-6 ml-2">The requested recipe could be found.</div>)
    return (
        <div className="m-3 max-w-150">
            <div className="mb-4 text-xl p-2">
                {recipe.name} <div className="inline-block"><button className="border rounded-lg p-1 ml-5" onClick={() => handleDelete(recipe._id)}>Delete</button></div>
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
        </div >
    );
}
