import { useEffect, useRef, useState } from "react";
import CONFIG from "../config/config.json";

interface TubeProps {
    coords: { x1: number; y1: number; x2: number; y2: number } | null;
    liquidColor?: string | string[];
}

const DRAIN_DURATION = 600;

export default function Tube({ coords, liquidColor = "#FFFFFF" }: TubeProps) {
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

        window.addEventListener("mixer-empty", handleEmptyMixer);

        return () => {
            window.removeEventListener("mixer-empty", handleEmptyMixer);
            clearTimeout(timerId);
        };
    }, []);

    useEffect(() => {
        let animationFrame: number;
        let lastTime: number | null = null;

        const fillSpeed = 1 / CONFIG.emptyMixerDuration;
        const drainSpeed = 1 / DRAIN_DURATION;

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
