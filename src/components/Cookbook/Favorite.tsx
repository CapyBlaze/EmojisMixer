import defaultFile from "../../utils/defaultFile";
import EMOJIS from "../../config/emojis.json";
import { useEffect, useState, type Dispatch } from "react";
import type { RecipeData } from "../../interface/recipe";
import { generateRecipeData } from "../../utils/generateRecipeData";

interface FavoriteProps {
    setRecipe: Dispatch<React.SetStateAction<RecipeData | null>>;
}

export default function Favorite({ setRecipe }: FavoriteProps) {
    const loadFavorites = (): RecipeData[] => {
        const getSerializedValue = localStorage.getItem("emojis-mixer-favorite");
        if (!getSerializedValue) return [];

        try {
            const favorites = JSON.parse(getSerializedValue) as number[][];

            return favorites.map((fav) => {
                const emojis = fav.map((index) => EMOJIS[index]?.name || "red_question_mark");
                return generateRecipeData(emojis);
            });
        } catch (error) {
            console.error("Failed to parse favorites", error);
            return [];
        }
    };

    const [favorite, setFavorite] = useState<RecipeData[]>(loadFavorites());

    useEffect(() => {
        const handleUpdateFavorites = () => {
            setFavorite(loadFavorites());
        };

        window.addEventListener("recipe-add-favorite", handleUpdateFavorites);
        window.addEventListener("recipe-remove-favorite", handleUpdateFavorites);

        window.addEventListener("storage", handleUpdateFavorites);

        return () => {
            window.removeEventListener("recipe-add-favorite", handleUpdateFavorites);
            window.removeEventListener("recipe-remove-favorite", handleUpdateFavorites);
            window.removeEventListener("storage", handleUpdateFavorites);
        };
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                bottom: "0%",
                left: "0%",
                width: "278px",
                height: "452px",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexDirection: "column",
                padding: "25px",
                gap: "10px",
            }}
        >
            <h2
                style={{
                    textTransform: "uppercase",
                    borderBottom: "3px solid #B1B3B8",
                    height: "38px",
                    width: "100%",
                    textAlign: "center",
                    margin: "0",
                }}
            >
                Favorites
            </h2>
            <div
                style={{
                    width: "100%",
                    height: "390px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "auto",
                    paddingLeft: "5px",
                    paddingRight: "15px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    gap: "10px",
                    boxSizing: "border-box",
                }}
            >
                {favorite.map((composition, index) => (
                    <div
                        key={index}
                        onClick={() => setRecipe(composition)}
                        className="container-compositions"
                        style={{
                            width: "100%",
                            height: "75px",
                            minHeight: "75px",
                            background: "#EBEBEE",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            borderRadius: "10px",
                            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
                            padding: "5px",
                            boxSizing: "border-box",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                background: "var(--secondary-container, #dedede)",
                                position: "relative",
                                border: "1px solid #B1B3B8",
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxSizing: "border-box",
                                borderRadius: "5px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: "20%",
                                    maxWidth: "20%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    src={`./emojis/${defaultFile(EMOJIS.find((e) => e.name === composition.emojis[0])?.files || ["red_question_mark.png"])}`}
                                    alt={composition.emojis[0]}
                                    className="not-selected"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    width: "70%",
                                    maxWidth: "70%",
                                    height: "60%",
                                }}
                            >
                                <h3
                                    style={{
                                        width: "92%",
                                        height: "100%",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        display: "-webkit-box",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}
                                >
                                    {composition.name}
                                </h3>
                            </div>
                            <div
                                style={{
                                    width: "10%",
                                    maxWidth: "10%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    background: "var(--secondary-container, #dedede)",
                                    overflow: "hidden",
                                }}
                            ></div>
                        </div>

                        <div
                            className="favorite-recipe"
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                width: "30px",
                                height: "30px",
                                background: "#9b9b9b",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "0px 4px 0px 5px",
                                borderTop: "1px solid #B1B3B8",
                                borderRight: "1px solid #B1B3B8",
                            }}
                        >
                            <img
                                src={`./star-white.svg`}
                                alt="Star"
                                className="not-selected"
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
