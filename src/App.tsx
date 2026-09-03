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

            <Emojis />
            <Mixer outputTubeRef={outputTube} />
            <Output inputTubeRef={inputTube} />

            <Title />
        </>
    );
}

export default App;
