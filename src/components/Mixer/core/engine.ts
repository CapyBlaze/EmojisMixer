import Matter from "matter-js";
import CONFIG from "../../../config/config.json";
import createThickWallsFromSVG from "../../../utils/thickWallsFromSVG";

export function setupEngine(container: HTMLDivElement) {
    const engine = Matter.Engine.create({
        enableSleeping: false,
        positionIterations: 12,
        velocityIterations: 12,
    });
    engine.gravity.y = 1.1;

    if (CONFIG.debugMode) {
        const debugCanvas = document.createElement("canvas");
        debugCanvas.width = container.clientWidth;
        debugCanvas.height = container.clientHeight;
        Object.assign(debugCanvas.style, {
            position: "absolute",
            inset: "0",
            zIndex: "10",
            pointerEvents: "none",
        });
        container.appendChild(debugCanvas);

        const debugRender = Matter.Render.create({
            canvas: debugCanvas,
            engine,
            options: {
                width: container.clientWidth,
                height: container.clientHeight,
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
        4,
        { x: 90, y: 83 },
    );
    Matter.World.add(engine.world, bottleWalls);

    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    bottleWalls.forEach((wall) => {
        minX = Math.min(minX, wall.bounds.min.x);
        minY = Math.min(minY, wall.bounds.min.y);
        maxX = Math.max(maxX, wall.bounds.max.x);
        maxY = Math.max(maxY, wall.bounds.max.y);
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return {
        engine,
        runner,
        bottleWalls,
        bowlBounds: { minX, minY, maxX, maxY },
    };
}
