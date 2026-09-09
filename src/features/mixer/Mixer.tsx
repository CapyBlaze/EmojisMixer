import { useEffect, useRef, useState, type RefObject } from "react";
import Base from "./components/Base";
import Bowl from "./components/Bowl";
import BowlFront from "./components/BowlFront";
import { Handle } from "./components/Handle";
import Lid from "./components/Lid";
import MixerPhysics from "./components/MixerPhysics";
import type { EmojiData } from "../../interface/emoji";

interface MixerProps {
    outputPipeRef: RefObject<HTMLDivElement | null>;
}

export default function Mixer({ outputPipeRef }: MixerProps) {
    const bowlRef = useRef<HTMLCanvasElement | null>(null);
    const [emojisInBowl, setEmojisInBowl] = useState<EmojiData[] | null>(null);
    const [isBlending, setIsBlending] = useState(false);

    const blendProgressRef = useRef(0);
    const isBlendingRef = useRef(false);
    const isDrainingRef = useRef(false);
    const lastActivityRef = useRef(0);

    useEffect(() => {
        const handleStartBlend = () => setIsBlending(true);
        const handleStopBlend = () => setIsBlending(false);

        window.addEventListener("emoji-start-blend", handleStartBlend);
        window.addEventListener("emoji-stop-blend", handleStopBlend);

        return () => {
            window.removeEventListener("emoji-start-blend", handleStartBlend);
            window.removeEventListener("emoji-stop-blend", handleStopBlend);
        };
    }, []);

    return (
        <div
            style={{
                width: "500px",
                height: "620px",
                position: "absolute",
                top: "60%",
                left: "50%",
                translate: "-50% -50%",
                transformOrigin: "center bottom",
                backfaceVisibility: "hidden",
                willChange: "transform",
                zIndex: 1,

                animation: isBlending ? "shake-blender 0.1s linear infinite" : "none",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width: "500px",
                    height: "620px",
                }}
            >
                <Lid />
                <Handle />
                <Bowl
                    ref={bowlRef}
                    emojis={emojisInBowl ?? []}
                    progressRef={blendProgressRef}
                    isBlendingRef={isBlendingRef}
                    isDrainingRef={isDrainingRef}
                />
                <Base outputPipeRef={outputPipeRef} emojisInBowl={emojisInBowl} />
                <MixerPhysics
                    bowlRef={bowlRef}
                    onContentChange={setEmojisInBowl}
                    blendProgressRef={blendProgressRef}
                    isBlendingRef={isBlendingRef}
                    isDrainingRef={isDrainingRef}
                    lastActivityRef={lastActivityRef}
                />
            </div>

            <div
                style={{
                    position: "absolute",
                    width: "500px",
                    height: "620px",
                    zIndex: 5,
                    pointerEvents: "none",
                }}
            >
                <BowlFront />
            </div>
        </div>
    );
}
