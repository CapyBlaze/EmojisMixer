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
                    <svg viewBox="0 0 32 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 31.5C0 48.897 14.103 63 31.5 63V58C16.8645 58 5 46.1355 5 31.5C5 16.8645 16.8645 5 31.5 5V0C14.103 0 0 14.103 0 31.5Z"
                            fill="url(#paint0_linear_2500_2700)"
                        />
                        <path
                            d="M31.5 58V5C16.8645 5 5 16.8645 5 31.5C5 46.1355 16.8645 58 31.5 58Z"
                            fill="url(#paint1_linear_2500_2700)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2500_2700"
                                x1="15.75"
                                y1="0"
                                x2="15.75"
                                y2="63"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#ACEE55" />
                                <stop offset="1" stopColor="#7BD71F" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2500_2700"
                                x1="15.75"
                                y1="0"
                                x2="15.75"
                                y2="63"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#A7DF83" />
                                <stop offset="1" stopColor="#AEE27B" />
                            </linearGradient>
                        </defs>
                    </svg>
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
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M31.5 0C14.103 0 0 14.103 0 31.5H5C5 16.8645 16.8645 5 31.5 5V0Z"
                            fill="url(#paint0_linear_2500_2701)"
                        />
                        <path
                            d="M31.5 5C16.8645 5 5 16.8645 5 31.5H31.5V5Z"
                            fill="url(#paint1_linear_2500_2701)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2500_2701"
                                x1="15.75"
                                y1="0"
                                x2="15.75"
                                y2="31.5"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#90D75A" />
                                <stop offset="1" stopColor="#98D84A" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2500_2701"
                                x1="15.75"
                                y1="0"
                                x2="15.75"
                                y2="31.5"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#A5DE87" />
                                <stop offset="1" stopColor="#AFE27B" />
                            </linearGradient>
                        </defs>
                    </svg>
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
                    <svg viewBox="0 0 32 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 31.5C0 48.897 14.103 63 31.5 63V58C16.8645 58 5 46.1355 5 31.5C5 16.8645 16.8645 5 31.5 5V0C14.103 0 0 14.103 0 31.5Z"
                            fill="url(#paint0_linear_2500_2695)"
                        />
                        <path
                            d="M31.5 58V5C16.8645 5 5 16.8645 5 31.5C5 46.1355 16.8645 58 31.5 58Z"
                            fill="url(#paint1_linear_2500_2695)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2500_2695"
                                x1="15.75"
                                y1="0"
                                x2="15.75"
                                y2="63"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#EE9855" />
                                <stop offset="1" stopColor="#D7841F" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2500_2695"
                                x1="15.75"
                                y1="0"
                                x2="15.75"
                                y2="63"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#F7F742" />
                                <stop offset="1" stopColor="#F0BD4D" />
                            </linearGradient>
                        </defs>
                    </svg>
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
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M31.5 0C14.103 0 0 14.103 0 31.5H5C5 16.8645 16.8645 5 31.5 5V0Z"
                            fill="url(#paint0_linear_2500_2699)"
                        />
                        <path
                            d="M31.5 5C16.8645 5 5 16.8645 5 31.5H31.5V5Z"
                            fill="url(#paint1_linear_2500_2699)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2500_2699"
                                x1="15.75"
                                y1="0"
                                x2="15.75"
                                y2="31.5"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#EE9D55" />
                                <stop offset="1" stopColor="#CA6F1A" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2500_2699"
                                x1="15.75"
                                y1="0"
                                x2="15.75"
                                y2="31.5"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#EECB55" />
                                <stop offset="1" stopColor="#E6C636" />
                            </linearGradient>
                        </defs>
                    </svg>
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
                    <svg viewBox="0 0 62 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M30 1.43902L0 19H15.375L30.3472 1.47157C30.2315 1.46399 30.1157 1.45314 30 1.43902Z"
                            fill="url(#paint0_linear_2500_2702)"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M31.1528 1.47157L46.125 19H61.5L31.5 1.43902C31.3843 1.45314 31.2685 1.46399 31.1528 1.47157Z"
                            fill="url(#paint1_linear_2500_2702)"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M30.3472 1.47157L15.375 19H30.75H46.125L31.1528 1.47157C30.8843 1.48915 30.6157 1.48915 30.3472 1.47157Z"
                            fill="url(#paint2_linear_2500_2702)"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M30 0.5V1.43902C30.1157 1.45314 30.2315 1.46399 30.3472 1.47157C30.6157 1.48915 30.8843 1.48915 31.1528 1.47157C31.2685 1.46399 31.3843 1.45314 31.5 1.43902V0.5C31.5 0.223858 31.2761 0 31 0H30.5C30.2239 0 30 0.223858 30 0.5Z"
                            fill="white"
                        />
                        <path
                            d="M30 19H32V56.5C32 57.0523 31.5523 57.5 31 57.5C30.4477 57.5 30 57.0523 30 56.5V19Z"
                            fill="url(#paint3_linear_2500_2702)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_2500_2702"
                                x1="30.75"
                                y1="1"
                                x2="30.75"
                                y2="19"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#36F6E3" />
                                <stop offset="1" stopColor="#36AEE6" />
                            </linearGradient>
                            <linearGradient
                                id="paint1_linear_2500_2702"
                                x1="30.75"
                                y1="1"
                                x2="30.75"
                                y2="19"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#36F6E3" />
                                <stop offset="1" stopColor="#36AEE6" />
                            </linearGradient>
                            <linearGradient
                                id="paint2_linear_2500_2702"
                                x1="30.75"
                                y1="0"
                                x2="30.75"
                                y2="57.5"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#73E666" />
                                <stop offset="1" stopColor="#B7F72D" />
                            </linearGradient>
                            <linearGradient
                                id="paint3_linear_2500_2702"
                                x1="30.75"
                                y1="1"
                                x2="30.75"
                                y2="19"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#7E6736" />
                                <stop offset="1" stopColor="#D6AE6E" />
                            </linearGradient>
                        </defs>
                    </svg>
                </span>
            )}
        </span>
    );
}
