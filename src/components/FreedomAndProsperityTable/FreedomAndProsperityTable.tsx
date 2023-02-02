
import './_freedom-and-prosperity-table.scss';
import ScoreBar from '../ScoreBar/ScoreBar';
import IconProsperityCategory from '../../assets/icons/icon-prosperity-category';
import IconFreedomCategory from '../../assets/icons/icon-freedom-category';
import { useState } from 'react';
import Button from '../Button/Button';
import { columnNames, getColumns, sortedData } from './util';
import { ProsperityCategory } from '../../@enums/ProsperityCategory';
import { FreedomCategory } from '../../@enums/FreedomCategory';
import { IndexType } from '../../@enums/IndexType';
import TableCell from '../Table/TableCell';

interface IFreedomAndProsperityTable {
    mode: IndexType | null,
}

function FreedomAndProsperityTable(props: IFreedomAndProsperityTable) {
    const { mode } = props;
    const columns = getColumns(mode);
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
                            {row[split[1]]}
                        </div>
                         {/* @ts-ignore */}
                        <div className={rankOrScoreByColumn[col] === 'rank' ? 'split__content--selected' : ''}>
                            {row[split[2]]}
                        </div>
                    </div>
                </TableCell>
            )
        }

        return (
            <TableCell key={row.Country + col}>
                {col === 'Freedom score 2021' || col === 'Prosperity score 2021' ?
                    <ScoreBar value={parseFloat(row[col])}
                    />
                    :
                    col === 'Prosperity category 2021' ?
                        <div>
                            <span>
                                {row[col]}
                            </span>
                            <IconProsperityCategory category={row[col] as ProsperityCategory} />
                        </div>
                        : col === 'Freedom category 2021' ?
                            <div>
                                <span>
                                    {row[col]}
                                </span>
                                <IconFreedomCategory category={row[col] as FreedomCategory} />
                            </div>
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
                                        {/* @ts-expect-error */}
                                        {columnNames[col]}
                                    </div>
                                    <div>
                                        <Button selected={rankOrScoreByColumn[col] === 'score'}
                                            onClick={() => setRankOrScoreByColumn(prev => ({...prev, [col]: 'score'}))}>
                                            Score
                                        </Button>
                                        &nbsp;&&nbsp;
                                        <Button selected={rankOrScoreByColumn[col] === 'rank'}
                                            onClick={() => setRankOrScoreByColumn(prev => ({...prev, [col]: 'rank'}))}>
                                            Rank
                                        </Button>
                                    </div>
                                </div>
                                :
                                <Button key={col}
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