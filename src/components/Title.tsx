export default function Title() {
    return (
        <div
            className="container"
            style={{
                top: "15px",
                left: "50%",
                transform: "translateX(-50%)",
                position: "absolute",
                height: "45px",
                width: "650px",
                padding: "0",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    margin: 0,
                    fontSize: "28px",
                }}
            >
                Emojis Mixer
            </h1>
        </div>
    );
}
