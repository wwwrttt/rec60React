import { create } from 'zustand';

const normalizeText = (str) =>
    (str || '').replace(/\r\n/g, '\n').trim();

const normalizeKey = (str) =>
    normalizeText(str).toLowerCase();

const normalizeRecipe = (r) => {
    return {
        ...r,
        name: normalizeText(r.name),
        ingredients: normalizeText(r.ingredients),
        directions: normalizeText(r.directions),
        author: normalizeText(r.author),
        category: normalizeText(r.category)
    }
}

// Deduplicate + preserve original casing of first occurrence
const extractUnique = (recipes, field) => {
    const map = new Map();

    recipes.forEach((r) => {
        const raw = normalizeText(r[field]);
        if (!raw) return;

        const key = normalizeKey(raw);
        if (!map.has(key)) {
            map.set(key, raw);
        }
    });

    return Array.from(map.values()).sort((a, b) =>
        a.localeCompare(b)
    );
};

const sortRecipes = (r1, r2) => {
    if (!r1?.name || !r2?.name) return 0;

    return r1.name.toLowerCase().trim().localeCompare(r2.name.toLowerCase().trim());
};


export const useRecipeStore = create((set, get) => ({
    recipes: [],
    authors: [],
    categories: [],
    pagination: null,
    authFetch: null,
    loading: false,
    error: null,

    setAuthFetch: (authFetch) => set({ authFetch }),

    // --- Fetch
    fetchRecipes: async (params = {}) => {
        const authFetch = get().authFetch;
        if (!authFetch) throw new Error('Auth not initialized');

        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const query = new URLSearchParams(params).toString();
            const res = await authFetch(`/api/recipes?${query}`);

            if (res.status === 403) {
                throw new Error("You do not have rights to be sniffing around here");
            }

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            const normalized = data.data.map(normalizeRecipe);

            set({
                recipes: normalized,
                authors: extractUnique(normalized, 'author'),
                categories: extractUnique(normalized, 'category'),
                pagination: data.pagination,
                loading: false
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // --- Create
    createRecipe: async (recipe) => {
        const authFetch = get().authFetch;
        if (!authFetch) throw new Error('Auth not initialized');

        const res = await authFetch('/api/recipes', {
            method: 'POST',
            body: JSON.stringify(recipe)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        set(state => {
            const recipes = [data.data, ...state.recipes].sort(sortRecipes);

            return {
                recipes,
                authors: extractUnique(recipes, 'author'),
                categories: extractUnique(recipes, 'category'),
            };
        });

        return data.data;
    },

    // --- Update
    updateRecipe: async (id, updates) => {
        const authFetch = get().authFetch;
        if (!authFetch) throw new Error('Auth not initialized');

        const res = await authFetch(`/api/recipes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        set(state => {
            const recipes = state.recipes
                .map(r => r._id === id ? data.data : r)
                .sort(sortRecipes);

            return {
                recipes,
                authors: extractUnique(recipes, 'author'),
                categories: extractUnique(recipes, 'category'),
            };
        });

        return data.data;
    },

    // --- Delete (optimistic)
    deleteRecipe: async (id) => {
        const prev = get();
        const authFetch = prev.authFetch;
        if (!authFetch) throw new Error('Auth not initialized');

        set(state => {
            const recipes = state.recipes.filter(r => r._id !== id);

            return {
                recipes,
                authors: extractUnique(recipes, 'author'),
                categories: extractUnique(recipes, 'category'),
            };
        });

        try {
            const res = await authFetch(`/api/recipes/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }

        } catch (err) {
            set({
                recipes: prev.recipes,
                authors: prev.authors,
                categories: prev.categories
            });
            throw err;
        }
    }
}));
