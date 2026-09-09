import type { RefObject } from "react";
import CONFIG from "../../../config/config.json";
import type { EmojiData } from "../../../interface/emoji";

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    let color = "#";
    for (let i = 0; i < 3; i++) color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
    return color;
}

function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function adjustColor(hex: string, amt: number): string {
    let usePound = false;
    if (hex[0] === "#") {
        hex = hex.slice(1);
        usePound = true;
    }
    if (hex.length === 3)
        hex = hex
            .split("")
            .map((c) => c + c)
            .join("");
    const num = parseInt(hex, 16);
    if (isNaN(num)) return "#888888";

    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00ff) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000ff) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
}

let lastKnownColors: string[] = ["#a3d9ff"];

export default function renderLiquid(
    canvas: HTMLCanvasElement | null,
    now: number,
    progress: number,
    isBlending: boolean,
    isDraining: boolean,
    waveAmplitudeRef: RefObject<number>,
    wavePhaseRef: RefObject<number>,
    lastActivityTime: number,
    emojis: EmojiData[],
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

    const activityRatio = Math.max(0, Math.min(1, waveAmplitudeRef.current / 6));

    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x++) {
        const y = liquidY + Math.sin(x * 0.02 + wavePhaseRef.current) * waveAmplitudeRef.current;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.save();
    ctx.clip();

    let colors = Array.from(new Set(emojis.map((e) => e.colors[0] || stringToColor(e.name))));
    if (colors.length > 0) {
        lastKnownColors = colors;
    } else {
        colors = lastKnownColors;
    }
    colors.sort();

    const seedStr = colors.join("-");
    let seed = Math.abs(hashCode(seedStr));
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    const marblePalette: string[] = [];
    colors.forEach((c) => {
        marblePalette.push(c);
        marblePalette.push(adjustColor(c, -60));
        marblePalette.push(adjustColor(c, 70));
        marblePalette.push(adjustColor(c, -20));
    });

    const numVortices = 6 + (seed % 3);
    const vortices: { x: number; y: number; strength: number; radius: number }[] = [];
    for (let i = 0; i < numVortices; i++) {
        vortices.push({
            x: random() * w,
            y: liquidY + random() * (h - liquidY),
            strength: (random() > 0.5 ? 1 : -1) * (1.8 + random() * 2.5),
            radius: 150 + random() * 250,
        });
    }

    const animTime = now * 0.0005;

    const swirlPass = (px: number, py: number) => {
        let wx = px;
        let wy = py;
        for (let k = 0; k < vortices.length; k++) {
            const v = vortices[k];
            const dx = wx - v.x;
            const dy = wy - v.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < v.radius) {
                const t = 1 - dist / v.radius;
                const smoothT = t * t * (3 - 2 * t);
                const factor = smoothT * v.strength * activityRatio;
                const angle = Math.atan2(dy, dx) + factor;
                wx = v.x + Math.cos(angle) * dist;
                wy = v.y + Math.sin(angle) * dist;
            }
        }
        return { x: wx, y: wy };
    };

    const warp = (px: number, py: number) => {
        let wx = px;
        let wy = py;
        let freq = 0.006;
        let amp = 50 * activityRatio;

        for (let o = 0; o < 4; o++) {
            wx += Math.sin(wy * freq + animTime * (0.5 + o * 0.2)) * amp;
            wy += Math.cos(wx * freq - animTime * (0.4 + o * 0.2)) * amp;
            freq *= 1.9;
            amp *= 0.5;
        }
        return swirlPass(wx, wy);
    };

    ctx.fillStyle = marblePalette[0];
    ctx.fillRect(0, 0, w, h);

    const numRibbons = 80;
    const ribbonHeight = (h - liquidY + 200) / numRibbons;
    const stepX = 4;

    ctx.globalAlpha = 0.85;
    ctx.lineJoin = "round";

    for (let i = 0; i < numRibbons; i++) {
        const color = marblePalette[(i * 3) % marblePalette.length];
        const baseY = liquidY - 50 + i * ribbonHeight;

        ctx.fillStyle = color;
        ctx.strokeStyle = adjustColor(color, -40);
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        let first = true;

        for (let x = -50; x <= w + 50; x += stepX) {
            const rawY = baseY + Math.sin(x * 0.01 + i) * 20;
            const pt = warp(x, rawY);
            if (first) {
                ctx.moveTo(pt.x, pt.y);
                first = false;
            } else {
                ctx.lineTo(pt.x, pt.y);
            }
        }

        for (let x = w + 50; x >= -50; x -= stepX) {
            const rawY = baseY + ribbonHeight * 2.5 + Math.sin(x * 0.01 + i + 1) * 20;
            const pt = warp(x, rawY);
            ctx.lineTo(pt.x, pt.y);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
}
