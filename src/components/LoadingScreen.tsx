import { useState } from "react";

export default function LoadingScreen() {
    const [progress, _setProgress] = useState(0.5);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 99998,
                background: "#2F3135",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "auto",
                cursor: "default",
            }}
        >
            <div
                style={{
                    width: "95%",
                    height: "90%",
                    border: "2px solid #c5d4db73",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    color: "#c5d4db73",
                }}
            >
                <h1>Loading...</h1>
                <div
                    style={{
                        width: "400px",
                        height: "30px",
                        border: "3px solid #c5d4db73",
                        padding: "3px",
                        borderRadius: "50px",
                    }}
                >
                    <div
                        className="loading-bar"
                        style={{
                            width: `${progress * 100}%`,
                            height: "100%",
                            background:
                                "repeating-linear-gradient( -45deg, #3380a4, #3380a4 12px, #3c97c1 12px, #3c97c1 26px )",
                            borderRadius: "50px",
                            transition: "width 0.3s ease-in-out",
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
