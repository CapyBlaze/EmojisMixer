import { createPortal } from "react-dom";
import type { JSX } from "react/jsx-runtime";

interface PopUpProps {
    popupContent: JSX.Element;
    actionText: string;
    onAction: () => void;
    onClose: () => void;
}

export default function PopUp({ popupContent, actionText, onAction, onClose }: PopUpProps) {
    return createPortal(
        <div
            style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    maxWidth: "340px",
                }}
            >
                <h2
                    style={{
                        textTransform: "uppercase",
                        borderBottom: "3px solid #B1B3B8",
                        height: "38px",
                        width: "100%",
                        textAlign: "center",
                        margin: "0",
                        marginBottom: "20px",
                    }}
                >
                    Confirmation
                </h2>
                <p
                    style={{
                        margin: "0",
                        textAlign: "center",
                        fontSize: "18px",
                        fontWeight: "400",
                    }}
                >
                    {popupContent}
                </p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginTop: "20px",
                    }}
                >
                    <button
                        onClick={onClose}
                        className="popup-button secondary"
                        style={{
                            width: "100%",
                            height: "45px",
                            background: "#DDDDDD",
                            border: "none",
                            borderRadius: "5px",
                            color: "#343539",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "15px",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAction}
                        className="popup-button primary"
                        style={{
                            width: "100%",
                            height: "45px",
                            background: "#424348",
                            border: "none",
                            borderRadius: "5px",
                            color: "#fbfbfb",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "15px",
                        }}
                    >
                        {actionText}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("root") as HTMLElement,
    );
}
