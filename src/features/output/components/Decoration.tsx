export default function Decoration({
    style,
    side,
}: {
    style: "leaf" | "orange1" | "orange2" | "lemon1" | "lemon2" | "umbrella";
    side: "left" | "right";
}) {
    return (
        <span className="not-selected" style={{ zIndex: 0 }}>
            {style === "lemon1" && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "391px",
                        height: "18%",
                        width: "18%",

                        ...(side === "left" ? { left: "84%" } : { right: "84%" }),
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
                        bottom: "391px",
                        height: "18%",
                        width: "18%",

                        ...(side === "left" ? { left: "77%" } : { right: "77%" }),
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
                        bottom: "388px",
                        height: "20%",
                        width: "20%",

                        ...(side === "left" ? { left: "84%" } : { right: "84%" }),
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
                        bottom: "391px",
                        height: "20%",
                        width: "20%",

                        ...(side === "left" ? { left: "77%" } : { right: "77%" }),
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
                        bottom: "356px",
                        height: "28%",
                        width: "28%",

                        ...(side === "left" ? { left: "87%" } : { right: "87%" }),
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
                        bottom: "228px",
                        height: "50%",
                        width: "50%",

                        ...(side === "left" ? { left: "68%" } : { right: "68%" }),
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
