import _, { isArray } from 'lodash';
import { FreedomSubIndicator, IndexType } from "../../../@enums/IndexType";
import { NESTED_INDICATORS, getData, formatLabel, indexTypeToIndicatorType } from "../../../data/data-util";
import Accordion from "../../../components/Accordion/Accordion";
import Category from "../../../components/Category/Category";
import ScoreBar from "../../../components/ScoreBar/ScoreBar";

import './_country-overview.scss';
import PanelOverviewValues from '../../../components/Panel/PanelOverviewValues/PanelOverviewValues';

interface ICountryOverview {
    type: IndexType.FREEDOM | IndexType.PROSPERITY,
    data: FPData,
}

function CountryOverview(props: ICountryOverview) {
    const { type, data } = props;

    const indicators = NESTED_INDICATORS[indexTypeToIndicatorType(type)];

    const subindictorNode = (subindictor: string) => {
        return (
            <div className='panel__country-overview__subindicator' key={subindictor}>
                <h6>{formatLabel(subindictor)}</h6>
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
            <PanelOverviewValues type={type}
                data={data}
            />
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