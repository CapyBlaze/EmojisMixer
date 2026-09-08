import type { RefObject } from "react";
import CONFIG from "../../../config/config.json";

export default function renderLiquid(
    canvas: HTMLCanvasElement | null,
    now: number,
    progress: number,
    isBlending: boolean,
    isDraining: boolean,
    waveAmplitudeRef: RefObject<number>,
    wavePhaseRef: RefObject<number>,
    lastActivityTime: number,
) {
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

    if (progress <= 0) {
        ctx.restore();
        return;
    }

    const fillRatio = progress * CONFIG.mixerMaxFillLevel;
    const liquidY = h - h * fillRatio;

    const timeSinceActivity = now - lastActivityTime;
    const targetAmplitude =
        isBlending || isDraining ? 6 : timeSinceActivity < CONFIG.liquidSettleDelay ? 2 : 0;

    const SMOOTH_FACTOR = 0.04;
    waveAmplitudeRef.current += (targetAmplitude - waveAmplitudeRef.current) * SMOOTH_FACTOR;

    const speedRatio = (waveAmplitudeRef.current - 2) / (6 - 2);
    const currentSpeed = 0.03 + speedRatio * (0.12 - 0.03);
    wavePhaseRef.current += currentSpeed;

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(0, h);

    for (let x = 0; x <= w; x++) {
        const y = liquidY + Math.sin(x * 0.03 + wavePhaseRef.current) * waveAmplitudeRef.current;
        ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}
