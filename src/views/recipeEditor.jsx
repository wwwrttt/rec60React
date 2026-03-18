import { useState } from "react";

export default function recipeEditor({ recipe }) {
    const [form]
    const toHtml = (raw) => {
        let lines = raw.split("\n");

        return (
            lines.map((l) => {
                return (<div key={uid++}>{l}<br /></div>)
            })
        )
    }

    window.scrollTo(0, 0);
    return (
        <div className="m-3 max-w-150">
            <div className="mb-4 text-xl p-2">
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
