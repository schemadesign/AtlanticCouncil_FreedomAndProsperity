import { FreedomCategory } from '../../../@enums/FreedomCategory';
import { IndexType } from '../../../@enums/IndexType';
import { ProsperityCategory } from '../../../@enums/ProsperityCategory';
import Freedom from '../../../assets/icons/IconFreedom';
import Prosperity from '../../../assets/icons/IconProsperity';
import { totalCountries } from '../../../data/data-util';
import Category from '../../Category/Category';
import ScoreBar from '../../ScoreBar/ScoreBar';
import './_tooltip.scss';

interface ITooltip {
    data: null | FPData,
    mode: IndexType,
}

function Tooltip(props: ITooltip) {
    let { data, mode } = props;

    if (!data) {
        return;
    }

    return (
        <div className='map__tooltip__content'>
            <div className='map__tooltip__title'>
                <h3>
                    {data.Country}
                </h3>
            </div>
            {!data['Freedom score 2021'] ?
                <div className='map__tooltip__data'>
                    <div className='map__tooltip__col' style={{fontSize: '0.875rem', whiteSpace: 'nowrap'}}>
                        Data unavailable
                    </div>
                </div>
                :
                <div className='map__tooltip__data'>
                    {mode !== IndexType.PROSPERITY ?
                        <div className='map__tooltip__col'>
                            <h4>
                                <Freedom />
                                {IndexType.FREEDOM}
                            </h4>
                            <div>
                                <h6>
                                    Score
                                </h6>
                                <ScoreBar value={parseFloat(data['Freedom score 2021'])} />
                            </div>
                            <div>
                                <h6>
                                    Rank
                                </h6>
                                <h5 className='tooltip__rank__value'>
                                    {data['Freedom rank 2021']}
                                    <sup>/{totalCountries}</sup>
                                </h5>
                            </div>
                            <div className='tooltip__status'>
                                <h6>
                                    Status
                                </h6>
                                <Category type={IndexType.FREEDOM}
                                    category={data['Freedom category 2021']} />
                            </div>
                        </div>
                        :
                        null 
                    }
                    {mode !== IndexType.FREEDOM ?
                        <div className='map__tooltip__col'>
                            <h4>
                                <Prosperity />
                                {IndexType.PROSPERITY}
                            </h4>
                            <div>
                                <h6>
                                    Score
                                </h6>
                                <ScoreBar value={parseFloat(data['Prosperity score 2021'])} />
                            </div>
                            <div>
                                <h6>
                                    Rank
                                </h6>
                                <h5 className='tooltip__rank__value'>
                                    {data['Prosperity rank 2021']}
                                    <sup>/{totalCountries}</sup>
                                </h5>
                            </div>
                            <div className='tooltip__status'>
                                <h6>
                                    Status
                                </h6>
                                <Category type={IndexType.PROSPERITY}
                                    category={data['Prosperity category 2021']} />
                            </div>
                        </div>
                        :
                        null 
                    }
                </div>
            }
        </div>
    )
}

export default Tooltip;