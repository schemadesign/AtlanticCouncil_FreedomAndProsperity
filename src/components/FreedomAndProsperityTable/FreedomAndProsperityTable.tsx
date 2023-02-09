
import './_freedom-and-prosperity-table.scss';
import ScoreBar from '../ScoreBar/ScoreBar';
import IconProsperityCategory from '../../assets/icons/IconProsperityCategory';
import IconFreedomCategory from '../../assets/icons/IconFreedomCategory';
import { useState } from 'react';
import Button from '../Button/Button';
import { columnNames,  NO_DATA_VALUE,  sortedData } from '../../data/data-util';
import { ProsperityCategory } from '../../@enums/ProsperityCategory';
import { FreedomCategory } from '../../@enums/FreedomCategory';
import { IndexType } from '../../@enums/IndexType';
import TableCell from '../Table/TableCell';

interface IFreedomAndProsperityTable {
    mode: IndexType | null,
    columns: Array<string>,
    handleSelectCountry: (iso: string) => void,
}

function FreedomAndProsperityTable(props: IFreedomAndProsperityTable) {
    const { mode, columns, handleSelectCountry } = props;
    const [sort, setSort] = useState({ col: columns[0], direction: 1 })
    const [rankOrScoreByColumn, setRankOrScoreByColumn] = useState({
        'split__Income score 2021__ranked-Income': 'score',
        'split__Environment score 2021__ranked-Environment': 'score',
        'split__Minority Rights score 2021__ranked-Minority Rights': 'score',
        'split__Economic Freedom score 2021__ranked-Economic Freedom': 'score',
        'split__Political Freedom score 2021__ranked-Political Freedom': 'score',
        'split__Legal Freedom score 2021__ranked-Legal Freedom': 'score',
    })

    const data = sortedData(sort);

    const getCell = (row: FPData, col: string) => {
        if (col.startsWith('split__')) {
            const split = col.split('__');
            return (
                <TableCell className='split' key={row.Country + col}>
                    <div className='split__content'>
                        {/* @ts-ignore */}
                        <div className={rankOrScoreByColumn[col] === 'score' ? 'split__content--selected' : ''}>
                            {row[split[1]] === 'no data' ? '–' : row[split[1]]}
                        </div>
                         {/* @ts-ignore */}
                        <div className={rankOrScoreByColumn[col] === 'rank' ? 'split__content--selected' : ''}>
                            {row[split[2]] === NO_DATA_VALUE ? '—' : row[split[2]]}
                        </div>
                    </div>
                </TableCell>
            )
        }

        return (
            <TableCell key={row.Country + col}
                className={col === 'Country' ? 'p-0' : ''}
                >
                {col === 'Freedom score 2021' || col === 'Prosperity score 2021' ?
                    <ScoreBar key={row.Country + col}
                        value={parseFloat(row[col])}
                    />
                    :
                    col === 'Prosperity category 2021' ?
                        <IconProsperityCategory category={row[col] as ProsperityCategory} />
                        : col === 'Freedom category 2021' ?
                            <IconFreedomCategory category={row[col] as FreedomCategory} />
                            : col === 'Country' ?
                                <Button onClick={() => handleSelectCountry(row.ISO3)}>
                                    {row[col]}
                                </Button>
                            :
                            row[col]

                }
            </TableCell>
        )
    }

    return (
        <table className="freedom-and-prosperity-table">
            <thead>
                <tr>
                    {columns.map((col: string) => (
                        <th key={col}>
                            {col.startsWith('split') ?
                                <div className='freedom-and-prosperity-table__th--split'>
                                    <div>
                                        <Button key={col}
                                            variant='sort'
                                            onClick={() => {
                                                const cols = col.replace('split__', '').split('__');
                                                let thisCol = cols[0];
                                                if (rankOrScoreByColumn[col] === 'rank') {
                                                    thisCol = cols[1]
                                                } 
                                                console.log(thisCol, data[0])
                                                setSort(prev => ({ col: thisCol, direction: prev.col === thisCol ? prev.direction * -1 : 1 }))
                                            }}>
                                            {/* @ts-expect-error */}
                                            {columnNames[col]}
                                        </Button>
                                    </div>
                                    <div>
                                        {/* @ts-expect-error */}
                                        <Button selected={rankOrScoreByColumn[col] === 'score'}
                                            onClick={() => setRankOrScoreByColumn(prev => ({...prev, [col]: 'score'}))}>
                                            Score
                                        </Button>
                                        &nbsp;&&nbsp;
                                        {/* @ts-expect-error */}
                                        <Button selected={rankOrScoreByColumn[col] === 'rank'}
                                            onClick={() => setRankOrScoreByColumn(prev => ({...prev, [col]: 'rank'}))}>
                                            Rank
                                        </Button>
                                    </div>
                                </div>
                                :
                                <Button key={col}
                                    variant='sort'
                                    onClick={() => {
                                        setSort(prev => ({ col: col, direction: prev.col === col ? prev.direction * -1 : 1 }))
                                    }}>
                                    {/* @ts-expect-error */}
                                    {columnNames[col]}
                                </Button>
                            }
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row: FPData) => (
                    <tr key={row.Country}>
                        {columns.map((col: string) => (
                            getCell(row, col)
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default FreedomAndProsperityTable;