export default function Decoration({
    style,
    side,
}: {
    style: "leaf" | "orange1" | "orange2" | "lemon1" | "lemon2" | "umbrella";
    side: "left" | "right";
}) {
    return (
        <span style={{ zIndex: 0 }}>
            {style === "lemon1" && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "405px",
                        height: "40%",
                        width: "40%",

                        ...(side === "left" ? { left: "152%" } : { right: "152%" }),
                        transform:
                            side === "left"
                                ? "translateX(-50%) scaleX(1.0) rotate(124deg)"
                                : "translateX(50%) scaleX(-1.0) rotate(124deg)",
                    }}
                >
                    <img src="./decoration/lemon1.svg" alt="lemon1" fetchPriority="high" />
                </span>
            )}

            {style === "lemon2" && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "415px",
                        height: "45%",
                        width: "45%",

                        ...(side === "left" ? { left: "134%" } : { right: "134%" }),
                        transform:
                            side === "left"
                                ? "translateX(-50%) scaleX(1.0) rotate(74deg)"
                                : "translateX(50%) scaleX(-1.0) rotate(74deg)",
                    }}
                >
                    <img src="./decoration/lemon2.svg" alt="lemon2" fetchPriority="high" />
                </span>
            )}

            {style === "orange1" && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "405px",
                        height: "44%",
                        width: "44%",

                        ...(side === "left" ? { left: "150%" } : { right: "150%" }),
                        transform:
                            side === "left"
                                ? "translateX(-50%) scaleX(1.0) rotate(124deg)"
                                : "translateX(50%) scaleX(-1.0) rotate(124deg)",
                    }}
                >
                    <img src="./decoration/orange1.svg" alt="orange1" fetchPriority="high" />
                </span>
            )}

            {style === "orange2" && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "417px",
                        height: "44%",
                        width: "44%",

                        ...(side === "left" ? { left: "135%" } : { right: "135%" }),
                        transform:
                            side === "left"
                                ? "translateX(-50%) scaleX(1.0) rotate(74deg)"
                                : "translateX(50%) scaleX(-1.0) rotate(74deg)",
                    }}
                >
                    <img src="./decoration/orange2.svg" alt="orange2" fetchPriority="high" />
                </span>
            )}

            {style === "leaf" && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "410px",
                        height: "64%",
                        width: "64%",

                        ...(side === "left" ? { left: "143%" } : { right: "143%" }),
                        transform:
                            side === "left"
                                ? "translateX(-50%) scaleX(1.0)"
                                : "translateX(50%) scaleX(-1.0)",
                    }}
                >
                    <img src="./decoration/leaf.svg" alt="leaf" fetchPriority="high" />
                </span>
            )}

            {style === "umbrella" && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "335px",
                        height: "120%",
                        width: "120%",

                        ...(side === "left" ? { left: "108%" } : { right: "108%" }),
                        transform:
                            side === "left"
                                ? "translateX(-50%) scaleX(1.0) rotate(13deg)"
                                : "translateX(50%) scaleX(-1.0) rotate(13deg)",
                    }}
                >
                    <img src="./decoration/umbrella.svg" alt="umbrella" fetchPriority="high" />
                </span>
            )}
        </span>
    );
}
