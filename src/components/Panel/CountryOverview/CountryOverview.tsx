import { useRef } from "react";
import { IndexType } from "../../../@enums/IndexType";
import { totalCountries, getColumns, columnNames, NO_DATA_VALUE } from "../../../data/data-util";
import Accordion from "../../Accordion/Accordion";
import Category from "../../Category/Category";
import ScoreBar from "../../ScoreBar/ScoreBar";

import './_country-overview.scss';

interface ICountryOverview {
    type: IndexType,
    data: FPData,
}

function CountryOverview(props: ICountryOverview) {
    const { type, data } = props;

    const subindictors = getColumns(type).filter((col: string) => col.startsWith('split'))

    const subindictorsNodes = subindictors.map((indicator: string) => (
        <div key={indicator}>
            <h6>{columnNames[indicator]}</h6>
            <div className='flex-row justify-space-between'>
                {indicator.replace('split__', '').split('__').map((col: string) => (
                    <div key={col}
                        className={col.includes('ranked') ? 'column--rank' : ''}>
                        {col.includes('score') ?
                            <ScoreBar value={parseFloat(data[col])} />
                            :
                            <h3 className="h3--light">
                                {data[col] === NO_DATA_VALUE ? '—' : data[col]}
                            </h3>
                        }
                    </div>
                ))}
            </div>
        </div>
    ))
    
    return (     
        <div className='panel__country-overview'>
            <Category type={type}
                category={data[`${type} category 2021`]} />
            <div className="panel__country-overview__values flex-row justify-space-between">
                <div>
                    <h6>
                        Score
                    </h6>
                    <h3>
                        {data[`${type} score 2021`]}
                    </h3>
                </div>
                <div className='column--rank'>
                    <h6>
                        Rank
                    </h6>
                    <h3 className='tooltip__rank__value'>
                        {data[`${type} rank 2021`]}
                        <sup>/{totalCountries}</sup>
                    </h3>
                </div>
            </div>
            {type === IndexType.FREEDOM ?
                <Accordion>
                    {subindictorsNodes}
                </Accordion>
                :
                subindictorsNodes
            }
        </div>
    );
}

export default CountryOverview;