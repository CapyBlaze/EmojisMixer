import type { RefObject } from "react";
import Matter from "matter-js";
import CONFIG from "../../../config/config.json";
import EMOJIS from "../../../config/emojis.json";
import defaultFile from "../../../utils/defaultFile";
import type { EmojiData } from "../../../interface/emoji";
import type { FallingEmoji } from "../hooks/useMixerPhysics";

export interface SpawnEmojiParams {
    emoji: EmojiData;
    x: number;
    y: number;
    container: HTMLDivElement;
    engine: Matter.Engine;
    itemsRef: RefObject<FallingEmoji[]>;
    idCounterRef: RefObject<number>;
}

export function spawnEmoji({
    emoji,
    x,
    y,
    container,
    engine,
    itemsRef,
    idCounterRef,
}: SpawnEmojiParams) {
    const rect = container.getBoundingClientRect();
    const localX = x - rect.left;
    const localY = y - rect.top;

    const baseRadius = CONFIG.emojiBodyRadius;
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
    container.appendChild(el);

    const emojiIndex = EMOJIS.findIndex((e) => e === emoji);

    if (itemsRef.current && idCounterRef.current !== undefined) {
        itemsRef.current.push({
            id: idCounterRef.current++,
            body,
            el,
            scale: 1,
            baseRadius,
            emojiIndex,
        });
    }
}
