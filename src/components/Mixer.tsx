import Base from "./Mixer/Base";
import Bowl from "./Mixer/Bowl";
import BowlFront from "./Mixer/BowlFront";
import Lid from "./Mixer/Lid";
import MixerPhysics from "./Mixer/MixerPhysics";
import Tube from "./Mixer/Tube";

export default function Mixer() {
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
                <Bowl />
                <Base />
                <MixerPhysics />

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
