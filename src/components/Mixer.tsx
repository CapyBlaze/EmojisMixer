import { useEffect, useRef, useState, type RefObject } from "react";
import Base from "./Mixer/Base";
import Bowl from "./Mixer/Bowl";
import BowlFront from "./Mixer/BowlFront";
import { Handle } from "./Mixer/Handle";
import Lid from "./Mixer/Lid";
import MixerPhysics from "./Mixer/MixerPhysics";
import type { EmojiData } from "../interface/emoji";

interface MixerProps {
    outputPipeRef: RefObject<HTMLDivElement | null>;
}

export default function Mixer({ outputPipeRef }: MixerProps) {
    const bowlRef = useRef<HTMLCanvasElement | null>(null);
    const [emojisInBowl, setEmojisInBowl] = useState<EmojiData[] | null>(null);
    const [isBlending, setIsBlending] = useState(false);

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
                <Bowl ref={bowlRef} />
                <Base outputPipeRef={outputPipeRef} emojisInBowl={emojisInBowl} />
                <MixerPhysics bowlRef={bowlRef} onContentChange={setEmojisInBowl} />
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
