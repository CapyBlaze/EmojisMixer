import type { RefObject, Dispatch, SetStateAction } from "react";
import Matter from "matter-js";
import CONFIG from "../../../config/config.json";
import EMOJIS from "../../../config/emojis.json";
import renderLiquid from "./renderLiquid";
import { getBowlTransform, isInsideBowlWithTransform } from "../utils/geometryUtils";
import type { EmojiData } from "../../../interface/emoji";
import type { FallingEmoji } from "../hooks/useMixerPhysics";

export interface RenderDependencies {
    container: HTMLDivElement;
    bowlRef: RefObject<HTMLCanvasElement | null>;
    itemsRef: RefObject<FallingEmoji[]>;
    isBlendingRef: RefObject<boolean>;
    blendProgressRef: RefObject<number>;
    isPoppingRef: RefObject<boolean>;
    isDrainingRef: RefObject<boolean>;
    lastActivityRef: RefObject<number>;
    lastInsideIdsRef: RefObject<string>;
    wavePhaseRef: RefObject<number>;
    waveAmplitudeRef: RefObject<number>;
    recipeRef: RefObject<string[] | null>;
    engine: Matter.Engine;
    setRecipe: Dispatch<SetStateAction<string[] | null>>;
    onContentChange?: (content: EmojiData[] | null) => void;
}

export function createRenderLoop(deps: RenderDependencies) {
    let lastTime = performance.now();
    let rafId: number;

    function render(now: number) {
        const delta = now - lastTime;
        lastTime = now;

        const {
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
        } = deps;

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

            const currentEmojiScale = 1 - Math.pow(blendProgressRef.current, CONFIG.shrinkEase);

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

                const t = Math.min(1, elapsed / CONFIG.popDuration);

                if (t >= 1) {
                    item.el.remove();
                    itemsRef.current.splice(i, 1);
                    continue;
                }

                stillPopping = true;

                const popScale = t < 0.35 ? 1 + (t / 0.35) * 0.15 : 1.15 * (1 - (t - 0.35) / 0.65);
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

        rafId = requestAnimationFrame(render);
    }

    return {
        start: () => {
            lastTime = performance.now();
            rafId = requestAnimationFrame(render);
        },
        stop: () => cancelAnimationFrame(rafId),
    };
}
