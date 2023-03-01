import { IndexType } from "../../../../@enums/IndexType";
import { getData, totalCountries } from "../../../../data/data-util";
import Category from "../../../Category/Category";
import ScoreBar from "../../../ScoreBar/ScoreBar";
import Freedom from '../../../../assets/icons/IconFreedom';
import Prosperity from '../../../../assets/icons/IconProsperity';

interface ITooltip {
    data: null | FPData,
    mode: IndexType,
}

function Tooltip(props: ITooltip) {
    let { data, mode } = props;

    if (!data || !data['Freedom score']) {
        return (
            <div className='tooltip__data'>
                <div className='tooltip__col' style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    Data unavailable
                </div>
            </div>
        )
    }

    return (
        <div className='tooltip__data'>
            {mode !== IndexType.PROSPERITY ?
                <div className='tooltip__col'>
                    <h4>
                        <Freedom />
                        {IndexType.FREEDOM}
                    </h4>
                    <div>
                        <h6>
                            Score
                        </h6>
                        <ScoreBar value={data['Freedom score']} />
                    </div>
                    <div>
                        <h6>
                            Rank
                        </h6>
                        <h5 className='tooltip__rank__value'>
                            {getData(data, 'Freedom rank')}
                            <sup>/{totalCountries}</sup>
                        </h5>
                    </div>
                    <div className='tooltip__status'>
                        <h6>
                            Status
                        </h6>
                        <Category type={IndexType.FREEDOM}
                            category={data['Freedom category']} />
                    </div>
                </div>
                :
                null
            }
            {mode !== IndexType.FREEDOM ?
                <div className='tooltip__col'>
                    <h4>
                        <Prosperity />
                        {IndexType.PROSPERITY}
                    </h4>
                    <div>
                        <h6>
                            Score
                        </h6>
                        <ScoreBar value={data['Prosperity score']} />
                    </div>
                    <div>
                        <h6>
                            Rank
                        </h6>
                        <h5 className='tooltip__rank__value'>
                            {getData(data, 'Prosperity rank')}
                            <sup>/{totalCountries}</sup>
                        </h5>
                    </div>
                    <div className='tooltip__status'>
                        <h6>
                            Status
                        </h6>
                        <Category type={IndexType.PROSPERITY}
                            category={data['Prosperity category']} />
                    </div>
                </div>
                :
                null
            }
        </div>
    )
}

export default Tooltip;