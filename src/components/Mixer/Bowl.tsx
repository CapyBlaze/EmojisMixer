export default function Bowl() {
    return (
        <span>
            <span
                style={{
                    background: "#625d5b",
                    position: "absolute",
                    width: "110px",
                    height: "198px",
                    bottom: "320px",
                    zIndex: 0,
                    right: "86px",
                    clipPath:
                        "polygon(82% 1%, 100% 12%, 79% 80%, 10% 99%, 10% 85%, 58% 72%, 75% 17%, 71% 15%, 0% 14%, 0% 1%)",
                }}
            ></span>

            <span
                style={{
                    background: "#7f7f7f",
                    position: "absolute",
                    width: "235px",
                    height: "254px",
                    bottom: "293px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath:
                        "polygon(0% 0%, 20% 1%, 80% 1%, 100% 0%, 94% 12%, 80% 100%, 20% 100%, 6% 12%)",
                    zIndex: 0,
                }}
            ></span>
        </span>
    );
}
