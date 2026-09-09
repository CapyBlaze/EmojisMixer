import { useEffect } from "react";
import EMOJIS from "../../../configs/emojis.json";
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
        const handleShareLink = async () => {
            const currentRecipe = recipeRef.current;
            if (!currentRecipe || currentRecipe.length === 0 || !isFinishedRef.current) {
                await navigator.clipboard.writeText(window.location.href);
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

            await navigator.clipboard.writeText(`${window.location.href}?data=${url}`);
        };

        const handleLoadData = async (e: Event) => {
            const { data } = (e as CustomEvent).detail;

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

            const offset = 5;
            const x = rect.left + rect.width / 2;

            for (let index = 0; index < result.length; index++) {
                setTimeout(() => {
                    spawnEmojis(
                        EMOJIS[result[index] % EMOJIS.length],
                        Math.random() * (x + offset - (x - offset)) + (x - offset),
                        -100,
                    );
                }, index * 75);
            }
        };

        const handlePrepare = (e: Event) => {
            const { data } = (e as CustomEvent).detail;

            if (!bowlRef.current) return;
            const bowlElement = bowlRef.current;
            const rect = bowlElement.getBoundingClientRect();

            const offset = 5;
            const x = rect.left + rect.width / 2;

            for (let index = 0; index < data.length; index++) {
                setTimeout(() => {
                    const targetEmoji = EMOJIS.find((emoji) => emoji.name === data[index]);
                    if (!targetEmoji) return;

                    spawnEmojis(
                        targetEmoji,
                        Math.random() * (x + offset - (x - offset)) + (x - offset),
                        -100,
                    );
                }, index * 75);
            }
        };

        window.addEventListener("share-link", handleShareLink);
        window.addEventListener("load-data", handleLoadData);
        window.addEventListener("recipe-prepare", handlePrepare);

        return () => {
            window.removeEventListener("share-link", handleShareLink);
            window.removeEventListener("load-data", handleLoadData);
            window.removeEventListener("recipe-prepare", handlePrepare);
        };
    }, [spawnEmojis, bowlRef, isFinishedRef, recipeRef]);
}
