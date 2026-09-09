import { useRef, type RefObject } from "react";
import useRecipeStorage from "./hooks/useRecipeStorage";
import useMixerPhysics from "./hooks/useMixerPhysics";
import useRecipeShare from "./hooks/useRecipeShare";
import type { EmojiData } from "../../interface/emoji";

interface MixerPhysicsProps {
    bowlRef: RefObject<HTMLCanvasElement | null>;
    onContentChange?: (content: EmojiData[] | null) => void;
    blendProgressRef: RefObject<number>;
    isBlendingRef: RefObject<boolean>;
    isDrainingRef: RefObject<boolean>;
    lastActivityRef: RefObject<number>;
}

export default function MixerPhysics({
    bowlRef,
    onContentChange,
    blendProgressRef,
    isBlendingRef,
    isDrainingRef,
    lastActivityRef,
}: MixerPhysicsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { setRecipe, recipeRef } = useRecipeStorage();
    const { spawnEmojis, isFinishedRef } = useMixerPhysics({
        containerRef,
        bowlRef,
        setRecipe,
        recipeRef,
        onContentChange,
        blendProgressRef,
        isBlendingRef,
        isDrainingRef,
        lastActivityRef,
    });
    useRecipeShare({
        recipeRef,
        isFinishedRef,
        bowlRef,
        spawnEmojis,
    });

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "500px",
                height: "620px",
                zIndex: 1,
                pointerEvents: "none",
                overflow: "visible",
            }}
        />
    );
}
