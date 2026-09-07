import { useEffect, useRef, useState } from "react";
import { getFavoritesFromStorage, setFavoritesToStorage } from "../../../utils/localStorage";

export default function useRecipeStorage() {
    const [recipe, setRecipe] = useState<string[] | null>(null);
    const recipeRef = useRef<string[] | null>(null);

    useEffect(() => {
        recipeRef.current = recipe;
    }, [recipe]);

    useEffect(() => {
        const handleReset = () => {
            setRecipe(null);
        };

        const handleAddFavorite = () => {
            const currentRecipe = recipeRef.current;
            if (!currentRecipe || currentRecipe.length === 0) return;

            const favorites = getFavoritesFromStorage();

            const isDuplicate = favorites.some((item) => {
                if (item.length !== currentRecipe.length) return false;

                const sortedItem = [...item].sort();
                const sortedCurrent = [...currentRecipe].sort();

                return sortedItem.every((val, i) => val === sortedCurrent[i]);
            });

            const value = isDuplicate ? favorites : [...favorites, currentRecipe];
            setFavoritesToStorage(value);
        };

        const handleRemoveFavorite = () => {
            const currentRecipe = recipeRef.current;
            if (!currentRecipe || currentRecipe.length === 0) return;

            const favorites = getFavoritesFromStorage();
            if (favorites.length === 0) return;

            const currentSorted = [...currentRecipe].sort().join(",");

            const newValue = favorites.filter((item) => {
                if (item.length !== currentRecipe.length) return true;

                const itemSorted = [...item].sort().join(",");
                return itemSorted !== currentSorted;
            });

            setFavoritesToStorage(newValue);
        };

        window.addEventListener("recipe-reset", handleReset);
        window.addEventListener("recipe-add-favorite", handleAddFavorite);
        window.addEventListener("recipe-remove-favorite", handleRemoveFavorite);

        return () => {
            window.removeEventListener("recipe-reset", handleReset);
            window.removeEventListener("recipe-add-favorite", handleAddFavorite);
            window.removeEventListener("recipe-remove-favorite", handleRemoveFavorite);
        };
    }, [recipeRef]);

    return {
        recipe,
        setRecipe,
        recipeRef,
    };
}
