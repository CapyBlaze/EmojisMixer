export default function exportImage(canvas: HTMLCanvasElement) {
    if (!canvas) return;
    const originalWidth = canvas.width || canvas.getBoundingClientRect().width;
    const originalHeight = canvas.height || canvas.getBoundingClientRect().height;

    if (originalWidth === 0 || originalHeight === 0) {
        console.error("Invalid canvas: dimensions are zero");
        return;
    }

    const startY = originalHeight * 0.15;
    const croppedHeight = originalHeight * 0.85;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = originalWidth;
    tempCanvas.height = croppedHeight;

    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(
        canvas,
        0,
        startY,
        originalWidth,
        croppedHeight,
        0,
        0,
        originalWidth,
        croppedHeight,
    );

    const text = "Emojis Mixer | CapyBlaze";
    const logoSize = 20;
    const paddingRight = 15;
    const paddingBottom = 15;

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textBaseline = "middle";

    const textWidth = ctx.measureText(text).width;

    const watermarkX = originalWidth - paddingRight - textWidth;
    const watermarkY = croppedHeight - paddingBottom - logoSize / 2;

    ctx.textAlign = "left";
    ctx.fillText(text, watermarkX, watermarkY);

    const imageURL = tempCanvas.toDataURL("image/png");
    const lien = document.createElement("a");
    lien.href = imageURL;
    lien.download = `EmojisMixer-${Date.now()}.png`;
    lien.click();
}
