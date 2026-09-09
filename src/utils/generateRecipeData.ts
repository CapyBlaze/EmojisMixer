import EMOJIS from "../configs/emojis.json";
import RECIPE_TEXT from "../configs/recipeText.json";

interface RecipeResult {
    name: string;
    description: string;
    emojis: string[];
}

function generateSeed(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash += input.charCodeAt(i);
        hash += hash << 10;
        hash ^= hash >> 6;
    }
    hash += hash << 3;
    hash ^= hash >> 11;
    hash += hash << 15;
    return Math.abs(hash);
}

function pick<T>(arr: T[], base: string, salt: string): T {
    const index = generateSeed(`${base}::${salt}`) % arr.length;
    return arr[index];
}

function chance(base: string, salt: string, probabilityPercent: number): boolean {
    return generateSeed(`${base}::${salt}`) % 100 < probabilityPercent;
}

function fillTemplate(template: string, vars: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return key in vars ? String(vars[key]) : match;
    });
}

export function generateRecipeData(emojis: string[]): RecipeResult {
    const sortedNames = [...emojis].map((name) => name.toLowerCase().trim()).sort();
    const base = sortedNames.join(",");

    const categories: string[] = [];
    sortedNames.forEach((name) => {
        const meta = EMOJIS.find((e) => e.name === name);
        if (meta?.category) categories.push(meta.category);
    });

    const categoryCounts = categories.reduce(
        (acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    const dominantCategory =
        Object.keys(categoryCounts).reduce(
            (a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b),
            "",
        ) || "Mystic";

    const count = sortedNames.length;
    const primaryIngredient = sortedNames[0];
    const secondaryIngredient = sortedNames[sortedNames.length - 1];

    const vars = {
        adj: pick(RECIPE_TEXT.adjectives, base, "adj"),
        type: pick(RECIPE_TEXT.drinkTypes, base, "type"),
        rarity: pick(RECIPE_TEXT.rarities, base, "rarity"),
        texture: pick(RECIPE_TEXT.textures, base, "texture"),
        effect: pick(RECIPE_TEXT.effects, base, "effect"),
        category: dominantCategory,
        primary: primaryIngredient,
        secondary: secondaryIngredient,
        count,
    };

    const nameTemplate = pick(RECIPE_TEXT.nameTemplates, base, "nameTemplate");
    const name = fillTemplate(nameTemplate, vars);

    const opener = fillTemplate(pick(RECIPE_TEXT.descOpeners, base, "opener"), vars);
    const middle = fillTemplate(pick(RECIPE_TEXT.descMiddles, base, "middle"), vars);
    const closer = fillTemplate(pick(RECIPE_TEXT.descClosers, base, "closer"), vars);

    const parts = [opener, middle, closer];

    if (chance(base, "bonus", 40)) {
        parts.push(pick(RECIPE_TEXT.bonusLines, base, "bonusLine"));
    }

    const description = parts.join(" ");

    return { name, description, emojis };
}
