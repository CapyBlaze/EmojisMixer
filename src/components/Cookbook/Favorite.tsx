import defaultFile from "../../utils/defaultFile";
import EMOJIS from "../../config/emojis.json";
import RECIPE from "../../config/recipe.json";
import type { Dispatch } from "react";
import type { RecipeData } from "../../interface/recipe";

interface FavoriteProps {
    setRecipe: Dispatch<React.SetStateAction<RecipeData | null>>;
}

export default function Favorite({ setRecipe }: FavoriteProps) {
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
                    overflowY: "auto",
                    paddingRight: "10px",
                }}
            >
                {RECIPE.map((composition, index) => (
                    <div
                        key={index}
                        onClick={() => setRecipe(composition)}
                        className="container-compositions"
                        style={{
                            width: "100%",
                            height: "75px",
                            minHeight: "75px",
                            borderBottom: "1px solid #B1B3B8",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <img
                            src={`./emojis/${defaultFile(EMOJIS.find((e) => e.name === composition.emojis[0])?.files || ["red_question_mark.png"])}`}
                            alt={composition.emojis[0]}
                            style={{
                                width: "24px",
                                height: "24px",
                            }}
                        />
                        {composition.name}
                        <img
                            src={`./emojis/${defaultFile(EMOJIS.find((e) => e.name === composition.emojis[-1])?.files || ["red_question_mark.png"])}`}
                            alt={composition.emojis[-1]}
                            style={{
                                width: "24px",
                                height: "24px",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
