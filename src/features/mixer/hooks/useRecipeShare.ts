import { useEffect } from "react";
import EMOJIS from "../../../configs/emojis.json";
import CONFIG from "../../../configs/config.json";
import type { EmojiData } from "../../../interfaces/emoji";

interface UseRecipeShareParams {
    recipeRef: React.RefObject<string[] | null>;
    isFinishedRef: React.RefObject<boolean>;
    bowlRef: React.RefObject<HTMLCanvasElement | null>;
    spawnEmojis: (emoji: EmojiData, x: number, y: number) => void;
}

export default function useRecipeShare({
    recipeRef,
    isFinishedRef,
    bowlRef,
    spawnEmojis,
}: UseRecipeShareParams) {
    useEffect(() => {
        let cancelled = false;
        let rafId: number;

        const handleShareLink = async () => {
            const currentRecipe = recipeRef.current;
            const pageUrl = window.location.origin + window.location.pathname;

            if (!currentRecipe || currentRecipe.length === 0 || !isFinishedRef.current) {
                await navigator.clipboard.writeText(pageUrl);
                return;
            }

            const indices = currentRecipe
                .map((name) => EMOJIS.findIndex((e) => e.name === name))
                .filter((index) => index !== -1);

            const uint16Array = new Uint16Array(indices.slice(0, 60));
            const blob = new Blob([uint16Array]);

            const compressionStream = blob.stream().pipeThrough(new CompressionStream("deflate"));
            const compressedBuffer = await new Response(compressionStream).arrayBuffer();

            const binaryString = String.fromCharCode(...new Uint8Array(compressedBuffer));
            const url = btoa(binaryString)
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "");

            await navigator.clipboard.writeText(`${pageUrl}?data=${url}`);
        };

        const handleLoadData = async (data: string) => {
            let base64 = data.replace(/-/g, "+").replace(/_/g, "/");
            while (base64.length % 4) base64 += "=";

            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length).map((_, i) =>
                binaryString.charCodeAt(i),
            );

            const decompressionStream = new Blob([bytes])
                .stream()
                .pipeThrough(new DecompressionStream("deflate"));
            const decompressedBuffer = await new Response(decompressionStream).arrayBuffer();

            const uint16Array = new Uint16Array(decompressedBuffer);
            const result = Array.from(uint16Array);

            if (!bowlRef.current) return;
            const bowlElement = bowlRef.current;
            const rect = bowlElement.getBoundingClientRect();

            const overflow = 5;
            const x1 = rect.left - overflow;
            const x2 = rect.right + overflow;
            const centerX = rect.left + rect.width / 2;

            for (let index = 0; index < result.length; index++) {
                setTimeout(() => {
                    spawnEmojis(
                        EMOJIS[result[index] % EMOJIS.length],
                        CONFIG.dropType === "random"
                            ? Math.floor(Math.random() * (x2 - x1 + 1)) + x1
                            : centerX,
                        -70,
                    );
                }, index * CONFIG.waveDelay);
            }
        };

        const handlePrepare = (e: Event) => {
            const { data } = (e as CustomEvent).detail;

            if (!bowlRef.current) return;
            const bowlElement = bowlRef.current;
            const rect = bowlElement.getBoundingClientRect();

            const overflow = 5;
            const x1 = rect.left - overflow;
            const x2 = rect.right + overflow;
            const centerX = rect.left + rect.width / 2;

            for (let index = 0; index < data.length; index++) {
                setTimeout(() => {
                    const targetEmoji = EMOJIS.find((emoji) => emoji.name === data[index]);
                    if (!targetEmoji) return;

                    spawnEmojis(
                        targetEmoji,
                        CONFIG.dropType === "random"
                            ? Math.floor(Math.random() * (x2 - x1 + 1)) + x1
                            : centerX,
                        -70,
                    );
                }, index * CONFIG.waveDelay);
            }
        };

        const waitForBowl = (): Promise<void> =>
            new Promise((resolve) => {
                const check = () => {
                    if (cancelled) return;
                    if (bowlRef.current) {
                        resolve();
                    } else {
                        rafId = requestAnimationFrame(check);
                    }
                };
                check();
            });

        const queryParams = new URLSearchParams(window.location.search);
        const dataValue = queryParams.get("data");

        if (dataValue) {
            waitForBowl().then(() => {
                if (!cancelled) handleLoadData(dataValue);
            });
        }

        window.addEventListener("share-link", handleShareLink);
        window.addEventListener("recipe-prepare", handlePrepare);

        return () => {
            cancelled = true;
            if (rafId) cancelAnimationFrame(rafId);

            window.removeEventListener("share-link", handleShareLink);
            window.removeEventListener("recipe-prepare", handlePrepare);
        };
    }, [spawnEmojis, bowlRef, isFinishedRef, recipeRef]);
}
