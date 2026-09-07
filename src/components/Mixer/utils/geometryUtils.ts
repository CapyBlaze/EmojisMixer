const ORIGINAL_SVG_WIDTH = 218;
const ORIGINAL_SVG_HEIGHT = 236;

const SVG_PATH_POLYGON = [
    { x: 43.4096, y: 235.697 },
    { x: 12.6028, y: 28.4704 },
    { x: 0, y: 0 },
    { x: 54.1453, y: 2.33364 },
    { x: 163.369, y: 2.33364 },
    { x: 217.515, y: 0 },
    { x: 204.912, y: 28.4704 },
    { x: 204.843, y: 28.9371 },
    { x: 174.105, y: 235.697 },
];

export function getBowlTransform(
    container: HTMLDivElement | null,
    svgBowl: HTMLSpanElement | null,
) {
    if (!container || !svgBowl) return null;

    const containerRect = container.getBoundingClientRect();
    const svgRect = svgBowl.getBoundingClientRect();

    return {
        offsetX: svgRect.left - containerRect.left,
        offsetY: svgRect.top - containerRect.top,
        scaleX: svgRect.width / ORIGINAL_SVG_WIDTH,
        scaleY: svgRect.height / ORIGINAL_SVG_HEIGHT,
    };
}

export function isInsideBowlWithTransform(
    pos: Matter.Vector,
    transform: { offsetX: number; offsetY: number; scaleX: number; scaleY: number } | null,
) {
    if (!transform) return true;

    const { offsetX, offsetY, scaleX, scaleY } = transform;
    const x = pos.x;
    const y = pos.y;
    let inside = false;

    for (let i = 0, j = SVG_PATH_POLYGON.length - 1; i < SVG_PATH_POLYGON.length; j = i++) {
        const xi = SVG_PATH_POLYGON[i].x * scaleX + offsetX;
        const yi = SVG_PATH_POLYGON[i].y * scaleY + offsetY;
        const xj = SVG_PATH_POLYGON[j].x * scaleX + offsetX;
        const yj = SVG_PATH_POLYGON[j].y * scaleY + offsetY;

        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

        if (intersect) inside = !inside;
    }

    return inside;
}
