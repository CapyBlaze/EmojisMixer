import { useRef, useState, type RefObject } from "react";
import Base from "./Mixer/Base";
import Bowl from "./Mixer/Bowl";
import BowlFront from "./Mixer/BowlFront";
import { Handle } from "./Mixer/Handle";
import Lid from "./Mixer/Lid";
import MixerPhysics from "./Mixer/MixerPhysics";

interface MixerProps {
    outputTubeRef: RefObject<HTMLDivElement | null>;
}

export default function Mixer({ outputTubeRef }: MixerProps) {
    const bowlRef = useRef<HTMLCanvasElement | null>(null);
    const [numberEmojisInBowl, setNumberEmojisInBowl] = useState(0);

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "500px",
                    height: "620px",
                }}
            >
                <Lid />
                <Handle />
                <Bowl ref={bowlRef} />
                <Base outputTubeRef={outputTubeRef} numberEmojisInBowl={numberEmojisInBowl} />
                <MixerPhysics bowlRef={bowlRef} onCountChange={setNumberEmojisInBowl} />
            </div>

            <div
                style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "500px",
                    height: "620px",
                    zIndex: 5,
                    pointerEvents: "none",
                }}
            >
                <BowlFront />
            </div>
        </>
    );
}
