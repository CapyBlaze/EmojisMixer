import { useState } from "react";

export default function ButtonCheck({
    icon,
    alt,
    onClick,
}: {
    icon: string;
    alt: string;
    onClick: () => void | Promise<void>;
}) {
    const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

    const handleClick = async () => {
        if (status === "loading") return;

        setStatus("loading");
        try {
            await onClick();
        } finally {
            setStatus("done");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="button-check output-button"
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
            disabled={status === "loading"}
        >
            <img
                src={icon}
                alt={alt}
                draggable="false"
                className={`not-selected icon-gif ${status === "idle" ? "active" : ""}`}
                style={{
                    width: "30px",
                    height: "30px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />
            <div className={`icon-spinner ${status === "loading" ? "active" : ""}`} />
            <img
                src="./checkmark.svg"
                alt="checkmark"
                draggable="false"
                className={`not-selected icon-check ${status === "done" ? "active" : ""}`}
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
    );
}
