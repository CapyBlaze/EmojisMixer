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

    const mixerWalls = createThickWallsFromSVG(
        "M277.865 0.404297L278.779 0.808594L265.292 31.3066L265.237 31.6768L232.379 252.929H244.062L244.234 253.715L252.087 289.577H290.22L290.382 290.38L321.98 447.515L322 447.612V495.404H320V447.812L288.582 291.577H250.478L250.306 290.791L242.452 254.929H79.5479L71.6943 290.791L71.5225 291.577H33.418L2 447.812V495.404H0V447.612L0.0195312 447.515L31.6182 290.38L31.7803 289.577H69.9131L77.7656 253.715L77.9385 252.929H89.6211L56.707 31.3066L43.2207 0.808594L44.1348 0.404297L45.0498 0L58.5918 30.624L58.6465 30.7471L58.666 30.8809L91.5713 252.447L128.472 234.952L128.675 234.855H193.325L193.528 234.952L230.428 252.447L263.259 31.3828L263.334 30.8809L263.354 30.7471L263.408 30.624L276.95 0L277.865 0.404297Z",
        4,
        { x: 90, y: 84 },
    );
    Matter.World.add(engine.world, mixerWalls);

    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    mixerWalls.forEach((wall) => {
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
        mixerWalls,
        bowlBounds: { minX, minY, maxX, maxY },
    };
}
