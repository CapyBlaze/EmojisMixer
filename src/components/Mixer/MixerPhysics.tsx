import { useEffect, useRef, type RefObject } from "react";
import Matter from "matter-js";
import defaultFile from "../../utils/defaultFile";
import CONFIG from "../../config/config.json";
import EMOJIS from "../../config/emojis.json";
import type { EmojiData } from "../../interface/emoji";
import { createThickWallsFromSVG } from "../../utils/thickWallsFromSVG";

type FallingEmoji = {
    id: number;
    body: Matter.Body;
    el: HTMLImageElement;
    scale: number;
    baseRadius: number;
    popStartTime?: number;
    popDelay?: number;
};

const CONTAINER_WIDTH = 500;
const CONTAINER_HEIGHT = 620;

interface MixerPhysicsProps {
    bowlRef: RefObject<HTMLCanvasElement | null>;
    onCountChange?: (count: number) => void;
}

export default function MixerPhysics({ bowlRef, onCountChange }: MixerPhysicsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<FallingEmoji[]>([]);
    const idCounter = useRef(0);

    const isBlendingRef = useRef(false);
    const blendProgressRef = useRef(0);
    const wavePhaseRef = useRef(0);
    const waveAmplitudeRef = useRef(2);
    const bowlBoundsRef = useRef<{ minX: number; minY: number; maxX: number; maxY: number } | null>(
        null,
    );
    const bowlWallsRef = useRef<Matter.Body[]>([]);
    const isDrainingRef = useRef(false);

    const isPoppingRef = useRef(false);
    const POP_DURATION = 280;
    const POP_STAGGER = 25;

    useEffect(() => {
        const engine = Matter.Engine.create({
            enableSleeping: false,
            positionIterations: 12,
            velocityIterations: 12,
        });
        engine.gravity.y = 1.1;

        if (CONFIG.debugMode) {
            const debugCanvas = document.createElement("canvas");
            debugCanvas.width = CONTAINER_WIDTH;
            debugCanvas.height = CONTAINER_HEIGHT;
            Object.assign(debugCanvas.style, {
                position: "absolute",
                inset: "0",
                zIndex: "10",
                pointerEvents: "none",
            });
            containerRef.current?.appendChild(debugCanvas);

            const debugRender = Matter.Render.create({
                canvas: debugCanvas,
                engine,
                options: {
                    width: CONTAINER_WIDTH,
                    height: CONTAINER_HEIGHT,
                    wireframes: true,
                    background: "transparent",
                    wireframeBackground: "transparent",
                    showAngleIndicator: true,
                },
            });
            Matter.Render.run(debugRender);
        }

        const bottleWalls = createThickWallsFromSVG(
            "M90 252.702H78L70 289.202H32L0.5 445.702V493.202H21.5M90 252.702L57 30.7024L43.5 0.202393M90 252.702L128 234.702H192L230 252.702M90 252.702H230M230 252.702H242L250 289.202H288L319.5 445.702V493.202H298.5M230 252.702L263 30.7024L276.5 0.202393M298.5 493.202V506.702H257.5V493.202M298.5 493.202H257.5M257.5 493.202H62.5M21.5 493.202V506.702H62.5V493.202M21.5 493.202H62.5",
            4,
            { x: 90, y: 83 },
        );
        Matter.World.add(engine.world, bottleWalls);
        bowlWallsRef.current = bottleWalls;

        let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
        bottleWalls.forEach((wall) => {
            minX = Math.min(minX, wall.bounds.min.x);
            minY = Math.min(minY, wall.bounds.min.y);
            maxX = Math.max(maxX, wall.bounds.max.x);
            maxY = Math.max(maxY, wall.bounds.max.y);
        });
        bowlBoundsRef.current = { minX, minY, maxX, maxY };

        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        function spawnEmojis(emoji: EmojiData, x: number, y: number) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const localX = x - rect.left;
            const localY = y - rect.top;

            const baseRadius = CONFIG.emojiRadius - 2;
            const body = Matter.Bodies.circle(localX, localY, baseRadius, {
                restitution: 0.35,
                friction: 0.5,
                frictionAir: 0.008,
                density: 0.008,
            });
            Matter.World.add(engine.world, body);

            const el = document.createElement("img");
            el.src = `./emojis/${defaultFile(emoji.files)}`;
            Object.assign(el.style, {
                position: "absolute",
                left: "0",
                top: "0",
                width: `${CONFIG.emojiRadius * 2}px`,
                height: `${CONFIG.emojiRadius * 2}px`,
                willChange: "transform",
            });
            containerRef.current?.appendChild(el);
            itemsRef.current.push({ id: idCounter.current++, body, el, scale: 1, baseRadius });
            onCountChange?.(itemsRef.current.length);
        }

        function isInsideBowl(pos: Matter.Vector) {
            console.log("isInsideBowl", pos);

            // if (walls.length === 0) return true;

            // const rayEnd = { x: pos.x + 37, y: -1000 };
            // const collisions = Matter.Query.ray(walls, pos, rayEnd);

            // const uniqueHits = new Set(
            //     collisions.map((c) => {
            //         const support = c.supports?.[0] ?? c.bodyB.position;
            //         return `${Math.round(support.x)}_${Math.round(support.y)}`;
            //     }),
            // );

            // return !(uniqueHits.size % 2 === 1);

            return true;
        }

        const drawLiquid = () => {
            const canvas = bowlRef.current;
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

            if (blendProgressRef.current <= 0) {
                ctx.restore();
                return;
            }

            const MAX_FILL_RATIO = 0.8;
            const fillRatio = blendProgressRef.current * MAX_FILL_RATIO;
            const liquidY = h - h * fillRatio;

            const targetAmplitude = isBlendingRef.current ? 6 : 2;
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

        const render = (now: number) => {
            const delta = now - lastTime;
            lastTime = now;

            if (isBlendingRef.current && itemsRef.current.length > 0) {
                blendProgressRef.current = Math.min(
                    1,
                    blendProgressRef.current + delta / CONFIG.blendDuration,
                );

                const SHRINK_EASE = 2;
                const currentEmojiScale = 1 - Math.pow(blendProgressRef.current, SHRINK_EASE);

                for (let i = itemsRef.current.length - 1; i >= 0; i--) {
                    const item = itemsRef.current[i];

                    if (!isInsideBowl(item.body.position)) continue;

                    const FORCE_MAGNITUDE = 0.0015;
                    const forceX = (Math.random() - 0.5) * FORCE_MAGNITUDE * item.body.mass;
                    const forceY = (Math.random() - 0.5) * FORCE_MAGNITUDE * item.body.mass;
                    Matter.Body.applyForce(item.body, item.body.position, { x: forceX, y: forceY });

                    item.scale = currentEmojiScale;

                    const targetRadius = Math.max(item.baseRadius * currentEmojiScale, 0.5);
                    const currentRadius = item.body.circleRadius ?? item.baseRadius;
                    const scaleFactor = targetRadius / currentRadius;

                    if (
                        Number.isFinite(scaleFactor) &&
                        scaleFactor > 0 &&
                        Math.abs(scaleFactor - 1) > 0.001
                    ) {
                        Matter.Body.scale(item.body, scaleFactor, scaleFactor);
                    }

                    if (item.scale <= 0.02 || blendProgressRef.current >= 1) {
                        Matter.World.remove(engine.world, item.body);
                        item.el.remove();
                        itemsRef.current.splice(i, 1);
                    }
                }
            }

            if (blendProgressRef.current >= 1) {
                for (let i = itemsRef.current.length - 1; i >= 0; i--) {
                    const item = itemsRef.current[i];
                    if (!isInsideBowl(item.body.position)) continue;
                    Matter.World.remove(engine.world, item.body);
                    item.el.remove();
                    itemsRef.current.splice(i, 1);
                }
            }

            if (isPoppingRef.current) {
                const now = performance.now();
                let stillPopping = false;

                for (let i = itemsRef.current.length - 1; i >= 0; i--) {
                    const item = itemsRef.current[i];
                    const elapsed = now - (item.popStartTime ?? now) - (item.popDelay ?? 0);

                    if (elapsed < 0) {
                        stillPopping = true;
                        continue;
                    }

                    const t = Math.min(1, elapsed / POP_DURATION);

                    if (t >= 1) {
                        item.el.remove();
                        itemsRef.current.splice(i, 1);
                        continue;
                    }

                    stillPopping = true;

                    const popScale =
                        t < 0.35 ? 1 + (t / 0.35) * 0.3 : 1.3 * (1 - (t - 0.35) / 0.65);
                    const opacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;

                    const { x, y } = item.body.position;
                    item.el.style.transform = `translate(${x - CONFIG.emojiRadius}px, ${
                        y - CONFIG.emojiRadius
                    }px) scale(${Math.max(0, popScale)})`;
                    item.el.style.opacity = `${Math.max(0, opacity)}`;
                }

                if (!stillPopping) {
                    isPoppingRef.current = false;
                }
            }

            for (let i = itemsRef.current.length - 1; i >= 0; i--) {
                const item = itemsRef.current[i];

                if (item.popStartTime !== undefined) continue;

                const { x, y } = item.body.position;

                if (y > CONTAINER_HEIGHT + 50) {
                    Matter.World.remove(engine.world, item.body);
                    item.el.remove();
                    itemsRef.current.splice(i, 1);
                    continue;
                }

                item.el.style.transform = `translate(${x - CONFIG.emojiRadius}px, ${
                    y - CONFIG.emojiRadius
                }px) rotate(${item.body.angle}rad) scale(${item.scale})`;
            }

            if (isDrainingRef.current) {
                blendProgressRef.current = Math.max(
                    0,
                    blendProgressRef.current - delta / CONFIG.emptyMixerDuration,
                );

                if (blendProgressRef.current <= 0) {
                    isDrainingRef.current = false;
                }
            }

            drawLiquid();

            raf = requestAnimationFrame(render);
        };

        let raf = requestAnimationFrame(render);

        const handleStartBlend = () => {
            isBlendingRef.current = true;
        };

        const handleStopBlend = () => {
            isBlendingRef.current = false;
        };

        const handleDrop = (e: Event) => {
            const { emoji, x, y } = (e as CustomEvent).detail;
            spawnEmojis(emoji, x, y);
        };

        const handleCheckPosition = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { x, y, callback } = customEvent.detail;
            const rect = containerRef.current?.getBoundingClientRect();

            if (!rect) {
                callback(true);
                return;
            }

            const localX = x - rect.left;
            const localY = y - rect.top;

            const testBody = Matter.Bodies.circle(localX, localY, CONFIG.emojiRadius + 2);
            const collisions = Matter.Query.collides(testBody, bottleWalls);

            callback(collisions.length === 0);
        };

        const handleDropSpawn = () => {
            if (!bowlRef.current) return;
            const bowlElement = bowlRef.current;
            const rect = bowlElement.getBoundingClientRect();

            const overflow = 0;
            const x1 = rect.left - overflow;
            const x2 = rect.right + overflow;

            for (let wave = 0; wave < CONFIG.numberWaves; wave++) {
                setTimeout(() => {
                    for (let i = 0; i < CONFIG.numberEmojisSpawned; i++) {
                        spawnEmojis(
                            EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
                            Math.floor(Math.random() * (x2 - x1 + 1)) + x1,
                            -20,
                        );
                    }
                }, wave * 100);
            }
        };

        const handleTrash = () => {
            if (itemsRef.current.length === 0) return;

            const now = performance.now();

            itemsRef.current.reverse().forEach((item, index) => {
                Matter.World.remove(engine.world, item.body);
                item.popStartTime = now;
                item.popDelay = index * POP_STAGGER + Math.random() * 40;
            });

            isPoppingRef.current = true;

            handleEmptyMixer();
        };

        const handleEmptyMixer = () => {
            if (blendProgressRef.current <= 0) return;
            isDrainingRef.current = true;
            isBlendingRef.current = false;
        };

        window.addEventListener("emoji-start-blend", handleStartBlend);
        window.addEventListener("emoji-stop-blend", handleStopBlend);
        window.addEventListener("emoji-drag-end", handleDrop);
        window.addEventListener("emoji-drag-check", handleCheckPosition);
        window.addEventListener("emoji-random-spawn", handleDropSpawn);
        window.addEventListener("emoji-trash", handleTrash);
        window.addEventListener("mixer-empty", handleEmptyMixer);

        return () => {
            window.removeEventListener("emoji-start-blend", handleStartBlend);
            window.removeEventListener("emoji-stop-blend", handleStopBlend);
            window.removeEventListener("emoji-drag-end", handleDrop);
            window.removeEventListener("emoji-drag-check", handleCheckPosition);
            window.removeEventListener("emoji-random-spawn", handleDropSpawn);
            window.removeEventListener("emoji-trash", handleTrash);
            window.removeEventListener("mixer-empty", handleEmptyMixer);

            cancelAnimationFrame(raf);
            Matter.Runner.stop(runner);
            Matter.World.clear(engine.world, false);
            Matter.Engine.clear(engine);
            itemsRef.current.forEach((i) => i.el.remove());
            itemsRef.current = [];
        };
    }, [bowlRef, onCountChange]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                width: CONTAINER_WIDTH,
                height: CONTAINER_HEIGHT,
                zIndex: 1,
                pointerEvents: "none",
                overflow: "visible",
            }}
        />
    );
}
