export default function Lid() {
    return (
        <span style={{ display: "none" }}>
            <span
                style={{
                    background: "linear-gradient(90deg, #5B5453 50%, #4D4646 50%)",
                    position: "absolute",
                    width: "75px",
                    height: "39px",
                    bottom: "541px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 0,
                    borderRadius: "6px",
                }}
            ></span>

            <span
                style={{
                    background: "#7E716C",
                    position: "absolute",
                    width: "91px",
                    height: "26px",
                    bottom: "535px",
                    right: "132px",
                    clipPath: "polygon(0% 0%, 25% 0%, 100% 90%, 30% 100%)",
                    zIndex: 1,
                }}
            ></span>
            <span
                style={{
                    background: "#7E716C",
                    position: "absolute",
                    width: "91px",
                    height: "26px",
                    bottom: "535px",
                    left: "132px",
                    clipPath: "polygon(100% 0%, 75% 0%, 0% 90%, 70% 100%)",
                    zIndex: 1,
                }}
            ></span>
            <span
                style={{
                    background: "#6A605D",
                    position: "absolute",
                    width: "117px",
                    height: "26px",
                    bottom: "535px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    clipPath: "polygon(73% 0%, 27% 0%, 0% 100%, 100% 100%)",
                    zIndex: 1,
                }}
            ></span>
        </span>
    );
}
