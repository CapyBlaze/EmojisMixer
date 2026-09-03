import { useEffect, useRef, type RefObject } from "react";
import Matter from "matter-js";
import defaultFile from "../../utils/defaultFile";
import CONFIG from "../../config/config.json";
import EMOJIS from "../../config/emojis.json";
import type { EmojiData } from "../../interface/emoji";

type FallingEmoji = { id: number; body: Matter.Body; el: HTMLImageElement };

const CONTAINER_WIDTH = 500;
const CONTAINER_HEIGHT = 620;

function createThickWallsFromSVG(pathString: string) {
    const THICKNESS = 4;
    const OFFSET = { x: 90, y: 83 };

    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", pathString);

    const totalLength = pathEl.getTotalLength();
    const step = 6;
    const bodies: Matter.Body[] = [];

    for (let i = 0; i < totalLength; i += step) {
        const p1 = pathEl.getPointAtLength(i);
        const p2 = pathEl.getPointAtLength(Math.min(i + step, totalLength));

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segLength = Math.hypot(dx, dy);

        if (segLength > step * 2.5) continue;

        const angle = Math.atan2(dy, dx);
        const midX = (p1.x + p2.x) / 2 + OFFSET.x;
        const midY = (p1.y + p2.y) / 2 + OFFSET.y;

        const wallSegment = Matter.Bodies.rectangle(midX, midY, segLength + 1, THICKNESS, {
            isStatic: true,
            angle: angle,
            friction: 0.8,
            restitution: 0.15,
        });

        bodies.push(wallSegment);
    }

    return bodies;
}

interface MixerPhysicsProps {
    bowlRef: RefObject<HTMLDivElement | null>;
}

export default function MixerPhysics({ bowlRef }: MixerPhysicsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<FallingEmoji[]>([]);
    const idCounter = useRef(0);

    useEffect(() => {
        const engine = Matter.Engine.create();
        engine.gravity.y = 1.1;

        if (CONFIG.debugMode) {
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
                    wireframeBackground: "transparent",
                    showAngleIndicator: true,
                },
            });
            Matter.Render.run(debugRender);
        }

        const bottleWalls = createThickWallsFromSVG(
            "M90 252.702H78L70 289.202H32L0.5 445.702V493.202H21.5M90 252.702L57 30.7024L43.5 0.202393M90 252.702L128 234.702H192L230 252.702M90 252.702H230M230 252.702H242L250 289.202H288L319.5 445.702V493.202H298.5M230 252.702L263 30.7024L276.5 0.202393M298.5 493.202V506.702H257.5V493.202M298.5 493.202H257.5M257.5 493.202H62.5M21.5 493.202V506.702H62.5V493.202M21.5 493.202H62.5",
        );
        Matter.World.add(engine.world, bottleWalls);

        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        function spawnEmojis(emoji: EmojiData, x: number, y: number) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const localX = x - rect.left;
            const localY = y - rect.top;

            const body = Matter.Bodies.circle(localX, localY, CONFIG.emojiRadius - 2, {
                restitution: 0.35,
                friction: 0.5,
                frictionAir: 0.008,
                density: 0.002,
            });
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
        }

        let raf: number;
        const render = () => {
            for (let i = itemsRef.current.length - 1; i >= 0; i--) {
                const item = itemsRef.current[i];
                const { x, y } = item.body.position;

                if (y > CONTAINER_HEIGHT + 50) {
                    Matter.World.remove(engine.world, item.body);
                    item.el.remove();
                    itemsRef.current.splice(i, 1);
                    continue;
                }

                item.el.style.transform = `translate(${x - CONFIG.emojiRadius}px, ${
                    y - CONFIG.emojiRadius
                }px) rotate(${item.body.angle}rad)`;
            }
            raf = requestAnimationFrame(render);
        };
        raf = requestAnimationFrame(render);

        const handleDrop = (e: Event) => {
            const { emoji, x, y } = (e as CustomEvent).detail;
            spawnEmojis(emoji, x, y);
        };

        const handleCheckPosition = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { x, y, callback } = customEvent.detail;
            const rect = containerRef.current?.getBoundingClientRect();

            if (!rect) {
                callback(true);
                return;
            }

            const localX = x - rect.left;
            const localY = y - rect.top;

            const testBody = Matter.Bodies.circle(localX, localY, CONFIG.emojiRadius + 2);
            const collisions = Matter.Query.collides(testBody, bottleWalls);

            callback(collisions.length === 0);
        };

        const handleDropSpawn = () => {
            const NB_EMOJIS = 5;

            if (!bowlRef.current) return;
            const bowlElement = bowlRef.current;
            const rect = bowlElement.getBoundingClientRect();

            const MARGIN = 10;
            const x1 = rect.left + CONFIG.emojiRadius + MARGIN;
            const x2 = rect.right - CONFIG.emojiRadius - MARGIN;

            for (let i = 0; i < NB_EMOJIS; i++) {
                spawnEmojis(
                    EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
                    Math.floor(Math.random() * (x2 - x1 + 1)) + x1,
                    100,
                );
            }
        };

        const handleTrash = () => {
            itemsRef.current.forEach((item) => {
                Matter.World.remove(engine.world, item.body);
                item.el.remove();
            });
            itemsRef.current = [];
        };

        window.addEventListener("emoji-drag-end", handleDrop);
        window.addEventListener("emoji-drag-check", handleCheckPosition);
        window.addEventListener("emoji-random-spawn", handleDropSpawn);
        window.addEventListener("emoji-trash", handleTrash);

        return () => {
            window.removeEventListener("emoji-drag-end", handleDrop);
            window.removeEventListener("emoji-drag-check", handleCheckPosition);
            window.removeEventListener("emoji-random-spawn", handleDropSpawn);
            window.removeEventListener("emoji-trash", handleTrash);

            cancelAnimationFrame(raf);
            Matter.Runner.stop(runner);
            Matter.World.clear(engine.world, false);
            Matter.Engine.clear(engine);
            itemsRef.current.forEach((i) => i.el.remove());
            itemsRef.current = [];
        };
    }, [bowlRef]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                inset: 0,
                width: CONTAINER_WIDTH,
                height: CONTAINER_HEIGHT,
                zIndex: 2,
                pointerEvents: "none",
                overflow: "visible",
            }}
        />
    );
}
