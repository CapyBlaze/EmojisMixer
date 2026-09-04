import type { RefObject } from "react";
import Decoration from "./Output/Decoration";
import BaseDecoration from "./Output/BaseDecoration";
import Button from "./Output/Button";

interface OutputProps {
    inputTubeRef: RefObject<HTMLDivElement | null>;
}

export default function Output({ inputTubeRef }: OutputProps) {
    return (
        <div
            className="container"
            style={{
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                position: "absolute",
                zIndex: 0,
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
                <span>
                    <span
                        style={{
                            background: "#9fbcc680",
                            position: "absolute",
                            width: "200px",
                            height: "350px",
                            bottom: "88px",
                            left: "50%",
                            zIndex: 2,
                            transform: "translateX(-50%)",
                            borderBottomRightRadius: "20px",
                            borderBottomLeftRadius: "20px",
                        }}
                    ></span>

                    <Decoration style="lemon1" side="right" />
                    <Decoration style="umbrella" side="left" />

                    <canvas
                        style={{
                            background: "#01c0ffb9",
                            position: "absolute",
                            width: "180px",
                            height: "290px",
                            bottom: "98px",
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
                            bottom: "98px",
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
                        height: "88px",
                        bottom: "0px",
                        left: "50%",
                        zIndex: 2,
                        transform: "translateX(-50%)",
                        borderRadius: "5px",
                    }}
                >
                    <Button />
                </span>

                <span
                    ref={inputTubeRef}
                    style={{
                        background: "#7E716C",
                        position: "absolute",
                        width: "53px",
                        height: "70px",
                        bottom: "8px",
                        right: "281px",
                        zIndex: -1,
                        borderRadius: "6px",
                    }}
                ></span>

                <span
                    style={{
                        background: "#625d5a",
                        position: "absolute",
                        width: "53px",
                        height: "55px",
                        bottom: "15.5px",
                        right: "289px",
                        zIndex: -2,
                        borderRadius: "3px",
                    }}
                ></span>

                <BaseDecoration />
            </div>
        </div>
    );
}
