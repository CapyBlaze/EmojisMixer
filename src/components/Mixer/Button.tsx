import { useRef } from "react";
import CONFIG from "../../config/config.json";

interface ButtonProps {
    numberEmojisInBowl: number;
    progress: number;
    setIsAnimating: (isAnimating: boolean) => void;
    setProgress: (progress: number) => void;
}

export default function Button({
    numberEmojisInBowl,
    progress,
    setIsAnimating,
    setProgress,
}: ButtonProps) {
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const savedProgressRef = useRef<number>(0);

    function resetProgress() {
        setIsAnimating(false);
        setProgress(0.0);
        savedProgressRef.current = 0.0;
    }

    const start = () => {
        setIsAnimating(true);
        window.dispatchEvent(new CustomEvent("emoji-start-blend"));

        if (numberEmojisInBowl <= 0) return;

        startTimeRef.current = performance.now();

        const animate = (currentTime: number) => {
            if (!startTimeRef.current) return;

            const elapsed = currentTime - startTimeRef.current;
            const currentProgress =
                Math.round(
                    Math.min(savedProgressRef.current + elapsed / CONFIG.blendDuration, 1.0) *
                        100.0,
                ) / 100.0;

            setProgress(currentProgress);

            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
    };

    const stop = () => {
        setIsAnimating(false);
        window.dispatchEvent(new CustomEvent("emoji-stop-blend"));

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        savedProgressRef.current = progress;
        startTimeRef.current = null;
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLSpanElement>) => {
        e.preventDefault();
        if (progress < 1) {
            window.dispatchEvent(new CustomEvent("emoji-start-blend"));
            start();
        }
    };

    const handleTouchEnd = () => {
        window.dispatchEvent(new CustomEvent("emoji-stop-blend"));
        stop();
    };

    const emptyClicked = () => {
        window.dispatchEvent(new CustomEvent("mixer-empty"));
        resetProgress();
    };

    const bookClicked = () => {
        console.log("Book clicked");
    };

    const diceClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;

        window.dispatchEvent(new CustomEvent("emoji-random-spawn"));
        button.disabled = true;

        setTimeout(() => {
            button.disabled = false;
        }, 1500);
    };

    const trashClicked = () => {
        window.dispatchEvent(new CustomEvent("emoji-trash"));
        resetProgress();
    };

    return (
        <>
            <span
                style={{
                    background: "#595251",
                    position: "absolute",
                    width: "90px",
                    height: "90px",
                    bottom: "105px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderRadius: "50%",
                    zIndex: 1,
                }}
            >
                <button
                    onMouseDown={start}
                    onMouseUp={stop}
                    onMouseLeave={stop}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        background: "#786B67",
                        position: "absolute",
                        width: "75px",
                        height: "75px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        zIndex: 1,
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    <img
                        src="./flash.svg"
                        alt="Flash"
                        draggable="false"
                        className="not-selected"
                        style={{
                            width: "50px",
                            height: "50px",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                </button>
            </span>

            <span
                style={{
                    background: "#595251",
                    position: "absolute",
                    width: "40px",
                    height: "40px",
                    bottom: "150px",
                    left: "66.5%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "5px",
                }}
            >
                <button
                    onClick={bookClicked}
                    style={{
                        background: "#786b67",
                        position: "absolute",
                        width: "32px",
                        height: "32px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "2px",
                        zIndex: 1,
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    <img
                        src="./book.svg"
                        alt="Book"
                        draggable="false"
                        className="not-selected"
                        style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                </button>
            </span>

            <span
                style={{
                    background: "#595251",
                    position: "absolute",
                    width: "40px",
                    height: "40px",
                    bottom: "105px",
                    left: "66.5%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "5px",
                }}
            >
                <button
                    onClick={emptyClicked}
                    disabled={progress < 1.0}
                    style={{
                        background: "#786b67",
                        position: "absolute",
                        width: "32px",
                        height: "32px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "2px",
                        zIndex: 1,
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    <img
                        src="./empty.svg"
                        alt="Empty"
                        draggable="false"
                        className="not-selected"
                        style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            opacity: progress >= 1.0 ? 1.0 : 0.3,
                        }}
                    />
                </button>
            </span>

            <span
                style={{
                    background: "#595251",
                    position: "absolute",
                    width: "40px",
                    height: "40px",
                    bottom: "150px",
                    left: "32%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "5px",
                }}
            >
                <button
                    onClick={diceClicked}
                    style={{
                        background: "#786b67",
                        position: "absolute",
                        width: "32px",
                        height: "32px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "2px",
                        zIndex: 1,
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    <img
                        src="./dice.svg"
                        alt="Dice"
                        draggable="false"
                        className="not-selected"
                        style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                </button>
            </span>

            <span
                style={{
                    background: "#595251",
                    position: "absolute",
                    width: "40px",
                    height: "40px",
                    bottom: "105px",
                    left: "32%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "5px",
                }}
            >
                <button
                    onClick={trashClicked}
                    style={{
                        background: "#786b67",
                        position: "absolute",
                        width: "32px",
                        height: "32px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "2px",
                        zIndex: 1,
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    <img
                        src="./trash.svg"
                        alt="Trash"
                        draggable="false"
                        className="not-selected"
                        style={{
                            width: "25px",
                            height: "25px",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                </button>
            </span>
        </>
    );
}
