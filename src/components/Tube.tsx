import { useEffect, useRef, useState } from "react";
import CONFIG from "../config/config.json";

interface TubeProps {
    coords: { x1: number; y1: number; x2: number; y2: number } | null;
    liquidColor?: string | string[];
}

export default function Tube({ coords, liquidColor = "#FFFFFF" }: TubeProps) {
    const [isFlowing, setIsFlowing] = useState(false);

    const liquidPathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    const [headProgress, setHeadProgress] = useState(0);
    const [tailProgress, setTailProgress] = useState(0);

    useEffect(() => {
        if (liquidPathRef.current) {
            const length = liquidPathRef.current.getTotalLength();
            setPathLength(length);
        }
    }, [coords]);

    useEffect(() => {
        let timerId: number;

        const handleEmptyMixer = () => {
            setIsFlowing(true);

            clearTimeout(timerId);

            timerId = setTimeout(() => {
                setIsFlowing(false);
            }, CONFIG.emptyMixerDuration);
        };

        window.addEventListener("mixer-empty", handleEmptyMixer);

        return () => {
            window.removeEventListener("mixer-empty", handleEmptyMixer);
            clearTimeout(timerId);
        };
    }, []);

    useEffect(() => {
        let animationFrame: number;

        const animate = () => {
            if (isFlowing) {
                setHeadProgress((prev) => Math.min(1, prev + 0.008));
                setTailProgress((prev) => Math.max(0, prev - 0.04));
            } else {
                setTailProgress((prev) => Math.min(headProgress, prev + 0.01));
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isFlowing, headProgress]);

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
                    stroke="#8cb0c066"
                    strokeWidth="50"
                    strokeLinejoin="round"
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
                        transition: "stroke-dashoffset 0.05s linear, stroke-dasharray 0.05s linear",
                    }}
                />

                <path
                    fill="none"
                    d={mainPath}
                    stroke="rgba(57, 70, 76, 0.2)"
                    strokeWidth="40"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
}
