import Matter from "matter-js";
import {
    useCallback,
    useEffect,
    useRef,
    type Dispatch,
    type RefObject,
    type SetStateAction,
} from "react";
import CONFIG from "../../../config/config.json";
import EMOJIS from "../../../config/emojis.json";
import createThickWallsFromSVG from "../../../utils/thickWallsFromSVG";
import defaultFile from "../../../utils/defaultFile";
import type { EmojiData } from "../../../interface/emoji";
import { getBowlTransform, isInsideBowlWithTransform } from "../utils/geometryUtils";
import renderLiquid from "../utils/renderLiquid";

const POP_DURATION = 280;
const POP_STAGGER = 25;

type FallingEmoji = {
    id: number;
    body: Matter.Body;
    el: HTMLImageElement;
    scale: number;
    baseRadius: number;
    emojiIndex: number;
    popStartTime?: number;
    popDelay?: number;
};

interface UseMixerPhysicsParams {
    containerRef: RefObject<HTMLDivElement | null>;
    bowlRef: RefObject<HTMLCanvasElement | null>;
    setRecipe: Dispatch<SetStateAction<string[] | null>>;
    recipeRef: RefObject<string[] | null>;
    onContentChange?: (content: EmojiData[] | null) => void;
}

export default function useMixerPhysics({
    containerRef,
    bowlRef,
    setRecipe,
    recipeRef,
    onContentChange,
}: UseMixerPhysicsParams) {
    const itemsRef = useRef<FallingEmoji[]>([]);
    const idCounter = useRef(0);
    const bowlWallsRef = useRef<Matter.Body[]>([]);
    const bowlBoundsRef = useRef<{ minX: number; minY: number; maxX: number; maxY: number } | null>(
        null,
    );

    const isBlendingRef = useRef(false);
    const blendProgressRef = useRef(0);
    const isDrainingRef = useRef(false);
    const isPoppingRef = useRef(false);
    const isFinishedRef = useRef(false);

    const lastActivityRef = useRef(0);
    const lastInsideIdsRef = useRef<string>("");

    const wavePhaseRef = useRef(0);
    const waveAmplitudeRef = useRef(2);

    const engineRef = useRef<Matter.Engine | null>(null);

    const spawnEmojis = useCallback(
        (emoji: EmojiData, x: number, y: number) => {
            const rect = containerRef.current?.getBoundingClientRect();
            const engine = engineRef.current;
            if (!rect || !engine) return;

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
            el.className = "not-selected";
            Object.assign(el.style, {
                position: "absolute",
                left: "0",
                top: "0",
                width: `${CONFIG.emojiRadius * 2}px`,
                height: `${CONFIG.emojiRadius * 2}px`,
                willChange: "transform",
            });
            containerRef.current?.appendChild(el);

            const emojiIndex = EMOJIS.findIndex((e) => e === emoji);

            itemsRef.current.push({
                id: idCounter.current++,
                body,
                el,
                scale: 1,
                baseRadius,
                emojiIndex,
            });
        },
        [containerRef],
    );

    useEffect(() => {
        lastActivityRef.current = performance.now();
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const engine = Matter.Engine.create({
            enableSleeping: false,
            positionIterations: 12,
            velocityIterations: 12,
        });
        engine.gravity.y = 1.1;
        engineRef.current = engine;

        if (CONFIG.debugMode) {
            const debugCanvas = document.createElement("canvas");
            debugCanvas.width = container.clientWidth;
            debugCanvas.height = container.clientHeight;
            Object.assign(debugCanvas.style, {
                position: "absolute",
                inset: "0",
                zIndex: "10",
                pointerEvents: "none",
            });
            container.appendChild(debugCanvas);

            const debugRender = Matter.Render.create({
                canvas: debugCanvas,
                engine,
                options: {
                    width: container.clientWidth,
                    height: container.clientHeight,
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

        const render = (now: number) => {
            const delta = now - lastTime;
            lastTime = now;

            const bowlTransform = getBowlTransform(container, bowlRef.current);

            let insideCount = 0;
            for (let i = 0; i < itemsRef.current.length; i++) {
                const item = itemsRef.current[i];
                if (item.popStartTime !== undefined) continue;
                if (isInsideBowlWithTransform(item.body.position, bowlTransform)) {
                    insideCount++;
                }
            }

            if (isBlendingRef.current && insideCount > 0) {
                lastActivityRef.current = now;
                blendProgressRef.current = Math.min(
                    1,
                    blendProgressRef.current + delta / CONFIG.blendDuration,
                );

                const SHRINK_EASE = 2;
                const currentEmojiScale = 1 - Math.pow(blendProgressRef.current, SHRINK_EASE);

                for (let i = itemsRef.current.length - 1; i >= 0; i--) {
                    const item = itemsRef.current[i];

                    if (!isInsideBowlWithTransform(item.body.position, bowlTransform)) continue;

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

                        setRecipe((prevRecipe) => {
                            const newRecipe = prevRecipe ? [...prevRecipe] : [];
                            const emojiName = EMOJIS[item.emojiIndex]?.name || "red_question_mark";
                            newRecipe.push(emojiName);
                            return newRecipe;
                        });
                    }
                }
            }

            if (blendProgressRef.current >= 1) {
                for (let i = itemsRef.current.length - 1; i >= 0; i--) {
                    const item = itemsRef.current[i];
                    if (!isInsideBowlWithTransform(item.body.position, bowlTransform)) continue;
                    Matter.World.remove(engine.world, item.body);
                    item.el.remove();
                    itemsRef.current.splice(i, 1);

                    setRecipe((prevRecipe) => {
                        const newRecipe = prevRecipe ? [...prevRecipe] : [];
                        const emojiName = EMOJIS[item.emojiIndex]?.name || "red_question_mark";
                        newRecipe.push(emojiName);
                        return newRecipe;
                    });
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
                        t < 0.35 ? 1 + (t / 0.35) * 0.15 : 1.15 * (1 - (t - 0.35) / 0.65);
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

                if (y > container.clientHeight + 300) {
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
                lastActivityRef.current = now;
                blendProgressRef.current = Math.max(
                    0,
                    blendProgressRef.current - delta / CONFIG.emptyMixerDuration,
                );

                if (blendProgressRef.current <= 0) {
                    isDrainingRef.current = false;
                }
            }

            const physicalEmojis: EmojiData[] = [];
            const physicalIds: number[] = [];

            for (let i = 0; i < itemsRef.current.length; i++) {
                const item = itemsRef.current[i];
                if (item.popStartTime !== undefined) continue;

                if (isInsideBowlWithTransform(item.body.position, bowlTransform)) {
                    const emojiData = EMOJIS[item.emojiIndex];
                    if (emojiData) {
                        physicalEmojis.push(emojiData);
                        physicalIds.push(item.id);
                    }
                }
            }

            const meltedEmojis: EmojiData[] = (recipeRef.current ?? [])
                .map((name) => EMOJIS.find((e) => e.name === name))
                .filter((e): e is EmojiData => e !== undefined);

            const totalBlenderContent = [...meltedEmojis, ...physicalEmojis];

            const recipeKey = recipeRef.current?.join(",") ?? "";
            const physicalKey = physicalIds.join(",");
            const currentContentKey = `recipe:[${recipeKey}]_physical:[${physicalKey}]`;

            if (currentContentKey !== lastInsideIdsRef.current) {
                lastInsideIdsRef.current = currentContentKey;
                onContentChange?.(totalBlenderContent);
            }

            renderLiquid(
                bowlRef.current,
                now,
                blendProgressRef.current,
                isBlendingRef.current,
                isDrainingRef.current,
                waveAmplitudeRef,
                wavePhaseRef,
                lastActivityRef.current,
            );

            raf = requestAnimationFrame(render);
        };

        let raf = requestAnimationFrame(render);
        let lastTime = performance.now();

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
            const rect = container.getBoundingClientRect();

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
            if (itemsRef.current.length > 0) {
                const now = performance.now();

                itemsRef.current.reverse().forEach((item, index) => {
                    Matter.World.remove(engine.world, item.body);
                    item.popStartTime = now;
                    item.popDelay = index * POP_STAGGER + Math.random() * 40;
                });

                isPoppingRef.current = true;
            }

            if (blendProgressRef.current <= 0) return;
            isDrainingRef.current = true;
            isBlendingRef.current = false;
            isFinishedRef.current = false;

            handleRecipeReset();
        };

        const handleEmptyMixer = () => {
            if (blendProgressRef.current <= 0) return;
            isDrainingRef.current = true;
            isBlendingRef.current = false;

            isFinishedRef.current = true;
        };

        const handleRecipeReset = () => {
            isFinishedRef.current = false;
        };

        window.addEventListener("emoji-start-blend", handleStartBlend);
        window.addEventListener("emoji-stop-blend", handleStopBlend);
        window.addEventListener("emoji-drag-end", handleDrop);
        window.addEventListener("emoji-drag-check", handleCheckPosition);
        window.addEventListener("emoji-random-spawn", handleDropSpawn);
        window.addEventListener("emoji-trash", handleTrash);
        window.addEventListener("mixer-empty", handleEmptyMixer);
        window.addEventListener("recipe-reset", handleRecipeReset);

        return () => {
            window.removeEventListener("emoji-start-blend", handleStartBlend);
            window.removeEventListener("emoji-stop-blend", handleStopBlend);
            window.removeEventListener("emoji-drag-end", handleDrop);
            window.removeEventListener("emoji-drag-check", handleCheckPosition);
            window.removeEventListener("emoji-random-spawn", handleDropSpawn);
            window.removeEventListener("emoji-trash", handleTrash);
            window.removeEventListener("mixer-empty", handleEmptyMixer);
            window.removeEventListener("recipe-reset", handleRecipeReset);

            cancelAnimationFrame(raf);
            Matter.Runner.stop(runner);
            Matter.World.clear(engine.world, false);
            Matter.Engine.clear(engine);
            engineRef.current = null;
            itemsRef.current.forEach((i) => i.el.remove());
            itemsRef.current = [];
        };
    }, [bowlRef, containerRef, onContentChange, setRecipe, recipeRef, spawnEmojis]);

    return { spawnEmojis, isFinishedRef };
}
