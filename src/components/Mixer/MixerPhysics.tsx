import { useEffect, useRef } from "react";
import Matter from "matter-js";

type FallingEmoji = { id: number; body: Matter.Body; el: HTMLSpanElement };

const CONTAINER_WIDTH = 500;
const CONTAINER_HEIGHT = 620;
const EMOJI_RADIUS = 12;

const RIM_Y = 73;
const RIM_LEFT = 132.5;
const RIM_RIGHT = 367.5;

const FLOOR_Y = 327;
const FLOOR_LEFT = 179.5;
const FLOOR_RIGHT = 320.5;

const DEBUG_MODE = true;

function makeWall(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    return Matter.Bodies.rectangle((x1 + x2) / 2, (y1 + y2) / 2, length, 4, {
        isStatic: true,
        angle,
        friction: 0.8,
        restitution: 0.15,
    });
}

export default function MixerPhysics() {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<FallingEmoji[]>([]);
    const idCounter = useRef(0);

    useEffect(() => {
        const engine = Matter.Engine.create();
        engine.gravity.y = 1.1;

        if (DEBUG_MODE) {
            const debugCanvas = document.createElement("canvas");
            debugCanvas.width = CONTAINER_WIDTH;
            debugCanvas.height = CONTAINER_HEIGHT;
            Object.assign(debugCanvas.style, {
                position: "absolute",
                inset: "0",
                zIndex: "10",
                pointerEvents: "none",
            });
            containerRef.current?.appendChild(debugCanvas);

            const debugRender = Matter.Render.create({
                canvas: debugCanvas,
                engine,
                options: {
                    width: CONTAINER_WIDTH,
                    height: CONTAINER_HEIGHT,
                    wireframes: true,
                    background: "transparent",
                    showAngleIndicator: true,
                },
            });
            Matter.Render.run(debugRender);
        }

        const leftWall = makeWall(RIM_LEFT, RIM_Y, FLOOR_LEFT, FLOOR_Y);
        const rightWall = makeWall(RIM_RIGHT, RIM_Y, FLOOR_RIGHT, FLOOR_Y);
        const floor = Matter.Bodies.rectangle(
            (FLOOR_LEFT + FLOOR_RIGHT) / 2,
            FLOOR_Y + 5,
            FLOOR_RIGHT - FLOOR_LEFT,
            10,
            { isStatic: true, friction: 0.9, restitution: 0.1 },
        );
        Matter.World.add(engine.world, [leftWall, rightWall, floor]);

        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        let raf: number;
        const render = () => {
            for (const item of itemsRef.current) {
                const { x, y } = item.body.position;
                item.el.style.transform = `translate(${x - EMOJI_RADIUS}px, ${y - EMOJI_RADIUS}px) rotate(${item.body.angle}rad)`;
            }
            raf = requestAnimationFrame(render);
        };
        raf = requestAnimationFrame(render);

        const handleDrop = (e: Event) => {
            const { emoji, x, y } = (e as CustomEvent).detail;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const localX = x - rect.left;
            const localY = y - rect.top;

            const t = Math.max(
                0,
                Math.min(1, (localY - RIM_Y) / (FLOOR_Y - RIM_Y)),
            );
            const leftBound = RIM_LEFT + (FLOOR_LEFT - RIM_LEFT) * t;
            const rightBound = RIM_RIGHT + (FLOOR_RIGHT - RIM_RIGHT) * t;

            if (
                localY < RIM_Y - 30 ||
                localX < leftBound ||
                localX > rightBound
            )
                return;

            const body = Matter.Bodies.circle(
                localX,
                Math.max(localY, RIM_Y),
                EMOJI_RADIUS,
                {
                    restitution: 0.35,
                    friction: 0.5,
                    frictionAir: 0.008,
                    density: 0.002,
                },
            );
            Matter.World.add(engine.world, body);

            const el = document.createElement("span");
            el.textContent = emoji;
            Object.assign(el.style, {
                position: "absolute",
                left: "0",
                top: "0",
                fontSize: `${EMOJI_RADIUS * 2}px`,
                lineHeight: "1",
                willChange: "transform",
            });
            containerRef.current?.appendChild(el);
            itemsRef.current.push({ id: idCounter.current++, body, el });
        };

        window.addEventListener("emoji-drag-end", handleDrop);
        return () => {
            window.removeEventListener("emoji-drag-end", handleDrop);
            cancelAnimationFrame(raf);
            Matter.Runner.stop(runner);
            Matter.World.clear(engine.world, false);
            Matter.Engine.clear(engine);
            itemsRef.current.forEach((i) => i.el.remove());
            itemsRef.current = [];
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                width: CONTAINER_WIDTH,
                height: CONTAINER_HEIGHT,
                zIndex: 3,
                pointerEvents: "none",
                overflow: "hidden",
            }}
        />
    );
}
