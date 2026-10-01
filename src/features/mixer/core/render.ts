import type { RefObject, Dispatch, SetStateAction } from "react";
import Matter from "matter-js";
import CONFIG from "../../../configs/config.json";
import EMOJIS from "../../../configs/emojis.json";
import renderLiquid from "./renderLiquid";
import { getBowlTransform, isInsideBowlWithTransform } from "../utils/geometryUtils";
import type { EmojiData } from "../../../interfaces/emoji";
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

function spawnBurst(container: HTMLElement, x: number, y: number) {
    const COUNT = 8;
    for (let i = 0; i < COUNT; i++) {
        const angle = (Math.PI * 2 * i) / COUNT + Math.random() * 0.5;
        const dist = 16 + Math.random() * 14;
        const size = 3 + Math.random() * 3;

        const p = document.createElement("div");
        p.style.cssText = `
            position:absolute; left:0; top:0;
            width:${size}px; height:${size}px;
            margin:${-size / 2}px 0 0 ${-size / 2}px;
            border-radius:50%;
            background:radial-gradient(circle,#fff 0%,#ffe9a8 55%,transparent 100%);
            pointer-events:none; z-index:5;
        `;
        container.appendChild(p);

        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;

        const anim = p.animate(
            [
                { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 },
                { transform: `translate(${x + dx}px, ${y + dy}px) scale(0)`, opacity: 0 },
            ],
            { duration: 450, easing: "cubic-bezier(.2,.8,.3,1)" },
        );
        anim.onfinish = () => p.remove();
    }
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
                const { x, y } = item.body.position;

                if (t >= 1) {
                    spawnBurst(container, x, y);
                    Matter.World.remove(engine.world, item.body);
                    item.el.remove();
                    itemsRef.current.splice(i, 1);
                    continue;
                }

                stillPopping = true;

                const ease = t * t;
                const scale = item.scale * (1 - ease);
                const spin = ease * 0.8;
                const blur = ease * 6;
                const glow = 1 + ease * 0.8;
                const opacity = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;

                item.el.style.transform = `translate(${x - CONFIG.emojiRadius}px, ${
                    y - CONFIG.emojiRadius
                }px) rotate(${item.body.angle + spin}rad) scale(${Math.max(0, scale)})`;
                item.el.style.filter = `blur(${blur}px) brightness(${glow})`;
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
            totalBlenderContent,
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
