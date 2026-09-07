import { useEffect, useState, type CSSProperties } from "react";
import exportImage from "../../utils/exportImage";
import ButtonCheck from "./ButtonCheck";
import type { EmojiData } from "../../interface/emoji";

interface ButtonProps {
    canvas: React.RefObject<HTMLCanvasElement | null>;
    recipe: EmojiData[] | null;
}

export default function Button({ canvas, recipe }: ButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const isActive = (recipe?.length ?? 0) > 0;

    useEffect(() => {
        // const getSerializedValue = localStorage.getItem("emojis-mixer-favorite");
        // const favorites = getSerializedValue
        //     ? (JSON.parse(getSerializedValue) as number[][])
        //     : null;
        // const isDuplicate = favorites
        //     ? favorites.some((item) => {
        //           if (item.length !== currentRecipe.length) return false;
        //           const sortedItem = [...item].sort();
        //           const sortedCurrent = [...currentRecipe].sort();
        //           return sortedItem.every((val, i) => val === sortedCurrent[i]);
        //       })
        //     : false;
        // setIsFavorite(isDuplicate);
    }, [recipe]);

    const toggleFavorite = () => {
        const newValue = !isFavorite;
        setIsFavorite(newValue);

        const eventName = newValue ? "recipe-add-favorite" : "recipe-remove-favorite";
        window.dispatchEvent(new CustomEvent(eventName));
    };

    const downloadImage = () => {
        if (!canvas.current) return;
        exportImage(canvas.current);
    };

    const shareLink = () => {
        window.dispatchEvent(new CustomEvent("share-link"));
    };

    const baseIconStyle: CSSProperties = {
        width: "30px",
        height: "30px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transition: "opacity 0.25s ease, transform 0.25s ease",
    };

    return (
        <>
            <span
                style={{
                    background: "#595251",
                    position: "absolute",
                    width: "50px",
                    height: "50px",
                    bottom: "19px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "5px",
                }}
            >
                <button
                    onClick={toggleFavorite}
                    className="output-button"
                    disabled={!isActive}
                    style={{
                        background: "#786b67",
                        position: "absolute",
                        width: "42px",
                        height: "42px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "2px",
                        zIndex: 1,
                        cursor: "pointer",
                        border: "none",
                        overflow: "hidden",
                    }}
                >
                    <img
                        src="./star-outline.svg"
                        alt="Star empty"
                        draggable="false"
                        fetchPriority="high"
                        className="not-selected"
                        style={{
                            ...baseIconStyle,
                            opacity: isFavorite ? 0 : 1,
                            transform: isFavorite
                                ? "translate(-50%, -50%) scale(0.6)"
                                : "translate(-50%, -50%) scale(1)",
                        }}
                    />
                    <img
                        src="./star.svg"
                        alt="Star"
                        draggable="false"
                        className="not-selected"
                        style={{
                            ...baseIconStyle,
                            opacity: isFavorite ? 1 : 0,
                            transform: isFavorite
                                ? "translate(-50%, -50%) scale(1)"
                                : "translate(-50%, -50%) scale(0.6)",
                        }}
                    />
                </button>
            </span>

            <span
                style={{
                    background: "#595251",
                    position: "absolute",
                    width: "50px",
                    height: "50px",
                    bottom: "19px",
                    left: "25%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "5px",
                }}
            >
                <ButtonCheck
                    onClick={downloadImage}
                    disabled={!isActive}
                    icon="./image.svg"
                    alt="Image"
                />
            </span>

            <span
                style={{
                    background: "#595251",
                    position: "absolute",
                    width: "50px",
                    height: "50px",
                    bottom: "19px",
                    left: "75%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "5px",
                }}
            >
                <ButtonCheck onClick={shareLink} icon="./link.svg" alt="Link" />
            </span>
        </>
    );
}
