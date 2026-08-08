import { useEffect, useRef, useState } from "react";
import emojis from "../config/emojis.json";

export default function Emojis() {
    const [dragging, setDragging] = useState<{
        emoji: string;
        x: number;
        y: number;
    } | null>(null);
    const [rotation, setRotation] = useState(0);
    const lastX = useRef(0);

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

    const handlePointerDown = (
        e: React.PointerEvent<HTMLSpanElement>,
        emoji: string,
    ) => {
        e.preventDefault();
        lastX.current = e.clientX;
        setDragging({ emoji, x: e.clientX, y: e.clientY });

        window.dispatchEvent(
            new CustomEvent("emoji-drag-start", { detail: { emoji } }),
        );

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
                className="container"
                style={{
                    top: "50%",
                    left: "15px",
                    transform: "translateY(-50%)",
                    position: "absolute",
                    overflow: "hidden",
                }}
            >
                <div className="input-search">
                    <img
                        src="./search.svg"
                        alt="Search"
                        style={{ width: "20px", opacity: 0.5 }}
                    />
                    <input type="text" placeholder="Search..." />
                </div>
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "10px",
                        marginBottom: "10px",
                        opacity: 0.5,
                    }}
                >
                    {emojis.length} Emojis Available
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        overflowY: "auto",
                        height: "88%",
                        fontSize: "24px",
                        paddingRight: "10px",
                    }}
                >
                    {emojis.map((emoji) => (
                        <span
                            key={emoji}
                            onPointerDown={(e) => handlePointerDown(e, emoji)}
                            style={{
                                flex: "1 1 24px",
                                boxSizing: "border-box",
                                cursor:
                                    dragging?.emoji === emoji
                                        ? "grabbing"
                                        : "grab",
                                userSelect: "none",
                                touchAction: "none",
                                opacity: dragging?.emoji === emoji ? 0.25 : 1,
                                transition: "opacity 0.1s",
                                zIndex: 4,
                            }}
                        >
                            {emoji}
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
                        fontSize: "28px",
                        pointerEvents: "none",
                        zIndex: 4,
                        transition: "transform 0.08s ease-out",
                        filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.35))",
                    }}
                >
                    {dragging.emoji}
                </span>
            )}
        </>
    );
}
