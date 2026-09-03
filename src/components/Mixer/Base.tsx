import { useRef, useState, type RefObject } from "react";
import CONFIG from "../../config/config.json";

interface BaseProps {
    outputTubeRef: RefObject<HTMLDivElement | null>;
}

export default function Base({ outputTubeRef }: BaseProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0.0);

    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const savedProgressRef = useRef<number>(0);

    const start = () => {
        setIsAnimating(true);
        startTimeRef.current = performance.now();

        const animate = (currentTime: number) => {
            if (!startTimeRef.current) return;

            const elapsed = currentTime - startTimeRef.current;
            const currentProgress =
                Math.floor(
                    Math.min(savedProgressRef.current + elapsed / CONFIG.duration, 1.0) * 100.0,
                ) / 100.0;

            setProgress(currentProgress);

            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
    };

    const stop = () => {
        setIsAnimating(false);

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        savedProgressRef.current = progress;
        startTimeRef.current = null;
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLSpanElement>) => {
        e.preventDefault();
        if (progress < 1) start();
    };

    const handleTouchEnd = () => {
        stop();
    };

    const emptyClicked = () => {
        console.log("Empty clicked");
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
    };

    return (
        <span>
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
                    bottom: "105px",
                    left: "66.5%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "5px",
                }}
            >
                <button
                    onClick={emptyClicked}
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

            <span
                style={{
                    background: "#2c2626",
                    position: "absolute",
                    width: "72px",
                    height: "20px",
                    bottom: "301px",
                    left: "50%",
                    translate: "-50% 0",
                    clipPath:
                        "polygon(12% 0%, 45% 100%, 55% 100%, 88% 0%, 100% 0%, 78% 100%, 22% 100%, 0% 0%)",
                    zIndex: 0,
                    animation: isAnimating ? "rotation 200ms linear infinite" : "none",
                }}
            ></span>

            <span
                style={{
                    background: "#453d3d",
                    position: "absolute",
                    width: "140px",
                    height: "19px",
                    bottom: "284px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(73% 0%, 27% 0%, 0% 100%, 100% 100%)",
                    zIndex: 1,
                }}
            ></span>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "#1a1818",
                    position: "absolute",
                    width: "220px",
                    height: "25px",
                    bottom: "205px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "4px",
                    border: "solid 4px #575251",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "clip",
                }}
            >
                <span
                    className="not-selected"
                    style={{
                        fontSize: "24px",
                        color: "#fdfdfd",
                        fontFamily:
                            "VT323, Segoe UI, Tahoma, Geneva, Verdana, sans-serif, sans-serif",
                        textTransform: "uppercase",
                        textAlign: "center",
                        textShadow:
                            "rgb(255 255 255 / 54%) 0px 0px 4px, rgb(255 255 255 / 0%) 0px 0px 20px, rgb(255 255 255 / 20%) 0px 0px 20px",
                    }}
                >
                    Emojis Mixer
                </span>
            </div>

            <span
                style={{
                    background: "#A99882",
                    position: "absolute",
                    width: "50px",
                    height: "36px",
                    bottom: "249px",
                    right: "160px",
                    clipPath: "polygon(0% 0%, 85% 0%, 100% 100%, 0% 100%)",
                    zIndex: 1,
                }}
            ></span>
            <span
                style={{
                    background: "#A99882",
                    position: "absolute",
                    width: "50px",
                    height: "36px",
                    bottom: "249px",
                    left: "160px",
                    clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    zIndex: 1,
                }}
            ></span>
            <span
                style={{
                    background: "#8F8172",
                    position: "absolute",
                    width: "80px",
                    height: "36px",
                    bottom: "249px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                }}
            ></span>

            {/* <span
                style={{
                    background: "#E3D8C1",
                    position: "absolute",
                    width: "256px",
                    height: "18px",
                    bottom: "249px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
                }}
            ></span> */}
            <span
                style={{
                    background: "#dac197",
                    position: "absolute",
                    width: "320px",
                    height: "157px",
                    bottom: "92px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                }}
            ></span>
            <span
                style={{
                    background: "#ac9777",
                    position: "absolute",
                    width: "320px",
                    height: "48px",
                    bottom: "44px",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <span
                    style={{
                        background: "#3E3D3C",
                        position: "absolute",
                        width: "230px",
                        height: "24px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "5px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "4px",
                        paddingLeft: "4px",
                        paddingRight: "4px",
                    }}
                >
                    {CONFIG.colors.map((color, index) => (
                        <span
                            key={index}
                            style={{
                                background:
                                    index + 1 <= progress * CONFIG.colors.length
                                        ? color
                                        : "#5d5d5d",
                                width: "stretch",
                                height: "16px",
                                borderRadius: "2px",
                            }}
                        ></span>
                    ))}
                </span>
            </span>

            <span
                style={{
                    background: "#7e716cab",
                    position: "absolute",
                    width: "40px",
                    height: "14px",
                    bottom: "30px",
                    left: "112px",
                    borderBottomRightRadius: "6px",
                    borderBottomLeftRadius: "6px",
                }}
            ></span>
            <span
                style={{
                    background: "#7e716cab",
                    position: "absolute",
                    width: "40px",
                    height: "14px",
                    bottom: "30px",
                    right: "112px",
                    borderBottomRightRadius: "6px",
                    borderBottomLeftRadius: "6px",
                }}
            ></span>

            <span
                ref={outputTubeRef}
                style={{
                    background: "#7E716C",
                    position: "absolute",
                    width: "53px",
                    height: "100px",
                    bottom: "122px",
                    right: "83px",
                    zIndex: -1,
                    borderRadius: "6px",
                }}
            ></span>
            <span
                style={{
                    background: "#645d5a",
                    position: "absolute",
                    width: "53px",
                    height: "76px",
                    bottom: "134px",
                    right: "72px",
                    zIndex: -2,
                    borderRadius: "4px",
                }}
            ></span>
        </span>
    );
}
