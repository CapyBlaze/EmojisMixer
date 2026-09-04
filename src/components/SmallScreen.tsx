export default function SmallScreen() {
    return (
        <div
            className="small-screen"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 99999,
                background: "#2F3135",
                display: "none",
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
                <img
                    src="./mixerScreenSmall.svg"
                    alt="Mixer Screen Small"
                    style={{
                        width: "200px",
                    }}
                />
                <h1
                    style={{
                        color: "#f4eee8",
                        margin: "30px 0 10px 0",
                        fontSize: "40px",
                    }}
                >
                    SCREEN TOO SMALL
                </h1>
                <p
                    style={{
                        margin: 0,
                        fontSize: "18px",
                        lineHeight: "1.5",
                        color: "#d3dbdf87",
                    }}
                >
                    Emojis Mixer needs more space to work properly.
                    <br />
                    Please increase your screen size for the best experience.
                </p>
            </div>
        </div>
    );
}
