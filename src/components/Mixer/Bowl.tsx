import { forwardRef } from "react";

const Bowl = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    return (
        <span
            ref={ref}
            style={{
                background: "#7f7f7f",
                position: "absolute",
                width: "235px",
                height: "254px",
                bottom: "284px",
                left: "50%",
                transform: "translateX(-50%)",
                clipPath:
                    "polygon(0% 0%, 20% 1%, 80% 1%, 100% 0%, 94% 12%, 80% 100%, 20% 100%, 6% 12%)",
                zIndex: 0,
            }}
            {...props}
        ></span>
    );
});

Bowl.displayName = "Bowl";
export default Bowl;
