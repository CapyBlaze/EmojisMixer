import { useEffect, useRef } from "react";
import Matter from "matter-js";
import defaultFile from "../../utils/defaultFile";
import CONFIG from "../../config/config.json";

type FallingEmoji = { id: number; body: Matter.Body; el: HTMLSpanElement };

const CONTAINER_WIDTH = 500;
const CONTAINER_HEIGHT = 620;

const WALL1_Y = 103;
const WALL1_LEFT = 147;
const WALL1_RIGHT = 344;

const WALL2_Y = 73;
const WALL2_LEFT = 132.5;
const WALL2_RIGHT = 367.5;

const WALL3_Y = 319;
const WALL3_LEFT = 219;
const WALL3_RIGHT = 281;

const FLOOR1_Y = 335;
const FLOOR1_LEFT = 179.5;
const FLOOR1_RIGHT = 311.5;

const FLOOR2_Y = 317;
const FLOOR2_LEFT = 219;
const FLOOR2_RIGHT = 281;

const DEBUG_MODE = false;

function makeWall(x1: number, y1: number, x2: number, y2: number, thickness: number = 4) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    return Matter.Bodies.rectangle((x1 + x2) / 2, (y1 + y2) / 2, length, thickness, {
        isStatic: true,
        angle: angle,
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

        const leftWall1 = makeWall(WALL1_LEFT, WALL1_Y, FLOOR1_LEFT, FLOOR1_Y);
        const rightWall1 = makeWall(WALL1_RIGHT, WALL1_Y, FLOOR1_RIGHT, FLOOR1_Y);

        const leftWall2 = makeWall(WALL2_LEFT, WALL2_Y, WALL1_LEFT, WALL1_Y);
        const rightWall2 = makeWall(WALL2_RIGHT, WALL2_Y, WALL1_RIGHT, WALL1_Y);

        const leftWall3 = makeWall(WALL3_LEFT, WALL3_Y, FLOOR1_LEFT, FLOOR1_Y + 3);
        const rightWall3 = makeWall(WALL3_RIGHT, WALL3_Y, FLOOR1_RIGHT, FLOOR1_Y + 3);

        const floor1 = Matter.Bodies.rectangle(
            (FLOOR1_LEFT + FLOOR1_RIGHT) / 2,
            FLOOR1_Y + 5,
            FLOOR1_RIGHT - FLOOR1_LEFT,
            10,
            { isStatic: true, friction: 0.9, restitution: 0.1 },
        );

        const floor2 = Matter.Bodies.rectangle(
            (FLOOR2_LEFT + FLOOR2_RIGHT) / 2,
            FLOOR2_Y + 5,
            FLOOR2_RIGHT - FLOOR2_LEFT,
            10,
            { isStatic: true, friction: 0.9, restitution: 0.1 },
        );

        Matter.World.add(engine.world, [
            leftWall1,
            rightWall1,
            leftWall2,
            rightWall2,
            leftWall3,
            rightWall3,
            floor1,
            floor2,
        ]);

        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        let raf: number;
        const render = () => {
            for (const item of itemsRef.current) {
                const { x, y } = item.body.position;
                item.el.style.transform = `translate(${x - CONFIG.emojiRadius}px, ${y - CONFIG.emojiRadius}px) rotate(${item.body.angle}rad)`;
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

            const t = Math.max(0, Math.min(1, (localY - WALL1_Y) / (FLOOR1_Y - WALL1_Y)));
            const leftBound = WALL1_LEFT + (FLOOR1_LEFT - WALL1_LEFT) * t;
            const rightBound = WALL1_RIGHT + (FLOOR1_RIGHT - WALL1_RIGHT) * t;

            if (localY < WALL1_Y - 30 || localX < leftBound || localX > rightBound) return;

            const body = Matter.Bodies.circle(
                localX,
                Math.max(localY, WALL1_Y),
                CONFIG.emojiRadius - 2,
                {
                    restitution: 0.35,
                    friction: 0.5,
                    frictionAir: 0.008,
                    density: 0.002,
                },
            );
            Matter.World.add(engine.world, body);

            const el = document.createElement("img");
            el.src = `./emojis/${defaultFile(emoji.files)}`;
            Object.assign(el.style, {
                position: "absolute",
                left: "0",
                top: "0",
                width: `${CONFIG.emojiRadius * 2}px`,
                height: `${CONFIG.emojiRadius * 2}px`,
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
                zIndex: 0,
                pointerEvents: "none",
                overflow: "hidden",
            }}
        />
    );
}
