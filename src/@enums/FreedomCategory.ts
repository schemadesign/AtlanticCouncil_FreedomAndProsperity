export enum FreedomCategory {
    FREE = 'Free',
    MOSTLY_FREE = 'Mostly Free',
    MOSTLY_UNFREE = 'Mostly Unfree',
    UNFREE = 'Unfree',
}

export type FreedomCategoryKeys = keyof typeof FreedomCategory;

export const FreedomCategoryLiterals = (Object.keys(FreedomCategory) as Array<FreedomCategoryKeys>).map((category) => FreedomCategory[category]);