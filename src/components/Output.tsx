export default function Output() {
    return (
        <div
            className="container"
            style={{
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                position: "absolute",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    margin: 0,
                }}
            >
                Output
            </h2>

            <div
                style={{
                    position: "absolute",
                    height: "560px",
                    width: "300px",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <span
                    style={{
                        background: "#858E91",
                        position: "absolute",
                        width: "275px",
                        height: "130px",
                        bottom: "235px",
                        left: "50%",
                        zIndex: 1,
                        transform: "translateX(-50%)",
                        clipPath: "polygon(0% 0%, 100% 0%, 55% 100%, 45% 100%)",
                    }}
                ></span>
                <span
                    style={{
                        background: "#858E91",
                        position: "absolute",
                        width: "27px",
                        height: "132px",
                        bottom: "104px",
                        left: "50%",
                        zIndex: 1,
                        transform: "translateX(-50%)",
                    }}
                ></span>
                <span
                    style={{
                        background: "#858E91",
                        position: "absolute",
                        width: "209px",
                        height: "35px",
                        bottom: "70px",
                        left: "50%",
                        zIndex: 1,
                        transform: "translateX(-50%)",
                        clipPath: "polygon(44% 0%, 56% 0%, 90% 100%, 10% 100%)",
                    }}
                ></span>
            </div>
        </div>
    );
}
