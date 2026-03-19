import { create } from 'zustand';

const sortRecipes = (r1, r2) => {
    if (!r1?.name || !r2?.name) return 0;

    return r1.name.toLowerCase().trim().localeCompare(r2.name.toLowerCase().trim());
};

export const useRecipeStore = create((set, get) => ({
    recipes: [],
    pagination: null,
    loading: false,
    error: null,

    // --- Fetch
    fetchRecipes: async (params = {}) => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const query = new URLSearchParams(params).toString();
            const res = await fetch(`/api/recipes?${query}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            set({
                recipes: data.data,
                pagination: data.pagination,
                loading: false
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // --- Create
    createRecipe: async (recipe) => {
        const res = await fetch('/api/recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipe)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        set(state => ({
            recipes: ([data.data, ...state.recipes].sort(sortRecipes))
        }));

        return data.data;
    },

    // --- Update
    updateRecipe: async (id, updates) => {
        const res = await fetch(`/api/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        set(state => ({
            recipes: state.recipes
                .map(r => r._id === id ? data.data : r)
                .sort(sortRecipes)
        }));

        return data.data;
    },

    // --- Delete (optimistic)
    deleteRecipe: async (id) => {
        const prev = get().recipes;

        // optimistic update
        set(state => ({
            recipes: state.recipes.filter(r => r._id !== id)
        }));

        try {
            const res = await fetch(`/api/recipes/${id}`, {
                method: 'DELETE'
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

        } catch (err) {
            // rollback
            set({ recipes: prev });
            throw err;
        }
    }
}));