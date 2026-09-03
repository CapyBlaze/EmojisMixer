import { useRef } from "react";
import Base from "./Mixer/Base";
import Bowl from "./Mixer/Bowl";
import BowlFront from "./Mixer/BowlFront";
import { Handle } from "./Mixer/Handle";
import Lid from "./Mixer/Lid";
import MixerPhysics from "./Mixer/MixerPhysics";
import Tube from "./Mixer/Tube";

export default function Mixer() {
    const bowlRef = useRef<HTMLDivElement>(null);

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
                <Base />
                <MixerPhysics bowlRef={bowlRef} />

                <Tube />
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
