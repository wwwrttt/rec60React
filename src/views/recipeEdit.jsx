import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useRecipes } from "../hooks/useRecipes";
import { useDebounce } from "../hooks/useDebounce";
import AutoTextarea from "../parts/AutoTextArea";
import ComboBox from "../parts/ComboBox";

export default function RecipeEdit() {
    const { id } = useParams();
    const { recipes, authors, categories, createRecipe, updateRecipe, deleteRecipe } = useRecipes();
    const [recId, setRecId] = useState(id ?? null);
    const [form, setForm] = useState({
        name: "",
        ingredients: "",
        directions: "",
        category: "",
        author: ""
    });
    const creatingRef = useRef(false);
    const lastSaveRef = useRef(0);
    const debouncedForm = useDebounce(form, 800);
    const nav = useNavigate();

    const existing = recipes.find(r => r._id === id);
    useEffect(() => {
        if (existing) {
            setForm(existing);
            setRecId(existing._id);
        }
    }, [existing, setRecId, recId]);

    const isDirty = JSON.stringify(existing) !== JSON.stringify(debouncedForm);
    useEffect(() => {
        if (!debouncedForm.name) return;
        if (!isDirty) return;

        const save = async () => {
            const saveId = Date.now();
            lastSaveRef.current = saveId;

            try {
                if (!recId && !creatingRef.current) {
                    creatingRef.current = true;
                    const created = await createRecipe(debouncedForm);

                    if (lastSaveRef.current !== saveId) return;

                    setRecId(created._id);
                    creatingRef.current = false;
                    return;
                }

                if (recId) {
                    await updateRecipe(recId, debouncedForm);
                    if (lastSaveRef.current !== saveId) return;
                }

            } catch (err) {
                creatingRef.current = false;
                console.error("Autosave failed", err);
            }
        };

        save();
    }, [debouncedForm, isDirty, recId, setRecId, createRecipe, updateRecipe, nav]);

    if (recId && !form.name) return;

    const updateField = (field) => (e) => {
        updateNamedValue(field, e.target.value);
    };

    const updateNamedValue = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to permenently delete this recipe?")) {
            updateNamedValue("name", "");
            deleteRecipe(id);
            nav("/");
        }
    }

    window.scrollTo(0, 0);

    return (
        <div className="mt-3 max-w-150">
            <input
                className="w-full mb-5 text-xl border-1 p-2 border-gray-700 rounded-lg"
                placeholder="recipe name"
                value={form.name}
                onChange={updateField("name")}
            />

            <AutoTextarea
                className="w-full mb-4 border-1 p-2 border-gray-700 rounded-lg"
                placeholder="ingredients"
                value={form.ingredients}
                onChange={updateField("ingredients")}
            />

            <AutoTextarea
                className="w-full mb-4 border-1 p-2 border-gray-700 rounded-lg"
                placeholder="directions"
                value={form.directions}
                onChange={updateField("directions")}
            />

            <ComboBox
                value={form.author}
                options={authors}
                placeholder="author"
                className="mb-4 mr-4 inline-block form-input"
                onChange={(val) => updateNamedValue('author', val)}
            />

            <ComboBox
                value={form.category}
                options={categories}
                placeholder="category"
                className="mb-4 mr-4 inline-block form-input"
                onChange={(val) => updateNamedValue('category', val)}
                typeAhead={true}
            />

            {recId &&
                <div className="float-right">
                    <button className="border rounded-lg p-2" onClick={() => handleDelete(recId)}>Delete</button>
                </div>
            }
        </div>
    );
}
