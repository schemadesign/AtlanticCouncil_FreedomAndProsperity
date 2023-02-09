export enum ProsperityCategory {
    PROSPEROUS = 'Prosperous',
    MOSTLY_PROSPEROUS = 'Mostly Prosperous',
    MOSTLY_UNPROSPEROUS = 'Mostly Unprosperous',
    UNPROSPEROUS = 'Unprosperous',
}

export type ProsperityCategoryKeys = keyof typeof ProsperityCategory;

export const ProsperityCategoryLiterals = (Object.keys(ProsperityCategory) as Array<ProsperityCategoryKeys>).map((category) => ProsperityCategory[category]);