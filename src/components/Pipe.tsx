import { useEffect, useRef, useState } from "react";
import CONFIG from "../config/config.json";

interface PipeProps {
    inputPipeRef: React.RefObject<HTMLDivElement | null>;
    outputPipeRef: React.RefObject<HTMLDivElement | null>;
    liquidColor?: string | string[];
}

export default function Pipe({ inputPipeRef, outputPipeRef, liquidColor = "#FFFFFF" }: PipeProps) {
    const [coords, setCoords] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(
        null,
    );

    const liquidPathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    const [headProgress, setHeadProgress] = useState(0);
    const [tailProgress, setTailProgress] = useState(0);

    const headRef = useRef(0);
    const tailRef = useRef(0);
    const isFlowingRef = useRef(false);

    useEffect(() => {
        if (liquidPathRef.current) {
            const length = liquidPathRef.current.getTotalLength();
            setPathLength(length);
        }
    }, [coords]);

    useEffect(() => {
        let timerId: number;

        const updateLinePosition = () => {
            if (inputPipeRef.current && outputPipeRef.current) {
                const rectInput = inputPipeRef.current.getBoundingClientRect();
                const rectOutput = outputPipeRef.current.getBoundingClientRect();

                setCoords({
                    x1: rectOutput.left + rectOutput.width / 2,
                    y1: rectOutput.top + rectOutput.height / 2,
                    x2: rectInput.left + rectInput.width / 2,
                    y2: rectInput.top + rectInput.height / 2,
                });
            }
        };

        const handleEmptyMixer = () => {
            headRef.current = 0;
            tailRef.current = 0;
            setHeadProgress(0);
            setTailProgress(0);

            isFlowingRef.current = true;

            clearTimeout(timerId);

            timerId = window.setTimeout(() => {
                isFlowingRef.current = false;
            }, CONFIG.emptyMixerDuration);
        };

        updateLinePosition();

        window.addEventListener("resize", updateLinePosition);
        window.addEventListener("scroll", updateLinePosition);

        window.addEventListener("mixer-empty", handleEmptyMixer);

        return () => {
            window.removeEventListener("resize", updateLinePosition);
            window.removeEventListener("scroll", updateLinePosition);

            window.removeEventListener("mixer-empty", handleEmptyMixer);
            clearTimeout(timerId);
        };
    }, [inputPipeRef, outputPipeRef]);

    useEffect(() => {
        let animationFrame: number;
        let lastTime: number | null = null;

        const fillSpeed = 1 / CONFIG.pipeVelocityDuration;
        const drainSpeed = 1 / CONFIG.pipeVelocityDuration;

        const animate = (time: number) => {
            if (lastTime === null) lastTime = time;
            const delta = time - lastTime;
            lastTime = time;

            if (isFlowingRef.current) {
                headRef.current = Math.min(1, headRef.current + fillSpeed * delta);
            } else {
                tailRef.current = Math.min(headRef.current, tailRef.current + drainSpeed * delta);
            }

            setHeadProgress(headRef.current);
            setTailProgress(tailRef.current);

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    if (!coords) return null;

    const midX = coords.x1 + (coords.x2 - coords.x1) / 2;
    const mainPath = `M ${coords.x1} ${coords.y1} H ${midX} V ${coords.y2} H ${coords.x2}`;

    const visibleLength = Math.max(0, (headProgress - tailProgress) * pathLength);
    const dashoffset = -tailProgress * pathLength;

    const isGradient = Array.isArray(liquidColor);
    const strokeValue = isGradient ? "url(#liquidGradient)" : liquidColor;

    return (
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
            <defs>
                {isGradient && (
                    <linearGradient
                        id="liquidGradient"
                        x1={coords.x1}
                        y1={coords.y1}
                        x2={coords.x2}
                        y2={coords.y2}
                        gradientUnits="userSpaceOnUse"
                    >
                        {liquidColor.map((color, index) => (
                            <stop
                                key={index}
                                offset={`${(index / (liquidColor.length - 1)) * 100}%`}
                                stopColor={color}
                            />
                        ))}
                    </linearGradient>
                )}
            </defs>

            <g>
                <path
                    fill="none"
                    d={mainPath}
                    stroke="rgba(97, 114, 122, 0.24)"
                    strokeWidth="40"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                <path
                    ref={liquidPathRef}
                    fill="none"
                    d={mainPath}
                    stroke={strokeValue}
                    strokeWidth="36"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    style={{
                        strokeDasharray: `${visibleLength} ${pathLength}`,
                        strokeDashoffset: dashoffset,
                    }}
                />

                <path
                    fill="none"
                    d={mainPath}
                    stroke="rgba(140, 176, 192, 0.2)"
                    strokeWidth="50"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
}
