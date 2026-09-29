import { useEffect, useRef, useState } from "react";
import CONFIG from "../configs/config.json";
import LiquidCanvas from "../graphics/LiquidCanvas";
import type { EmojiData } from "../interfaces/emoji";

interface PipeProps {
    inputPipeRef: React.RefObject<HTMLDivElement | null>;
    outputPipeRef: React.RefObject<HTMLDivElement | null>;
}

export default function Pipe({ inputPipeRef, outputPipeRef }: PipeProps) {
    const [coords, setCoords] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(
        null,
    );

    const liquidPathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    const [emojis, setEmojis] = useState<EmojiData[]>([]);
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

        const handleEmptyMixer = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setEmojis(detail.recipe || []);

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

    const minX = Math.min(coords.x1, coords.x2) - 30;
    const minY = Math.min(coords.y1, coords.y2) - 30;
    const width = Math.abs(coords.x2 - coords.x1) + 60;
    const height = Math.abs(coords.y2 - coords.y1) + 60;

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
                <mask id="pipeLiquidMask">
                    <path
                        ref={liquidPathRef}
                        fill="none"
                        d={mainPath}
                        stroke="#FFFFFF"
                        strokeWidth="36"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: `${visibleLength} ${pathLength}`,
                            strokeDashoffset: dashoffset,
                        }}
                    />
                </mask>
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

                <g mask="url(#pipeLiquidMask)">
                    <foreignObject x={minX} y={minY} width={width} height={height}>
                        <div style={{ width: "100%", height: "100%" }}>
                            <LiquidCanvas
                                emojis={emojis}
                                progress={1}
                                maxFillLevel={1}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    </foreignObject>
                </g>

                <path
                    fill="none"
                    d={mainPath}
                    stroke="rgba(140, 176, 192, 0.2)"
                    strokeWidth="50"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
}
