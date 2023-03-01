import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';
import _, { isArray } from 'lodash';
import { FreedomCategory } from '../@enums/FreedomCategory';
import { FreedomSubIndicator, IndexType, Indicator } from '../@enums/IndexType';
import { ProsperityCategory } from '../@enums/ProsperityCategory';
import f_p_data from './processed/latest_all_countries.csv';
import geojson from './world.geo.json';

export const NESTED_INDICATORS = {
    [IndexType.PROSPERITY]: [
        'Income',
        'Health',
        'Inequality',
        'Environment',
        'Minority Rights',
        'Education',
        'Informality',
    ],
    [IndexType.FREEDOM]: {
        [FreedomSubIndicator.ECONOMIC]: [
            'Womens Economic Freedom',
            'Investment Freedom',
            'Property Rights',
            'Trade Freedom',
        ],
        [FreedomSubIndicator.POLITICAL]: [
            'Elections',
            'Civil_liberties',
            'Political Rights',
            'Legislative_constraints_on_the_executive',
            'Bureaucracy+Corruption',
            'Security',
        ],
        [FreedomSubIndicator.LEGAL]: [
            'Clarity_of_the_law',
            'Judicial_independence_and_effectiveness',
        ],
    }
}

export let FLATTENED_INDICATORS: Array<any> = [];

Object.keys(NESTED_INDICATORS).forEach((topLevel: string) => {
    FLATTENED_INDICATORS.push(
        { 
            key: Indicator[topLevel.toUpperCase() as keyof typeof Indicator], 
            indicator: topLevel, 
            color: `var(--color--chart--${topLevel.toLowerCase()})` 
        }
    )

    const subindicators = NESTED_INDICATORS[topLevel as keyof typeof NESTED_INDICATORS];

    if (isArray(subindicators)) {
        subindicators.map((subindicator: string) => {
            FLATTENED_INDICATORS.push(
                { 
                    key: subindicator, 
                    subindicator: true, 
                    indicator: subindicator,
                    color: `var(--color--chart--${topLevel.toLowerCase()})` 
                }
            )
        })
    } else {
        Object.keys(subindicators).forEach((subindicator: string) => {
            FLATTENED_INDICATORS.push(
                { 
                    key: subindicator, 
                    indicator: subindicator,
                    color: `var(--color--chart--${subindicator.toLowerCase().replaceAll(' ', '-')})` 
                }
            )

            subindicators[subindicator as keyof typeof subindicators].forEach((subsub: string) => {
                FLATTENED_INDICATORS.push(
                    { 
                        key: subsub, 
                        subindicator: true, 
                        indicator: subsub,
                        color: `var(--color--chart--${subindicator.toLowerCase().replaceAll(' ', '-')})` 
                    }
                )
            })
        })
    }
})

FLATTENED_INDICATORS = FLATTENED_INDICATORS.map(d => (
    {
        ...d,
        label: d.indicator.replaceAll('+', ' and ').replaceAll('_', ' ')
    }
))

export const formatData = (data: Array<FPData>): Array<FPData> => {
    return data.map((row: any) => {
        Object.keys(row).forEach((col: string) => {
            if (col !== 'Name' && col !== 'ISO3') {
                row[col] = parseFloat(row[col]) || -1
            }
        })
        row['Prosperity category'] = row['Prosperity score'] < 25 ? ProsperityCategory.UNPROSPEROUS
            : row['Prosperity score'] < 50 ? ProsperityCategory.MOSTLY_UNPROSPEROUS
                : row['Prosperity score'] < 75 ? ProsperityCategory.MOSTLY_PROSPEROUS
                    : ProsperityCategory.PROSPEROUS
        row['Freedom category'] = row['Freedom score'] < 25 ? FreedomCategory.UNFREE
            : row['Freedom score'] < 50 ? FreedomCategory.MOSTLY_UNFREE
                : row['Freedom score'] < 75 ? FreedomCategory.MOSTLY_FREE
                    : FreedomCategory.FREE

        return row;
    })
}
let dataWithRanks = formatData(f_p_data);

export const totalCountries = dataWithRanks.length;

const defaultDirection = (key: string) => {
    if (key === 'Freedom score' ||
        'Prosperity score'
    ) {
        return 1;
    }

    return -1;
}

export const columnNames = {
    'Name': 'Country',
    'Freedom score': 'Freedom Score',
    'Freedom rank': 'Freedom Rank',
    'Freedom category': 'Freedom Status',
    'Prosperity score': 'Prosperity Score',
    'Prosperity rank': 'Prosperity Rank',
    'Prosperity category': 'Prosperity Status',
    'split__Income__ranked-Income': 'Income',
    'split__Environment__ranked-Environment': 'Environment',
    'split__Minority Rights__ranked-Minority Rights': 'Minority Rights',
    'split__Economic Freedom__ranked-Economic Freedom': 'Economic Freedom',
    'split__Political Freedom__ranked-Political Freedom': 'Political Freedom',
    'split__Legal Freedom__ranked-Legal Freedom': 'Legal Freedom',
}

export const getColumns = (mode: IndexType | null) => {
    let columns = [
        'Name'
    ]
    if (mode === IndexType.PROSPERITY) {
        columns = [
            ...columns,
            'Prosperity score',
            'Prosperity rank',
            'Prosperity category',
            'split__Income__ranked-Income',
            'split__Environment__ranked-Environment',
            'split__Minority Rights__ranked-Minority Rights',
        ]
    } else if (mode === IndexType.FREEDOM) {
        columns = [
            ...columns,
            'Freedom score',
            'Freedom rank',
            'Freedom category',
            'split__Economic Freedom__ranked-Economic Freedom',
            'split__Political Freedom__ranked-Political Freedom',
            'split__Legal Freedom__ranked-Legal Freedom',
        ]
    } else {
        columns = [
            ...columns,
            'Freedom score',
            'Freedom rank',
            'Freedom category',
            'Prosperity score',
            'Prosperity rank',
            'Prosperity category'
        ]
    }

    return columns;
}

export const sortedData = (sort: { col: string, direction: number }) => {
    return [...dataWithRanks].sort((a: FPData, b: FPData) => {
        let col = sort.col;
        if (col === 'Prosperity category') {
            col = 'Prosperity score';
        } else if (col === 'Freedom category') {
            col = 'Freedom score';
        }

        if (col === 'Name') {
            return a[col].localeCompare(b[col]) * sort.direction
        }
        const adjust = defaultDirection(col);

        return (b[col] - a[col]) * sort.direction * adjust
    })
}

export const getFreedomCategory = (iso: string): string => {
    try {
        return f_p_data.find((e: FPData) => e.ISO3 === iso)['Freedom category']
    } catch {
        return '';
    }
}

export const getProsperityCategory = (iso: string): string => {
    try {
        return f_p_data.find((e: FPData) => e.ISO3 === iso)['Prosperity category']
    } catch {
        return '';
    }
}

export const getDataByISO = (iso: string) => {
    const data = dataWithRanks.find((d: FPData) => d.ISO3 === iso)

    if (data) {
        return data;
    }

    const mapJson = (geojson as FeatureCollection).features.find((feature: Feature) => _.get(feature, 'properties.adm0_iso') === iso);

    if (mapJson) {
        return {
            Name: _.get(mapJson, 'properties.admin'),
            ISO3: _.get(mapJson, 'properties.adm0_iso'),
        }
    }

    return null;
}

export const getData = (data: FPData, col: string, toFixed = 0): string | number => {
    if (data[col] < 0 || isNaN(data[col])) {
        return '—'
    }

    return formatValue(data[col], toFixed)
}

export const formatValue = (value: number, toFixed = 0): number => {
    if (toFixed > 0) {
        const val = parseFloat(value.toFixed(toFixed));

        return val;
    }

    return value
}

export const getSelectedFlattenedIndicators = (indicators: Array<string>) => {
    return FLATTENED_INDICATORS.filter((type) => {
        return indicators.includes(type.indicator)
    })
}

/*
*   get range of y axis
*/
export const getYDomain = (indicators: Array<string>, data: FPData[]): Array<number> => {
    const scores = getAllApplicableScores(indicators, data)
    let yDomain = data.length > 0 && scores.length > 0 ? d3.extent(scores) as Array<number> : [0, 100]

    try {
        if (yDomain[1] - yDomain[0] < 8) {
            yDomain[1] = Math.min(100, yDomain[1] + 4);
            yDomain[0] = Math.max(0, yDomain[0] - 4)
        }
    } catch {
        yDomain = [0, 100]
    }

    return yDomain;
}

/*
*   scores of all visible lines; used for scaling y axis
*/
const getAllApplicableScores = (indicators: Array<string>, data: FPData[]): Array<number> => {
    let allApplicableScores: Array<number> = [];
    const chartIndicators = getSelectedFlattenedIndicators(indicators);

    chartIndicators.forEach((indicator: { key: string }) => {
        const extent: Array<number | undefined> = d3.extent(data.map(row => row[indicator.key]));

        extent.forEach((val: number | undefined) => {
            if (val && val > -1) {
                allApplicableScores.push(val)
            }
        })
    })

    return allApplicableScores
}