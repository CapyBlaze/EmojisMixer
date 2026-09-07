const FAVORITES_STORAGE_KEY = "emojis-mixer-favorite";

export function getFavoritesFromStorage() {
    const getSerializedValue = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!getSerializedValue) return [];

    return JSON.parse(getSerializedValue) as string[][];
}

export function setFavoritesToStorage(favorites: string[][]) {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}
