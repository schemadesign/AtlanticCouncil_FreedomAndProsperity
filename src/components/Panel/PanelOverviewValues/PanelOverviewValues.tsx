import _ from 'lodash';
import { IndexType } from '../../../@enums/IndexType';
import { totalCountries, getData } from "../../../data/data-util";

interface IPanelOverviewValues {
    type: IndexType.FREEDOM | IndexType.PROSPERITY,
    data: FPData,
}

function PanelOverviewValues(props: IPanelOverviewValues) {
    const { type, data } = props;

    return (
        <div className="panel__overview__values flex-row justify-space-between">
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
    );
}

export default PanelOverviewValues;