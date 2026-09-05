import defaultFile from "../../utils/defaultFile";
import CONFIG from "../../config/config.json";
import EMOJIS from "../../config/emojis.json";
import type { RecipeData } from "../../interface/recipe";
import Glass from "./Glass";

interface RecipeProps {
    recipe: RecipeData | null;
}

export default function Recipe({ recipe }: RecipeProps) {
    return (
        <div
            style={{
                position: "absolute",
                bottom: "0%",
                right: "0%",
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
                Recipe
            </h2>
            <div
                style={{
                    width: "100%",
                    height: "390px",
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: "10px",
                    gap: "16px",
                }}
            >
                {recipe && (
                    <>
                        <div
                            style={{
                                width: "100%",
                                height: "140px",
                                minHeight: "140px",
                                display: "flex",
                                justifyContent: "space-between  ",
                                alignItems: "flex-start",
                                gap: "10px",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    overflow: "hidden",
                                }}
                            >
                                <h3>Composition 1</h3>
                                <p
                                    style={{
                                        margin: "0",
                                        display: "-webkit-box",
                                        WebkitLineClamp: "5",
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        fontSize: "15px",
                                    }}
                                >
                                    {recipe.desciption}
                                </p>
                            </div>
                            <div
                                style={{
                                    height: "140px",
                                    width: "110px",
                                    minHeight: "140px",
                                    minWidth: "110px",
                                    borderRadius: "5px",
                                    background: "#424348",
                                }}
                            >
                                <Glass />
                            </div>
                        </div>

                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexDirection: "column",
                                gap: "5px",
                            }}
                        >
                            <h3>Preparation</h3>
                            <p
                                style={{
                                    margin: "0",
                                    textAlign: "justify",
                                    fontSize: "15px",
                                }}
                            >
                                Add the emojis to the blender, blend for{" "}
                                {CONFIG.blendDuration / 1000} seconds and your drink is ready.
                            </p>
                        </div>

                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexDirection: "column",
                                gap: "5px",
                            }}
                        >
                            <h3>Ingredients</h3>
                            <div
                                style={{
                                    height: "36px",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    flexWrap: "nowrap",
                                    overflowX: "auto",
                                    gap: "10px",
                                    paddingBottom: "6px",
                                }}
                            >
                                {recipe.emojis.map((emoji, index) => (
                                    <img
                                        key={index}
                                        src={`./emojis/${defaultFile(EMOJIS.find((e) => e.name === emoji)?.files || ["red_question_mark.png"])}`}
                                        alt={emoji}
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            className="recipe-button"
                            style={{
                                width: "100%",
                                height: "45px",
                                background: "#424348",
                                border: "none",
                                borderRadius: "5px",
                                color: "#EBEBEE",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Prepare
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
