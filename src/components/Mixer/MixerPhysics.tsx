import { useRef, type RefObject } from "react";
import useRecipeStorage from "./hooks/useRecipeStorage";
import useMixerPhysics from "./hooks/useMixerPhysics";
import useRecipeShare from "./hooks/useRecipeShare";

interface MixerPhysicsProps {
    bowlRef: RefObject<HTMLCanvasElement | null>;
    onCountChange?: (count: number) => void;
}

export default function MixerPhysics({ bowlRef, onCountChange }: MixerPhysicsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { setRecipe, recipeRef } = useRecipeStorage();
    const { spawnEmojis, isFinishedRef } = useMixerPhysics({
        containerRef,
        bowlRef,
        setRecipe,
        onCountChange,
    });
    useRecipeShare({
        recipeRef,
        isFinishedRef,
        bowlRef,
        spawnEmojis,
    });

    return (
        <>
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

            <span
                style={{
                    position: "absolute",
                    width: "235px",
                    height: "254px",
                    bottom: "285px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: -100,
                }}
            >
                <svg viewBox="0 0 218 236" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.4096 235.697L12.6028 28.4704L0 0L54.1453 2.33364H163.369L217.515 0L204.912 28.4704L204.843 28.9371L174.105 235.697H43.4096Z" />
                </svg>
            </span>
        </>
    );
}
