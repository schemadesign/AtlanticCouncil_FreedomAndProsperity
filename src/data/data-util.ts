import { Feature, FeatureCollection } from 'geojson';
import _ from 'lodash';
import { FreedomCategory } from '../@enums/FreedomCategory';
import { FreedomSubIndicator, IndexType } from '../@enums/IndexType';
import { ProsperityCategory } from '../@enums/ProsperityCategory';
import f_p_data from './processed/all-2022.csv';
import geojson from './world.geo.json';

export const INDICATORS =  {
    [IndexType.PROSPERITY]: [
        'Income', 
        'Health', 
        'Inequality', 
        'Environment', 
        'Minority Rights', 
        'Education', 
        'Productivity', 
        'Crime', 
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
            'Civil Liberties', 
            'Political Rights', 
            'Legislative Constraints on the Executive', 
            'Bureaucracy', 
            'Corruption', 
            'Security', 
        ],
        [FreedomSubIndicator.LEGAL]: [
            'Clarity of the Law', 
            'Judicial Independence and Effectiveness', 
        ],
    }
}
// derive rankings
let dataWithRanks = f_p_data.map((row: any) => {
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
});
// ['Womens Economic Freedom','Investment Freedom','Property Rights','Trade Freedom','Economic Freedom','Elections','Civil Liberties','Political Rights','Legislative Constraints on the Executive','Political Freedom','Bureaucracy','Corruption','Security','Clarity of the Law','Judicial Independence and Effectiveness','Legal Freedom','Freedom score','Freedom rank','Income','Health','Inequality','Environment','Minority Rights','Education','Productivity','Crime','Prosperity','Prosperity rank'].forEach((col: string) => {
//     dataWithRanks = [...dataWithRanks].sort((a: FPData, b: FPData) => {
//         let aVal = a[col] as string;
//         let bVal = b[col] as string;

//         if (aVal === 'no data') {
//             aVal = '-1';
//         } else if (bVal === 'no data') {
//             bVal = '-1';
//         }

//         return parseFloat(bVal) - parseFloat(aVal)
//     }).map((row: FPData, i: number) => {
//         const rank = parseFloat(row[col] as string)
//         return {
//             ...row,
//             [`ranked-${col}`]: isNaN(rank) ? NO_DATA_VALUE : i + 1,
//         }
//     })
// })

console.log(dataWithRanks)

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

export const sortedData = (sort: {col: string, direction: number}) => {
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
            Country: _.get(mapJson, 'properties.admin'),
            ISO3: _.get(mapJson, 'properties.adm0_iso'),
        }
    }
    
    return null;
}