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
import type { EmojiData } from "../../../interface/emoji";

import { setupEngine } from "../core/engine";
import { createRenderLoop } from "../core/render";
import { spawnEmoji } from "../core/spawnEmojis";

export type FallingEmoji = {
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
    blendProgressRef: RefObject<number>;
    isBlendingRef: RefObject<boolean>;
    isDrainingRef: RefObject<boolean>;
    lastActivityRef: RefObject<number>;
}

export default function useMixerPhysics({
    containerRef,
    bowlRef,
    setRecipe,
    recipeRef,
    onContentChange,
    blendProgressRef,
    isBlendingRef,
    isDrainingRef,
    lastActivityRef,
}: UseMixerPhysicsParams) {
    const itemsRef = useRef<FallingEmoji[]>([]);
    const idCounter = useRef(0);
    const bowlWallsRef = useRef<Matter.Body[]>([]);
    const bowlBoundsRef = useRef<{ minX: number; minY: number; maxX: number; maxY: number } | null>(
        null,
    );

    const isPoppingRef = useRef(false);
    const isFinishedRef = useRef(false);
    const lastInsideIdsRef = useRef<string>("");

    const wavePhaseRef = useRef(0);
    const waveAmplitudeRef = useRef(2);

    const engineRef = useRef<Matter.Engine | null>(null);

    const spawnEmojis = useCallback(
        (emoji: EmojiData, x: number, y: number) => {
            if (!containerRef.current || !engineRef.current) return;

            spawnEmoji({
                emoji,
                x,
                y,
                container: containerRef.current,
                engine: engineRef.current,
                itemsRef,
                idCounterRef: idCounter,
            });
        },
        [containerRef],
    );

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const { engine, runner, mixerWalls, bowlBounds } = setupEngine(container);
        engineRef.current = engine;
        bowlWallsRef.current = mixerWalls;
        bowlBoundsRef.current = bowlBounds;

        const renderer = createRenderLoop({
            container,
            bowlRef,
            itemsRef,
            isBlendingRef,
            blendProgressRef,
            isPoppingRef,
            isDrainingRef,
            lastActivityRef,
            lastInsideIdsRef,
            wavePhaseRef,
            waveAmplitudeRef,
            recipeRef,
            engine,
            setRecipe,
            onContentChange,
        });

        renderer.start();

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
            const collisions = Matter.Query.collides(testBody, mixerWalls);

            callback(collisions.length === 0);
        };

        const handleDropSpawn = () => {
            if (!bowlRef.current) return;
            const bowlElement = bowlRef.current;
            const rect = bowlElement.getBoundingClientRect();

            const overflow = 0;
            const x1 = rect.left - overflow;
            const x2 = rect.right + overflow;
            const centerX = rect.left + rect.width / 2;

            for (let wave = 0; wave < CONFIG.numberWaves; wave++) {
                setTimeout(() => {
                    for (let i = 0; i < CONFIG.numberEmojisSpawned; i++) {
                        spawnEmojis(
                            EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
                            CONFIG.dropType === "random"
                                ? Math.floor(Math.random() * (x2 - x1 + 1)) + x1
                                : centerX,
                            -70,
                        );
                    }
                }, wave * CONFIG.waveDelay);
            }
        };

        const handleTrash = () => {
            if (itemsRef.current.length > 0) {
                const now = performance.now();

                itemsRef.current.reverse().forEach((item, index) => {
                    Matter.World.remove(engine.world, item.body);
                    item.popStartTime = now;
                    item.popDelay = index * CONFIG.popStagger + Math.random() * 40;
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

            renderer.stop();
            Matter.Runner.stop(runner);
            Matter.World.clear(engine.world, false);
            Matter.Engine.clear(engine);
            engineRef.current = null;

            itemsRef.current.forEach((i) => i.el.remove());
            itemsRef.current = [];
        };
    }, [
        bowlRef,
        containerRef,
        onContentChange,
        setRecipe,
        recipeRef,
        spawnEmojis,
        blendProgressRef,
        isBlendingRef,
        isDrainingRef,
        lastActivityRef,
    ]);

    return { spawnEmojis, isFinishedRef };
}
