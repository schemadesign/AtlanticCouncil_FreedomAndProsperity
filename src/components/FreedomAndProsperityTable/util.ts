import { IndexType } from '../../@enums/IndexType';
// @ts-expect-error
import f_p_data from './../../data/F&P 2021-Table 1.csv';

// derive rankings
let dataWithRanks = f_p_data;
['Income', 'Environment', 'Minority Rights', 'Health', 'Happiness', 'Legal Freedom', 'Political Freedom', 'Economic Freedom'].forEach((category: string) => {
    dataWithRanks = dataWithRanks.sort((a: FPData, b: FPData) => {
        const col = `${category} score 2021`;
        let aVal = a[col];
        let bVal = b[col];

        if (aVal === 'no data') {
            aVal = '-1';
        } else if (bVal === 'no data') {
            bVal = '-1';
        }

        return parseFloat(bVal) - parseFloat(aVal)
    }).map((row: FPData, i: number) => {
        return {
            ...row,
            [`ranked-${category}`]: i + 1,
        }
    })
})

const columns = [
    'Country',
    'Freedom score 2021',
    'Freedom rank 2021',
    'Freedom category 2021',
    'Prosperity score 2021',
    'Prosperity rank 2021',
    'Prosperity category 2021',
    // 'ISO3',
    // 'Region',
    // 'Region (WB 2022)',
    // 'Income group (WB 2022)',
    // 'Freedom category 2021',
    // 'Economic Freedom score 2021',
    // 'Political Freedom score 2021',
    // 'Legal Freedom score 2021',
    // 'Prosperity category 2021',
    // 'Income score 2021',
    // 'Environment score 2021',
    // 'Minority Rights score 2021',
    // 'Health score 2021',
    // 'Happiness score 2021'
]

const defaultDirection: {[key: string]: number} = {
    'Country': 1,
    'Freedom score 2021': -1,
    'Freedom rank 2021': -1,
    'Freedom category 2021': 1,
    'Prosperity score 2021': -1,
    'Prosperity rank 2021': -1,
    'Prosperity category 2021': 1,
}

export const columnNames = {
    'Country': 'Country',
    'Freedom score 2021': 'Freedom Score',
    'Freedom rank 2021': 'Freedom Rank',
    'Freedom category 2021': 'Freedom Status',
    'Prosperity score 2021': 'Prosperity Score',
    'Prosperity rank 2021': 'Prosperity Rank',
    'Prosperity category 2021': 'Prosperity Status',
    'split__Income score 2021__ranked-Income': 'Income',
    'split__Environment score 2021__ranked-Environment': 'Environment',
    'split__Minority Rights score 2021__ranked-Minority Rights': 'Minority Rights',
    'split__Economic Freedom score 2021__ranked-Economic Freedom': 'Economic',
    'split__Political Freedom score 2021__ranked-Political Freedom': 'Political',
    'split__Legal Freedom score 2021__ranked-Legal Freedom': 'Legal',
}

export const getColumns = (mode: IndexType | null) => {
    let columns = [
        'Country'
    ]
    if (mode === IndexType.PROSPERITY) {
        columns = [
            ...columns,
            'Prosperity score 2021',
            'Prosperity rank 2021',
            'Prosperity category 2021',
            'split__Income score 2021__ranked-Income',
            'split__Environment score 2021__ranked-Environment',
            'split__Minority Rights score 2021__ranked-Minority Rights',
        ]
    } else if (mode === IndexType.FREEDOM) {
        columns = [
            ...columns,
            'Freedom score 2021',
            'Freedom rank 2021',
            'Freedom category 2021',
            'split__Economic Freedom score 2021__ranked-Economic Freedom',
            'split__Political Freedom score 2021__ranked-Political Freedom',
            'split__Legal Freedom score 2021__ranked-Legal Freedom',
        ]
    } else {
        columns = [
            ...columns,
            'Freedom score 2021',
            'Freedom rank 2021',
            'Freedom category 2021',
            'Prosperity score 2021',
            'Prosperity rank 2021',
            'Prosperity category 2021'
        ]
    }

    return columns;
}

export const sortedData = (sort: {col: string, direction: number}) => {
    return dataWithRanks.sort((a: FPData, b: FPData) => {
        if (sort.col.indexOf('Freedom') > -1) {
            return (parseFloat(b['Freedom rank 2021']) - parseFloat((a['Freedom rank 2021']))) * sort.direction * defaultDirection[sort.col]
        } else if (sort.col.indexOf('Prosperity') > -1) {
            return (parseFloat(b['Prosperity rank 2021']) - parseFloat((a['Prosperity rank 2021']))) * sort.direction * defaultDirection[sort.col]
        } else if (sort.col.startsWith('split__')) {
            return -1;
        }
        return a[sort.col].localeCompare(b[sort.col]) * sort.direction * defaultDirection[sort.col]
    })
}