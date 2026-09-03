import { useEffect, useMemo, useRef, useState } from "react";
import defaultFile from "../utils/defaultFile";
import EMOJIS from "../config/emojis.json";
import CONFIG from "../config/config.json";
import type { EmojiData } from "../interface/emoji";

export default function Emojis() {
    const [dragging, setDragging] = useState<{
        emoji: EmojiData;
        x: number;
        y: number;
    } | null>(null);
    const [rotation, setRotation] = useState(0);
    const [category, setCategory] = useState("Smileys & Emotion");
    const [search, setSearch] = useState("");

    const lastX = useRef(0);
    const categorysContainerRef = useRef<HTMLDivElement>(null);

    const filteredEmojis = useMemo(() => {
        return EMOJIS.filter((emoji) => {
            const matchesCategory = category ? emoji.category === category : true;
            const matchesSearch = search
                ? emoji.name.toLowerCase().includes(search.toLowerCase())
                : true;
            return matchesCategory && matchesSearch;
        }).sort((a, b) => a.order - b.order);
    }, [category, search]);

    useEffect(() => {
        if (dragging) {
            document.body.style.cursor = "grabbing";
            document.body.style.userSelect = "none";
        } else {
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }

        return () => {
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [dragging]);

    const handlePointerDown = (e: React.PointerEvent<HTMLSpanElement>, emoji: EmojiData) => {
        e.preventDefault();
        lastX.current = e.clientX;
        setDragging({ emoji, x: e.clientX, y: e.clientY });

        window.dispatchEvent(new CustomEvent("emoji-drag-start", { detail: { emoji } }));

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const deltaX = moveEvent.clientX - lastX.current;
            lastX.current = moveEvent.clientX;

            const tilt = Math.max(-18, Math.min(18, deltaX * 2.5));
            setRotation(tilt);

            setDragging({ emoji, x: moveEvent.clientX, y: moveEvent.clientY });

            window.dispatchEvent(
                new CustomEvent("emoji-drag-move", {
                    detail: {
                        emoji,
                        x: moveEvent.clientX,
                        y: moveEvent.clientY,
                    },
                }),
            );
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);

            window.dispatchEvent(
                new CustomEvent("emoji-drag-end", {
                    detail: { emoji, x: upEvent.clientX, y: upEvent.clientY },
                }),
            );

            setDragging(null);
            setRotation(0);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    return (
        <>
            <div
                className="container emojis"
                style={{
                    top: "50%",
                    left: "15px",
                    transform: "translateY(-50%)",
                    position: "absolute",
                    overflow: "hidden",
                    zIndex: 0,
                }}
            >
                <div className="input-search">
                    <img src="./search.svg" alt="Search" style={{ width: "20px", opacity: 0.5 }} />
                    <input
                        id="search-bar"
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCategory("");
                        }}
                    />
                    <img
                        src="./clear.svg"
                        alt="Clear"
                        style={{
                            width: "20px",
                            transition: "opacity 0.2s",
                            opacity: category === "" ? 1 : 0,
                            cursor: category === "" ? "pointer" : "default",
                        }}
                        onClick={() => {
                            setSearch("");
                            setCategory("Smileys & Emotion");
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "10px",
                        justifyContent: "space-between",
                    }}
                >
                    <button
                        onClick={() => {
                            if (categorysContainerRef.current) {
                                categorysContainerRef.current.scrollBy({
                                    left: -100,
                                    behavior: "smooth",
                                });
                            }
                        }}
                        style={{
                            background: "#ffffff00",
                            border: "none",
                            width: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src="./chevron.svg"
                            alt="Previous"
                            style={{ width: "20px", opacity: 0.5, transform: "rotate(180deg)" }}
                        />
                    </button>
                    <div
                        ref={categorysContainerRef}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            flexWrap: "nowrap",
                            marginTop: "10px",
                            marginBottom: "10px",
                            overflow: "hidden",
                            gap: "10px",
                        }}
                    >
                        {CONFIG.categorys.map((categoryName) => (
                            <button
                                key={categoryName}
                                onClick={() => setCategory(categoryName)}
                                style={{
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                    border:
                                        categoryName === category
                                            ? "rgb(188 188 188) solid 1px"
                                            : "rgba(188, 188, 188, 0) solid 1px",
                                    background: "#ffffff40",
                                    borderRadius: "50px",
                                    padding: "5px 16px",
                                    color: "#fff",
                                }}
                            >
                                {categoryName}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            if (categorysContainerRef.current) {
                                categorysContainerRef.current.scrollBy({
                                    left: 100,
                                    behavior: "smooth",
                                });
                            }
                        }}
                        style={{
                            background: "#ffffff00",
                            border: "none",
                            width: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src="./chevron.svg"
                            alt="Next"
                            style={{ width: "20px", opacity: 0.5 }}
                        />
                    </button>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "4px",
                        marginBottom: "6px",
                        opacity: 0.5,
                    }}
                >
                    {filteredEmojis.length} Emojis Available
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        alignContent: "flex-start",
                        overflowY: "auto",
                        height: "82%",
                        fontSize: "24px",
                        paddingRight: "10px",
                    }}
                >
                    {filteredEmojis.map((emoji) => (
                        <span
                            key={emoji.name}
                            onPointerDown={(e) => handlePointerDown(e, emoji)}
                            style={{
                                flex: "1 1 40px",
                                boxSizing: "border-box",
                                cursor: dragging?.emoji.name === emoji.name ? "grabbing" : "grab",
                                userSelect: "none",
                                touchAction: "none",
                                opacity: dragging?.emoji.name === emoji.name ? 0.25 : 1,
                                transition: "opacity 0.1s",
                                zIndex: 4,
                                width: "40px",
                                height: "40px",
                                maxWidth: "40px",
                                maxHeight: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src={`./emojis/${defaultFile(emoji.files)}`}
                                alt={emoji.name}
                                style={{ width: "35px", height: "35px" }}
                            />
                        </span>
                    ))}
                </div>
            </div>

            {dragging && (
                <span
                    style={{
                        position: "fixed",
                        left: dragging.x,
                        top: dragging.y,
                        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(1.4)`,
                        pointerEvents: "none",
                        zIndex: 4,
                        transition: "transform 0.08s ease-out",
                        filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.35))",
                    }}
                >
                    <img
                        src={`./emojis/${defaultFile(dragging.emoji.files)}`}
                        alt={dragging.emoji.name}
                        style={{ width: "28px" }}
                    />
                </span>
            )}
        </>
    );
}
