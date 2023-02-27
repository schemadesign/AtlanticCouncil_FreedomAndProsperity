import _, { isArray } from 'lodash';
import { FreedomSubIndicator, IndexType } from "../../../@enums/IndexType";
import { totalCountries, columnNames, INDICATORS, getData } from "../../../data/data-util";
import Accordion from "../../../components/Accordion/Accordion";
import Category from "../../../components/Category/Category";
import ScoreBar from "../../../components/ScoreBar/ScoreBar";

import './_country-overview.scss';

interface ICountryOverview {
    type: IndexType.FREEDOM | IndexType.PROSPERITY,
    data: FPData,
    filters: Array<string>,
}

function CountryOverview(props: ICountryOverview) {
    const { type, data, filters } = props;

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
                            {getData(data, subindictor + ' rank', 1)}
                        </h3>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='panel__country-overview'>
            <div className="panel__country-overview__values flex-row justify-space-between">
                <div>
                    <h6>
                        Score
                    </h6>
                    <h3>
                        {getData(data, `${type} score`, 1)}
                    </h3>
                </div>
                <div className='column--rank'>
                    <h6>
                        Rank
                    </h6>
                    <h3 className='tooltip__rank__value'>
                        {getData(data, `${type} rank`)}
                        <sup>/{totalCountries}</sup>
                    </h3>
                </div>
            </div>
            <Category type={type}
                category={_.get(data, `${type} category`) as string} />
            {isArray(indicators) ?
                indicators.map((subindictor: string) => {
                    if (filters.length === 0 || filters.includes(subindictor)) {
                        return (
                            <div key={subindictor}>
                                {subindictorNode(subindictor)}
                            </div>
                        )
                    }
                    return null;
                })
                :
                Object.keys(indicators).map((subindictor: string) => {
                    if (filters.length === 0 || filters.includes(subindictor)) {
                        return (
                            <Accordion key={subindictor}
                                header={subindictorNode(subindictor)}
                                content={
                                    indicators[subindictor as FreedomSubIndicator].map((d: string) => (
                                        subindictorNode(d)
                                    ))}
                            />
                        )
                    }
                    return null
                })
            }
        </div>
    );
}

export default CountryOverview;