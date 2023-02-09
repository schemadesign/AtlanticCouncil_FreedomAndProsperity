type FPData = {
    'Country': string,
    'ISO3': string,
    'Region': string,
    'Region (WB 2022)': string,
    'Income group (WB 2022)': string,
    'Freedom rank 2021': string,
    'Freedom category 2021': string,
    'Freedom score 2021': string,
    'Economic Freedom score 2021': string,
    'Political Freedom score 2021': string,
    'Legal Freedom score 2021': string,
    'Prosperity rank 2021': string,
    'Prosperity category 2021': string,
    'Prosperity score 2021': string,
    'Income score 2021': string,
    'Environment score 2021': string,
    'Minority Rights  score 2021': string,
    'Health score 2021': string,
    'Happiness score 2021': string
    // allow dynamic indexing
    [key: string]: string |  number,
}