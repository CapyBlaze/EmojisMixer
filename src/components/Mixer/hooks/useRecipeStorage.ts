import { useEffect, useRef, useState } from "react";
import EMOJIS from "../../../config/emojis.json";

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

        const getFavoritesFromStorage = (): string[][] => {
            const getSerializedValue = localStorage.getItem("emojis-mixer-favorite");
            if (!getSerializedValue) return [];

            try {
                const favorites = JSON.parse(getSerializedValue) as (string | number)[][];
                return favorites.map((fav) =>
                    fav.map((item) =>
                        typeof item === "number" ? EMOJIS[item]?.name || "red_question_mark" : item,
                    ),
                );
            } catch (error) {
                console.error("Failed to parse favorites", error);
                return [];
            }
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
            localStorage.setItem("emojis-mixer-favorite", JSON.stringify(value));
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

            localStorage.setItem("emojis-mixer-favorite", JSON.stringify(newValue));
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
