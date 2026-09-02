export default function defaultFile(files: string[]) {
    if (files.length === 1) return files[0];
    return files.find((text) => text.includes("default")) || files[0];
}
