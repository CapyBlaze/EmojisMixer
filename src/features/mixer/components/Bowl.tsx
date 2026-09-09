import { forwardRef, type RefObject } from "react";
import LiquidCanvas from "../../../graphics/LiquidCanvas";
import type { EmojiData } from "../../../interface/emoji";

interface BowlProps {
    emojis: EmojiData[];
    progressRef: RefObject<number>;
    isBlendingRef: RefObject<boolean>;
    isDrainingRef: RefObject<boolean>;
}

const Bowl = forwardRef<HTMLCanvasElement, BowlProps>(
    ({ emojis, progressRef, isBlendingRef, isDrainingRef }, ref) => {
        return (
            <>
                <span
                    style={{
                        background: "#7f7f7f",
                        position: "absolute",
                        width: "235px",
                        height: "254px",
                        bottom: "285px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        clipPath:
                            "polygon(0% 0%, 20% 1%, 80% 1%, 100% 0%, 94% 12%, 80% 100%, 20% 100%, 6% 12%)",
                        zIndex: 0,
                    }}
                ></span>

                <LiquidCanvas
                    ref={ref}
                    emojis={emojis}
                    progressRef={progressRef}
                    isBlendingRef={isBlendingRef}
                    isDrainingRef={isDrainingRef}
                    style={{
                        position: "absolute",
                        width: "235px",
                        height: "254px",
                        bottom: "285px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        clipPath:
                            "polygon(0% 0%, 20% 1%, 80% 1%, 100% 0%, 94% 12%, 80% 100%, 20% 100%, 6% 12%)",
                        zIndex: 2,
                    }}
                />
            </>
        );
    },
);

Bowl.displayName = "Bowl";
export default Bowl;
