import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.join(__dirname, "../src/configs/emojis.json");
const IMAGES_DIR = path.join(__dirname, "../public/emojis");

const COUNT_COLORS = 5;
const ALPHA_THRESHOLD = 128;
const BIN_SIZE = 16;
const KMEANS_MAX_ITERATIONS = 15;

function redmeanDistance(c1, c2) {
    const rMean = (c1.r + c2.r) / 2;
    const dr = c1.r - c2.r;
    const dg = c1.g - c2.g;
    const db = c1.b - c2.b;
    return Math.sqrt(
        (2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db,
    );
}

async function extractColorHistogram(imagePath) {
    const { data, info } = await sharp(imagePath)
        .resize(64, 64, { fit: "inside" })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    const colorMap = new Map();

    for (let i = 0; i < data.length; i += channels) {
        const a = data[i + 3];
        if (a < ALPHA_THRESHOLD) continue;

        const r = Math.min(255, Math.round(data[i] / BIN_SIZE) * BIN_SIZE);
        const g = Math.min(255, Math.round(data[i + 1] / BIN_SIZE) * BIN_SIZE);
        const b = Math.min(255, Math.round(data[i + 2] / BIN_SIZE) * BIN_SIZE);

        const key = `${r},${g},${b}`;
        const existing = colorMap.get(key);
        if (existing) {
            existing.count += 1;
        } else {
            colorMap.set(key, { r, g, b, count: 1 });
        }
    }

    return [...colorMap.values()];
}

function kMeansPlusPlusInit(points, k) {
    const centroids = [];
    const totalWeight = points.reduce((sum, p) => sum + p.count, 0);

    let r = Math.random() * totalWeight;
    for (const p of points) {
        r -= p.count;
        if (r <= 0) {
            centroids.push({ r: p.r, g: p.g, b: p.b });
            break;
        }
    }

    while (centroids.length < k && centroids.length < points.length) {
        const distances = points.map((p) => {
            const minDist = Math.min(...centroids.map((c) => redmeanDistance(p, c)));
            return minDist * minDist * p.count;
        });
        const sum = distances.reduce((a, b) => a + b, 0);

        if (sum === 0) {
            const remaining = points.find(
                (p) => !centroids.some((c) => c.r === p.r && c.g === p.g && c.b === p.b),
            );
            if (!remaining) break;
            centroids.push({ r: remaining.r, g: remaining.g, b: remaining.b });
            continue;
        }

        let rr = Math.random() * sum;
        for (let i = 0; i < points.length; i++) {
            rr -= distances[i];
            if (rr <= 0) {
                centroids.push({ r: points[i].r, g: points[i].g, b: points[i].b });
                break;
            }
        }
    }

    return centroids;
}

function kMeansColors(points, k, maxIterations = KMEANS_MAX_ITERATIONS) {
    if (points.length === 0) return [];
    if (points.length <= k) {
        return points
            .map((p) => ({ r: p.r, g: p.g, b: p.b, weight: p.count }))
            .sort((a, b) => b.weight - a.weight);
    }

    let centroids = kMeansPlusPlusInit(points, k);

    for (let iter = 0; iter < maxIterations; iter++) {
        const clusters = centroids.map(() => ({ sumR: 0, sumG: 0, sumB: 0, weight: 0 }));

        for (const p of points) {
            let bestIdx = 0;
            let bestDist = Infinity;
            for (let i = 0; i < centroids.length; i++) {
                const d = redmeanDistance(p, centroids[i]);
                if (d < bestDist) {
                    bestDist = d;
                    bestIdx = i;
                }
            }
            const cl = clusters[bestIdx];
            cl.sumR += p.r * p.count;
            cl.sumG += p.g * p.count;
            cl.sumB += p.b * p.count;
            cl.weight += p.count;
        }

        let changed = false;
        centroids = clusters.map((cl, i) => {
            if (cl.weight === 0) return centroids[i];
            const nc = {
                r: Math.round(cl.sumR / cl.weight),
                g: Math.round(cl.sumG / cl.weight),
                b: Math.round(cl.sumB / cl.weight),
            };
            if (nc.r !== centroids[i].r || nc.g !== centroids[i].g || nc.b !== centroids[i].b) {
                changed = true;
            }
            return nc;
        });

        if (!changed) break;
    }

    const weights = new Array(centroids.length).fill(0);
    for (const p of points) {
        let bestIdx = 0;
        let bestDist = Infinity;
        for (let i = 0; i < centroids.length; i++) {
            const d = redmeanDistance(p, centroids[i]);
            if (d < bestDist) {
                bestDist = d;
                bestIdx = i;
            }
        }
        weights[bestIdx] += p.count;
    }

    return centroids
        .map((c, i) => ({ ...c, weight: weights[i] }))
        .filter((c) => c.weight > 0)
        .sort((a, b) => b.weight - a.weight);
}

function toHex({ r, g, b }) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

async function getDominantColors(imagePath, count) {
    try {
        const histogram = await extractColorHistogram(imagePath);
        if (histogram.length === 0) return [];

        const clusters = kMeansColors(histogram, count);
        return clusters.map(toHex);
    } catch (error) {
        console.error(`Error while processing ${imagePath}:`, error.message);
        return [];
    }
}

async function processEmojiData() {
    try {
        const rawData = await fs.readFile(JSON_PATH, "utf8");
        const items = JSON.parse(rawData);

        for (const item of items) {
            const files = item.files || [];
            if (files.length === 0) continue;

            const selectedFile =
                files.length === 1
                    ? files[0]
                    : files.find((text) => text.includes("default")) || files[0];

            const imagePath = path.join(IMAGES_DIR, selectedFile);

            const colors = await getDominantColors(imagePath, COUNT_COLORS);
            item.colors = colors;
        }

        await fs.writeFile(JSON_PATH, JSON.stringify(items, null, 4), "utf8");
        console.log("Colors in the JSON were successfully updated");
    } catch (error) {
        console.error("Global error:", error);
    }
}

processEmojiData();
