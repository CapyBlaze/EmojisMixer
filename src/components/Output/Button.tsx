export default function Button() {
    return (
        <>
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
                </button>
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
        </>
    );
}
