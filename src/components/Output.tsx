import type { RefObject } from "react";
import Decoration from "./Output/Decoration";

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
                    <span
                        style={{
                            background: "#595251",
                            position: "absolute",
                            width: "50px",
                            height: "50px",
                            bottom: "19px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 1,
                            borderRadius: "5px",
                        }}
                    >
                        <button
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
                                border: "none",
                            }}
                        >
                            <img
                                src="./star-outline.svg"
                                alt="Star"
                                draggable="false"
                                className="not-selected"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                        </button>
                    </span>

                    <span
                        style={{
                            background: "#595251",
                            position: "absolute",
                            width: "50px",
                            height: "50px",
                            bottom: "19px",
                            left: "25%",
                            transform: "translateX(-50%)",
                            zIndex: 1,
                            borderRadius: "5px",
                            border: "none",
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
                        >
                            <img
                                src="./image.svg"
                                alt="Image"
                                draggable="false"
                                className="not-selected"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                        </span>
                    </span>

                    <span
                        style={{
                            background: "#595251",
                            position: "absolute",
                            width: "50px",
                            height: "50px",
                            bottom: "19px",
                            left: "75%",
                            transform: "translateX(-50%)",
                            zIndex: 1,
                            borderRadius: "5px",
                        }}
                    >
                        <button
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
                                border: "none",
                            }}
                        >
                            <img
                                src="./link.svg"
                                alt="Link"
                                draggable="false"
                                className="not-selected"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                        </button>
                    </span>
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

                <span
                    style={{
                        position: "absolute",
                        width: "110px",
                        height: "110px",
                        bottom: "88px",
                        right: "220px",
                        zIndex: 2,
                        transform: "rotate(300deg)",
                    }}
                >
                    <svg viewBox="0 0 47 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15.965 0C10.066 18.5401 7.95057 29.1998 9.965 49.5C-1.15809 36.0519 -7.48447 26.4381 15.965 0Z"
                            fill="url(#paint0_linear_2500_2686)"
                        />
                        <path
                            d="M18.3029 41.7094C26.849 33.9505 34.5117 28.655 46.4615 24C36.3279 22.9695 29.2386 23.7928 24.167 25.9612C24.337 31.734 22.5485 36.6742 18.3029 41.7094Z"
                            fill="url(#paint1_linear_2500_2686)"
                        />
                        <path
                            d="M10.0781 49.4112C10.345 49.2012 10.6078 48.9921 10.8665 48.7838C13.8938 46.3461 16.3566 44.0178 18.3029 41.7094C22.5485 36.6742 24.337 31.734 24.167 25.9612C23.9631 19.0382 20.9425 10.9178 15.965 0C10.066 18.5401 7.95057 29.1998 9.965 49.5L10.0781 49.4112Z"
                            fill="url(#paint2_linear_2500_2686)"
                        />
                        <path
                            d="M46.4615 24C34.5117 28.655 26.849 33.9505 18.3029 41.7094C16.3566 44.0178 13.8938 46.3461 10.8665 48.7838C10.6078 48.9921 10.345 49.2012 10.0781 49.4112L9.965 49.5C9.97797 49.5157 9.99024 49.5319 10.0025 49.5482C10.0149 49.5646 10.0273 49.5811 10.0404 49.5969C29.767 54.141 38.4615 44.5 46.4615 24Z"
                            fill="url(#paint3_linear_2500_2686)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2500_2686"
                                x1="23.2307"
                                y1="0"
                                x2="23.2307"
                                y2="50.7027"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#51C736" />
                                <stop offset="1" stopColor="#ACE59F" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2500_2686"
                                x1="23.2307"
                                y1="0"
                                x2="23.2307"
                                y2="50.7027"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#32BD13" />
                                <stop offset="1" stopColor="#ACE59F" />
                            </linearGradient>
                            <linearGradient
                                id="paint2_linear_2500_2686"
                                x1="23.2307"
                                y1="0"
                                x2="23.2307"
                                y2="50.7027"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#59DE3C" />
                                <stop offset="1" stopColor="#B7E6AD" />
                            </linearGradient>
                            <linearGradient
                                id="paint3_linear_2500_2686"
                                x1="23.2307"
                                y1="0"
                                x2="23.2307"
                                y2="50.7027"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#43DF20" />
                                <stop offset="1" stopColor="#B2E2A7" />
                            </linearGradient>
                        </defs>
                    </svg>
                </span>

                <span
                    style={{
                        position: "absolute",
                        width: "70px",
                        height: "70px",
                        bottom: "110px",
                        right: "-18px",
                        zIndex: 0,
                        transform: "rotate(52deg)",
                    }}
                >
                    <svg viewBox="0 0 33 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M19.673 54C42.6699 38 30.8878 13.4694 11.173 0C17.2339 17.9299 19.4626 29.3401 19.673 54Z"
                            fill="url(#paint0_linear_2529_2684)"
                        />
                        <path
                            d="M19.673 54C-4.82987 48.5 -4.98798 24.3028 11.173 0C17.2339 17.9299 19.4626 29.3401 19.673 54Z"
                            fill="url(#paint1_linear_2529_2684)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2529_2684"
                                x1="16.1512"
                                y1="0"
                                x2="16.1512"
                                y2="54"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#7DE067" />
                                <stop offset="1" stopColor="#ADE1A1" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2529_2684"
                                x1="16.1512"
                                y1="0"
                                x2="16.1512"
                                y2="54"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#5ECC45" />
                                <stop offset="1" stopColor="#ACE89D" />
                            </linearGradient>
                        </defs>
                    </svg>
                </span>

                <span
                    style={{
                        position: "absolute",
                        width: "110px",
                        height: "110px",
                        bottom: "79px",
                        right: "35px",
                        zIndex: 2,
                        transform: "rotate(241deg) scale(-1)",
                    }}
                >
                    <svg viewBox="0 0 48 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M47.5031 23.5C43.8871 8.76477 38.5458 1.70433 0 0C15.7432 13.162 26.29 18.0302 47.5031 23.5Z"
                            fill="url(#paint0_linear_2529_2683)"
                        />
                        <path
                            d="M47.5031 23.5C43 33 16 39.5 0 0C15.7432 13.162 26.29 18.0302 47.5031 23.5Z"
                            fill="url(#paint1_linear_2529_2683)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2529_2683"
                                x1="23.7515"
                                y1="0"
                                x2="23.7515"
                                y2="30.7098"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#56C93C" />
                                <stop offset="1" stopColor="#A1E193" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2529_2683"
                                x1="23.7515"
                                y1="0"
                                x2="23.7515"
                                y2="30.7098"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#62DE46" />
                                <stop offset="1" stopColor="#AEE5A2" />
                            </linearGradient>
                        </defs>
                    </svg>
                </span>
            </div>
        </div>
    );
}
