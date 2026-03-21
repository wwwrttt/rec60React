// /src/hooks/useRecipes.js
import { useEffect } from 'react';
import { useRecipeStore } from '../store/recipeStore';

export function useRecipes() {
    const store = useRecipeStore();

    useEffect(() => {
        if (!store.recipes.length) {// Only fetch if empty (prevents refetch on navigation)
            store.fetchRecipes();
        }
    }, []);

    return store;
}
