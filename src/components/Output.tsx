import { useEffect, useRef, type RefObject } from "react";
import Decoration from "./Output/Decoration";
import BaseDecoration from "./Output/BaseDecoration";
import Button from "./Output/Button";
import CONFIG from "../config/config.json";

interface OutputProps {
    inputTubeRef: RefObject<HTMLDivElement | null>;
}

export default function Output({ inputTubeRef }: OutputProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const fillProgressRef = useRef(0);
    const targetFillRef = useRef(0);
    const isFillingRef = useRef(false);
    const wavePhaseRef = useRef(0);
    const waveAmplitudeRef = useRef(2);

    const lastActivityRef = useRef(0);
    const SETTLE_DELAY = 2500;

    useEffect(() => {
        lastActivityRef.current = performance.now();
    }, []);

    useEffect(() => {
        const drawLiquid = (now: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const dpr = window.devicePixelRatio || 1;
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;

            if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
                canvas.width = displayWidth * dpr;
                canvas.height = displayHeight * dpr;
            }

            ctx.save();
            ctx.scale(dpr, dpr);

            const w = displayWidth;
            const h = displayHeight;

            ctx.clearRect(0, 0, w, h);

            if (fillProgressRef.current <= 0) {
                ctx.restore();
                return;
            }

            const MAX_FILL_RATIO = 0.85;
            const fillRatio = fillProgressRef.current * MAX_FILL_RATIO;
            const liquidY = h - h * fillRatio;

            const timeSinceActivity = now - lastActivityRef.current;
            const targetAmplitude = isFillingRef.current
                ? 6
                : timeSinceActivity < SETTLE_DELAY
                  ? 2
                  : 0;

            const SMOOTH_FACTOR = 0.04;
            waveAmplitudeRef.current +=
                (targetAmplitude - waveAmplitudeRef.current) * SMOOTH_FACTOR;

            const speedRatio = (waveAmplitudeRef.current - 2) / (6 - 2);
            const currentSpeed = 0.03 + speedRatio * (0.12 - 0.03);
            wavePhaseRef.current += currentSpeed;

            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.moveTo(0, h);

            for (let x = 0; x <= w; x++) {
                const y =
                    liquidY + Math.sin(x * 0.03 + wavePhaseRef.current) * waveAmplitudeRef.current;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(w, h);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        };

        let lastTime = performance.now();
        let raf: number;

        const render = (now: number) => {
            const delta = now - lastTime;
            lastTime = now;

            if (isFillingRef.current) {
                lastActivityRef.current = now;

                const direction = targetFillRef.current > fillProgressRef.current ? 1 : -1;
                fillProgressRef.current += (direction * delta) / CONFIG.fillOutputDuration;

                fillProgressRef.current = Math.max(0, Math.min(1, fillProgressRef.current));

                const reachedTarget =
                    direction > 0
                        ? fillProgressRef.current >= targetFillRef.current
                        : fillProgressRef.current <= targetFillRef.current;

                if (reachedTarget) {
                    fillProgressRef.current = targetFillRef.current;
                    isFillingRef.current = false;
                    lastActivityRef.current = now;
                }
            }

            drawLiquid(now);
            raf = requestAnimationFrame(render);
        };

        raf = requestAnimationFrame(render);

        const handleFill = (e: Event) => {
            const detail = (e as CustomEvent)?.detail;
            const amount = typeof detail?.amount === "number" ? detail.amount : 1; // 0 à 1

            targetFillRef.current = Math.max(0, Math.min(1, amount));
            isFillingRef.current = true;
        };

        const handleEmpty = () => {
            if (fillProgressRef.current <= 0) return;

            targetFillRef.current = 0;
            isFillingRef.current = true;
        };

        window.addEventListener("mixer-empty", handleFill);
        window.addEventListener("output-empty", handleEmpty);

        return () => {
            window.removeEventListener("mixer-empty", handleFill);
            window.removeEventListener("output-empty", handleEmpty);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div
            className="container"
            style={{
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                position: "absolute",
                zIndex: 0,
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    margin: 0,
                }}
            >
                Output
            </h2>

            <div
                style={{
                    position: "absolute",
                    height: "560px",
                    width: "300px",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <span>
                    <span
                        style={{
                            background: "#6f868e21",
                            position: "absolute",
                            width: "200px",
                            height: "350px",
                            bottom: "88px",
                            left: "50%",
                            zIndex: 2,
                            transform: "translateX(-50%)",
                            borderBottomRightRadius: "20px",
                            borderBottomLeftRadius: "20px",
                        }}
                    ></span>

                    <Decoration style="lemon1" side="right" />
                    <Decoration style="umbrella" side="left" />

                    <canvas
                        ref={canvasRef}
                        style={{
                            background: "#ffffff00",
                            position: "absolute",
                            width: "180px",
                            height: "340px",
                            bottom: "98px",
                            left: "50%",
                            zIndex: 1,
                            transform: "translateX(-50%)",
                            borderBottomRightRadius: "10px",
                            borderBottomLeftRadius: "10px",
                        }}
                    ></canvas>

                    <span
                        style={{
                            background: "#7d91985e",
                            position: "absolute",
                            width: "200px",
                            height: "350px",
                            bottom: "88px",
                            left: "50%",
                            zIndex: -1,
                            transform: "translateX(-50%)",
                            borderBottomRightRadius: "20px",
                            borderBottomLeftRadius: "20px",
                        }}
                    ></span>

                    <span
                        style={{
                            background: "#71889040",
                            position: "absolute",
                            width: "180px",
                            height: "340px",
                            bottom: "98px",
                            left: "50%",
                            zIndex: -1,
                            transform: "translateX(-50%)",
                            borderBottomRightRadius: "10px",
                            borderBottomLeftRadius: "10px",
                        }}
                    ></span>
                </span>

                <span
                    style={{
                        background: "#a5988c",
                        position: "absolute",
                        width: "300px",
                        height: "88px",
                        bottom: "0px",
                        left: "50%",
                        zIndex: 2,
                        transform: "translateX(-50%)",
                        borderRadius: "5px",
                    }}
                >
                    <Button />
                </span>

                <span
                    ref={inputTubeRef}
                    style={{
                        background: "#7E716C",
                        position: "absolute",
                        width: "53px",
                        height: "70px",
                        bottom: "8px",
                        right: "281px",
                        zIndex: -1,
                        borderRadius: "6px",
                    }}
                ></span>

                <span
                    style={{
                        background: "#625d5a",
                        position: "absolute",
                        width: "53px",
                        height: "55px",
                        bottom: "15.5px",
                        right: "289px",
                        zIndex: -2,
                        borderRadius: "3px",
                    }}
                ></span>

                <BaseDecoration />
            </div>
        </div>
    );
}
