export default function Base() {
    const colors = [
        "#e28e8e",
        "#e29e8e",
        "#e2ad8e",
        "#e2bd8e",
        "#e2cc8e",
        "#d9d68f",
        "#c6d991",
        "#b3dc93",
        "#a1df95",
        "#8ee297",
    ];

    return (
        <span>
            <span
                style={{
                    background: "#595251",
                    position: "absolute",
                    width: "100px",
                    height: "100px",
                    bottom: "100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderRadius: "50%",
                    zIndex: 1,
                }}
            >
                <span
                    style={{
                        background: "#786B67",
                        position: "absolute",
                        width: "75px",
                        height: "75px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        zIndex: 1,
                    }}
                ></span>
            </span>

            <span
                style={{
                    background: "#2c2626",
                    position: "absolute",
                    width: "154px",
                    height: "18px",
                    bottom: "312px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(47% 0%, 53% 0%, 53% 100%, 47% 100%)",
                    zIndex: 0,
                }}
            ></span>
            <span
                style={{
                    background: "#2c2626",
                    position: "absolute",
                    width: "154px",
                    height: "18px",
                    bottom: "312px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(68% 0%, 73% 0%, 64% 100%, 51% 100%)",
                    zIndex: 0,
                }}
            ></span>
            <span
                style={{
                    background: "#2c2626",
                    position: "absolute",
                    width: "154px",
                    height: "18px",
                    bottom: "312px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(32% 0%, 27% 0%, 36% 100%, 49% 100%)",
                    zIndex: 0,
                }}
            ></span>

            <span
                style={{
                    background: "#453d3d",
                    position: "absolute",
                    width: "140px",
                    height: "19px",
                    bottom: "293px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(73% 0%, 27% 0%, 0% 100%, 100% 100%)",
                    zIndex: 0,
                }}
            ></span>

            <div
                className="not-selected"
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "rgb(130 121 103 / 44%)",
                    position: "absolute",
                    width: "200px",
                    height: "30px",
                    bottom: "210px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    textAlign: "center",
                    textTransform: "uppercase",
                    borderRadius: "9px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#4f493e9c",
                }}
            >
                Emojis Mixer
            </div>

            <span
                style={{
                    background: "#A99882",
                    position: "absolute",
                    width: "50px",
                    height: "36px",
                    bottom: "257px",
                    right: "160px",
                    clipPath: "polygon(0% 0%, 85% 0%, 100% 100%, 0% 100%)",
                    zIndex: 1,
                }}
            ></span>
            <span
                style={{
                    background: "#A99882",
                    position: "absolute",
                    width: "50px",
                    height: "36px",
                    bottom: "257px",
                    left: "160px",
                    clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    zIndex: 1,
                }}
            ></span>
            <span
                style={{
                    background: "#8F8172",
                    position: "absolute",
                    width: "80px",
                    height: "36px",
                    bottom: "257px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                }}
            ></span>

            <span
                style={{
                    background: "#E3D8C1",
                    position: "absolute",
                    width: "256px",
                    height: "18px",
                    bottom: "249px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
                }}
            ></span>
            <span
                style={{
                    background: "#dac197",
                    position: "absolute",
                    width: "320px",
                    height: "157px",
                    bottom: "92px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                }}
            ></span>
            <span
                style={{
                    background: "#ac9777",
                    position: "absolute",
                    width: "320px",
                    height: "48px",
                    bottom: "44px",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <span
                    style={{
                        background: "#3E3D3C",
                        position: "absolute",
                        width: "230px",
                        height: "24px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "5px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "4px",
                        paddingLeft: "4px",
                        paddingRight: "4px",
                    }}
                >
                    {colors.map((color, index) => (
                        <span
                            key={index}
                            style={{
                                background: color,
                                width: "stretch",
                                height: "16px",
                                borderRadius: "2px",
                            }}
                        ></span>
                    ))}
                </span>
            </span>

            <span
                style={{
                    background: "#7e716cab",
                    position: "absolute",
                    width: "40px",
                    height: "14px",
                    bottom: "30px",
                    left: "112px",
                    borderBottomRightRadius: "6px",
                    borderBottomLeftRadius: "6px",
                }}
            ></span>
            <span
                style={{
                    background: "#7e716cab",
                    position: "absolute",
                    width: "40px",
                    height: "14px",
                    bottom: "30px",
                    right: "112px",
                    borderBottomRightRadius: "6px",
                    borderBottomLeftRadius: "6px",
                }}
            ></span>
        </span>
    );
}
