import { useEffect, useState } from "react";
import Favorite from "./Cookbook/Favorite";
import Recipe from "./Cookbook/Recipe";
import type { RecipeData } from "../interface/recipe";

export default function Cookbook() {
    const [recipe, setRecipe] = useState<RecipeData | null>(null);
    const [showCookbook, setShowCookbook] = useState(false);

    useEffect(() => {
        const handleShowCookbook = () => {
            setShowCookbook(true);
        };

        const handleHideCookbook = () => {
            setShowCookbook(false);
        };

        window.addEventListener("cookbook-show", handleShowCookbook);
        window.addEventListener("cookbook-hide", handleHideCookbook);

        return () => {
            window.removeEventListener("cookbook-show", handleShowCookbook);
            window.removeEventListener("cookbook-hide", handleHideCookbook);
        };
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: showCookbook
                    ? "translate(-50%, -50%) scale(1)"
                    : "translate(-50%, -50%) scale(0.95)",
                opacity: showCookbook ? 1 : 0,
                visibility: showCookbook ? "visible" : "hidden",
                transition: "opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease",

                background: "#47484D",
                width: "700px",
                height: "500px",
                boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 10px 2px",
                borderRadius: "15px",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) ",
                    translate: "0 -15px",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "#EBEBEE",
                        width: "660px",
                        height: "490px",
                        borderRadius: "0 0 5px 5px",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            translate: "0 -1px",
                            background: "#B1B3B8",
                            width: "4px",
                            height: "492px",
                            borderRadius: "5px 5px 0 0",
                        }}
                    ></div>

                    <div
                        style={{
                            position: "absolute",
                            top: "-25px",
                            left: "0%",
                            background: "#EBEBEE",
                            width: "328px",
                            height: "50px",
                            borderRadius: "100%",
                        }}
                    ></div>
                    <div
                        style={{
                            position: "absolute",
                            top: "-25px",
                            right: "0%",
                            background: "#EBEBEE",
                            width: "328px",
                            height: "50px",
                            borderRadius: "100%",
                        }}
                    ></div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "660px",
                        height: "490px",
                        borderRadius: "0 0 5px 5px",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-25px",
                            left: "0%",
                            background: "#B1B3B8",
                            width: "328px",
                            height: "50px",
                            borderRadius: "100%",
                            clipPath: "polygon(0% 0, 100% 0%, 100% 50%, 0 50%)",
                        }}
                    ></div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-25px",
                            right: "0%",
                            background: "#B1B3B8",
                            width: "328px",
                            height: "50px",
                            borderRadius: "100%",
                            clipPath: "polygon(0% 0, 100% 0%, 100% 50%, 0 50%)",
                        }}
                    ></div>

                    <Favorite setRecipe={setRecipe} />
                    <Recipe recipe={recipe} />
                </div>
            </div>
            <button
                onClick={() => {
                    window.dispatchEvent(new CustomEvent("cookbook-hide"));
                }}
                className="cookbook-button not-selected"
                style={{
                    background: "#7C7E84",
                    width: "42px",
                    height: "42px",
                    position: "absolute",
                    top: "0",
                    right: "0",
                    borderRadius: "50px",
                    border: "none",
                    cursor: "pointer",
                    translate: "-2px -31px",
                }}
            >
                <img
                    src="./close.svg"
                    alt="Close"
                    fetchPriority="high"
                    style={{ width: "100%", height: "100%" }}
                />
            </button>
        </div>
    );
}
