import CONFIG from "../configs/config.json";

export function getFavoritesFromStorage() {
    const getSerializedValue = localStorage.getItem(CONFIG.favoritesStorageKey);
    if (!getSerializedValue) return [];

    return JSON.parse(getSerializedValue) as string[][];
}

export function setFavoritesToStorage(favorites: string[][]) {
    localStorage.setItem(CONFIG.favoritesStorageKey, JSON.stringify(favorites));
}
