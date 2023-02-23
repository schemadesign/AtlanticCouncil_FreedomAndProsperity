type FPData = {
    'Name': string,
    'ISO3': string,
    // 'Region': string,
    // 'Region (WB 2022)': string,
    // 'Income group (WB 2022)': string,
    'Freedom rank': number,
    'Freedom category': string,
    'Freedom score': number,
    'Economic Freedom': number,
    'Political Freedom': number,
    'Legal Freedom': number,
    'Prosperity rank': number,
    'Prosperity category': string,
    'Prosperity score': number,
    'Income': number,
    'Environment': number,
    'Minority Rights ': number,
    'Health': number,
    'Happiness': number
    // allow dynamic indexing
    [key: string]: number,
}