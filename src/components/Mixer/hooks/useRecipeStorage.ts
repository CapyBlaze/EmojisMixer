import { useEffect, useRef, useState } from "react";

export default function useRecipeStorage() {
    const [recipe, setRecipe] = useState<number[] | null>(null);
    const recipeRef = useRef<number[] | null>(null);

    useEffect(() => {
        recipeRef.current = recipe;
    }, [recipe]);

    useEffect(() => {
        const handleRecipeReset = () => {
            setRecipe(null);
        };

        const handleRecipeAddFavorite = () => {
            const currentRecipe = recipeRef.current;
            if (!currentRecipe || currentRecipe.length === 0) return;

            const getSerializedValue = localStorage.getItem("emojis-mixer-favorite");
            const favorites = getSerializedValue
                ? (JSON.parse(getSerializedValue) as number[][])
                : null;

            const isDuplicate = favorites
                ? favorites.some((item) => {
                      if (item.length !== currentRecipe.length) return false;

                      const sortedItem = [...item].sort();
                      const sortedCurrent = [...currentRecipe].sort();

                      return sortedItem.every((val, i) => val === sortedCurrent[i]);
                  })
                : false;

            const value = favorites
                ? isDuplicate
                    ? favorites
                    : [...favorites, currentRecipe]
                : [currentRecipe];

            const setSerializedValue = JSON.stringify(value);
            localStorage.setItem("emojis-mixer-favorite", setSerializedValue);
        };

        const handleRecipeRemoveFavorite = () => {
            const currentRecipe = recipeRef.current;
            if (!currentRecipe || currentRecipe.length === 0) return;

            const getSerializedValue = localStorage.getItem("emojis-mixer-favorite");
            const favorites = getSerializedValue
                ? (JSON.parse(getSerializedValue) as number[][])
                : null;

            const currentSorted = [...currentRecipe].sort().join(",");

            if (!favorites || favorites.length === 0) return;

            const newValue = favorites.filter((item) => {
                if (item.length !== currentRecipe.length) return true;

                const itemSorted = [...item].sort().join(",");
                return itemSorted !== currentSorted;
            });

            const setSerializedValue = JSON.stringify(newValue);
            localStorage.setItem("emojis-mixer-favorite", setSerializedValue);
        };

        window.addEventListener("recipe-reset", handleRecipeReset);
        window.addEventListener("recipe-add-favorite", handleRecipeAddFavorite);
        window.addEventListener("recipe-remove-favorite", handleRecipeRemoveFavorite);

        return () => {
            window.removeEventListener("recipe-reset", handleRecipeReset);
            window.removeEventListener("recipe-add-favorite", handleRecipeAddFavorite);
            window.removeEventListener("recipe-remove-favorite", handleRecipeRemoveFavorite);
        };
    }, [recipeRef]);

    return {
        recipe,
        setRecipe,
        recipeRef,
    };
}
