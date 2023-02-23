import _, { isArray } from 'lodash';
import { FreedomSubIndicator, IndexType } from "../../../@enums/IndexType";
import { totalCountries, columnNames, INDICATORS } from "../../../data/data-util";
import Accordion from "../../Accordion/Accordion";
import Category from "../../Category/Category";
import ScoreBar from "../../ScoreBar/ScoreBar";

import './_country-overview.scss';

interface ICountryOverview {
    type: IndexType.FREEDOM | IndexType.PROSPERITY,
    data: FPData,
}

function CountryOverview(props: ICountryOverview) {
    const { type, data } = props;

    const indicators = INDICATORS[type]

    const subindictorNode = (subindictor: string) => {
        return (
            <div className='panel__country-overview__subindicator' key={subindictor}>
                <h6>{subindictor}</h6>
                <div className='flex-row justify-space-between'>
                    <div className={''}>
                        <ScoreBar value={data[subindictor]} />
                    </div>
                    <div className={'column--rank'}>
                        <h3 className="h3--light">
                            {isNaN(data[subindictor + ' rank']) ? '—' : data[subindictor + ' rank'].toFixed(1)}
                        </h3>
                    </div>
                </div>
            </div>
        )
    }

    console.log(data, indicators)

    return (
        <div className='panel__country-overview'>
            <div className="panel__country-overview__values flex-row justify-space-between">
                <div>
                    <h6>
                        Score
                    </h6>
                    <h3>
                        {data[`${type} score`].toFixed(1)}
                    </h3>
                </div>
                <div className='column--rank'>
                    <h6>
                        Rank
                    </h6>
                    <h3 className='tooltip__rank__value'>
                        {data[`${type} rank`]}
                        <sup>/{totalCountries}</sup>
                    </h3>
                </div>
            </div>
            <Category type={type}
                category={_.get(data, `${type} category`) as string} />
            {isArray(indicators) ?
                indicators.map((subindictor: string) => {
                    return (
                        <div key={subindictor}>
                            {subindictorNode(subindictor)}
                        </div>
                    )
                })
                :
                Object.keys(indicators).map((subindictor: string) => {
                    return (
                        <Accordion key={subindictor}    
                            header={subindictorNode(subindictor)}
                            content={
                                indicators[subindictor as FreedomSubIndicator].map((d: string) => (
                                    subindictorNode(d)
                                ))}
                            />
                    )
                })
            }
        </div>
    );
}

export default CountryOverview;