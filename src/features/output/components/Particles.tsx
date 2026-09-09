import { useMemo } from "react";

interface ParticlesProps {
    type?: "bubbles" | "steam";
}

export default function Particles({ type = "bubbles" }: ParticlesProps) {
    const particles = useMemo(() => {
        return Array.from({ length: 14 }).map((_, i) => ({
            id: i,
            left: ((i * 37) % 80) + 10,
            duration: (((i * 13) % 25) / 10 + 5.5).toFixed(1),
            delay: (-(((i * 7) % 30) / 10)).toFixed(1),
            size: Math.floor(((i * 11) % 10) + 6),
        }));
    }, []);

    return (
        <div
            style={{
                display: "none",

                background: "#41444900",
                position: "absolute",
                height: "240px",
                width: "180px",
                bottom: "365px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 0,
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            {particles.map((p) => {
                if (type === "steam") {
                    return (
                        <div
                            key={p.id}
                            className="particle steam"
                            style={{
                                left: `${p.left}%`,
                                width: `${p.size * 2.5}px`,
                                height: `${p.size * 2.5}px`,
                                animationDuration: `${parseFloat(p.duration) + 1.5}s`,
                                animationDelay: `${p.delay}s`,
                            }}
                        />
                    );
                }

                return (
                    <div
                        key={p.id}
                        className="particle bubble"
                        style={{
                            left: `${p.left}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`,
                        }}
                    />
                );
            })}
        </div>
    );
}
