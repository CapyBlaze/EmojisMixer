import Matter from "matter-js";

function parseSVGPath(d: string) {
    const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
    const subpaths: { x: number; y: number }[][] = [];
    let current: { x: number; y: number }[] = [];
    let cx = 0,
        cy = 0;

    for (const cmd of commands) {
        const type = cmd[0];
        const args = cmd
            .slice(1)
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number);

        switch (type) {
            case "M":
                if (current.length > 1) subpaths.push(current);
                cx = args[0];
                cy = args[1];
                current = [{ x: cx, y: cy }];
                break;
            case "L":
                cx = args[0];
                cy = args[1];
                current.push({ x: cx, y: cy });
                break;
            case "H":
                cx = args[0];
                current.push({ x: cx, y: cy });
                break;
            case "V":
                cy = args[0];
                current.push({ x: cx, y: cy });
                break;
        }
    }
    if (current.length > 1) subpaths.push(current);
    return subpaths;
}

export function createThickWallsFromSVG(
    pathString: string,
    thickness: number,
    offset: { x: number; y: number },
) {
    const bodies: Matter.Body[] = [];

    const subpaths = parseSVGPath(pathString);

    for (const points of subpaths) {
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const segLength = Math.hypot(dx, dy);
            if (segLength < 0.5) continue;

            const angle = Math.atan2(dy, dx);
            const midX = (p1.x + p2.x) / 2 + offset.x;
            const midY = (p1.y + p2.y) / 2 + offset.y;

            bodies.push(
                Matter.Bodies.rectangle(midX, midY, segLength, thickness, {
                    isStatic: true,
                    angle,
                    friction: 0.8,
                    restitution: 0.15,
                }),
            );

            bodies.push(
                Matter.Bodies.circle(p1.x + offset.x, p1.y + offset.y, thickness / 2, {
                    isStatic: true,
                    friction: 0.8,
                    restitution: 0.15,
                }),
            );
        }
    }

    return bodies;
}
