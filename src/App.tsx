import { useEffect, useRef, useState } from "react";
import Emojis from "./components/Emojis";
import Mixer from "./components/Mixer";
import Output from "./components/Output";
import Title from "./components/Title";

function App() {
    const inputTube = useRef<HTMLDivElement | null>(null);
    const outputTube = useRef<HTMLDivElement | null>(null);

    const [coords, setCoords] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(
        null,
    );

    const updateLinePosition = () => {
        if (inputTube.current && outputTube.current) {
            const rectInput = inputTube.current.getBoundingClientRect();
            const rectOutput = outputTube.current.getBoundingClientRect();

            setCoords({
                x1: rectInput.left + rectInput.width / 2,
                y1: rectInput.top + rectInput.height / 2,
                x2: rectOutput.left + rectOutput.width / 2,
                y2: rectOutput.top + rectOutput.height / 2,
            });
        }
    };

    useEffect(() => {
        updateLinePosition();

        window.addEventListener("resize", updateLinePosition);
        window.addEventListener("scroll", updateLinePosition);

        return () => {
            window.removeEventListener("resize", updateLinePosition);
            window.removeEventListener("scroll", updateLinePosition);
        };
    }, []);

    return (
        <>
            <Emojis />
            <Mixer outputTubeRef={outputTube} />
            <Output inputTubeRef={inputTube} />

            <Title />

            <svg
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                    zIndex: -6,
                }}
            >
                {coords &&
                    (() => {
                        const midX = coords.x1 + (coords.x2 - coords.x1) / 2;

                        const mainPath = `M ${coords.x1} ${coords.y1} H ${midX} V ${coords.y2} H ${coords.x2}`;

                        const offsetY = 0;
                        const offsetX = 0;
                        const highlightPath = `M ${coords.x1 + offsetX} ${coords.y1 - offsetY} H ${midX + offsetX} V ${coords.y2 - offsetY} H ${coords.x2 + offsetX}`;

                        return (
                            <g>
                                <path
                                    fill="none"
                                    d={mainPath}
                                    stroke="#8cb0c066"
                                    strokeWidth="50"
                                    strokeLinejoin="round"
                                />

                                <path
                                    fill="none"
                                    d={highlightPath}
                                    stroke="rgba(57, 70, 76, 0.2)"
                                    strokeWidth="40"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                />
                            </g>
                        );
                    })()}
            </svg>

            <div
                className="small-screen"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 99999,
                    background: "#2F3135",
                    display: "none",
                    justifyContent: "center",
                    alignItems: "center",
                    pointerEvents: "auto",
                    cursor: "default",
                }}
            >
                <div
                    style={{
                        width: "95%",
                        height: "90%",
                        border: "2px solid #c5d4db73",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        color: "#c5d4db73",
                    }}
                >
                    <img
                        src="./mixerScreenSmall.svg"
                        alt="Mixer Screen Small"
                        style={{
                            width: "200px",
                        }}
                    />
                    <h1
                        style={{
                            color: "#f4eee8",
                            margin: "30px 0 10px 0",
                            fontSize: "40px",
                        }}
                    >
                        SCREEN TOO SMALL
                    </h1>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "18px",
                            lineHeight: "1.5",
                            color: "#d3dbdf87",
                        }}
                    >
                        Emojis Mixer needs more space to work properly.
                        <br />
                        Please increase your screen size for the best experience.
                    </p>
                </div>
            </div>
        </>
    );
}

export default App;
