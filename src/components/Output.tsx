import Decoration from "./Output/Decoration";

export default function Output() {
    return (
        <div
            className="container"
            style={{
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                position: "absolute",
                zIndex: -3,
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
                {/* Content 1 */}
                {/* <span>
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
                            width: "12px",
                            height: "154px",
                            bottom: "105px",
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
                </span> */}

                {/* Content 2 */}
                <span>
                    <span
                        style={{
                            background: "#9fbcc680",
                            position: "absolute",
                            width: "200px",
                            height: "350px",
                            bottom: "70px",
                            left: "50%",
                            zIndex: 2,
                            transform: "translateX(-50%)",
                            borderBottomRightRadius: "20px",
                            borderBottomLeftRadius: "20px",
                        }}
                    ></span>

                    <Decoration style="lemon1" side="right" />
                    <Decoration style="leaf" side="left" />

                    <canvas
                        style={{
                            background: "#01c0ff00",
                            position: "absolute",
                            width: "180px",
                            height: "290px",
                            bottom: "80px",
                            left: "50%",
                            zIndex: 1,
                            transform: "translateX(-50%)",
                            borderBottomRightRadius: "10px",
                            borderBottomLeftRadius: "10px",
                        }}
                    ></canvas>

                    <span
                        style={{
                            background: "#71889040",
                            position: "absolute",
                            width: "180px",
                            height: "340px",
                            bottom: "80px",
                            left: "50%",
                            zIndex: -1,
                            transform: "translateX(-50%)",
                            borderBottomRightRadius: "10px",
                            borderBottomLeftRadius: "10px",
                        }}
                    ></span>
                </span>

                <span
                    style={{
                        background: "#a5988c",
                        position: "absolute",
                        width: "300px",
                        height: "70px",
                        bottom: "0px",
                        left: "50%",
                        zIndex: 2,
                        transform: "translateX(-50%)",
                        borderRadius: "5px",
                    }}
                >
                    <span
                        style={{
                            background: "#595251",
                            position: "absolute",
                            width: "50px",
                            height: "50px",
                            bottom: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 1,
                            borderRadius: "5px",
                        }}
                    >
                        <span
                            style={{
                                background: "#786b67",
                                position: "absolute",
                                width: "42px",
                                height: "42px",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                borderRadius: "2px",
                                zIndex: 1,
                                cursor: "pointer",
                            }}
                        ></span>
                    </span>

                    <span
                        style={{
                            background: "#595251",
                            position: "absolute",
                            width: "50px",
                            height: "50px",
                            bottom: "10px",
                            left: "25%",
                            transform: "translateX(-50%)",
                            zIndex: 1,
                            borderRadius: "5px",
                        }}
                    >
                        <span
                            style={{
                                background: "#786b67",
                                position: "absolute",
                                width: "42px",
                                height: "42px",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                borderRadius: "2px",
                                zIndex: 1,
                                cursor: "pointer",
                            }}
                        ></span>
                    </span>

                    <span
                        style={{
                            background: "#595251",
                            position: "absolute",
                            width: "50px",
                            height: "50px",
                            bottom: "10px",
                            left: "75%",
                            transform: "translateX(-50%)",
                            zIndex: 1,
                            borderRadius: "5px",
                        }}
                    >
                        <span
                            style={{
                                background: "#786b67",
                                position: "absolute",
                                width: "42px",
                                height: "42px",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                borderRadius: "2px",
                                zIndex: 1,
                                cursor: "pointer",
                            }}
                        ></span>
                    </span>
                </span>
            </div>
        </div>
    );
}
