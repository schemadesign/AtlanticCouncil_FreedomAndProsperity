import { formatLabel } from '../../../data/data-util';
import ScoreBar from '../../ScoreBar/ScoreBar';

interface IProfileTooltip {
    data: null | FPData,
    indicators: Array<any>
}

function ProfileTooltip(props: IProfileTooltip) {
    let { data, indicators } = props;

    if (!data) {
        return <></>;
    } 

    const sorted = indicators ? indicators.sort((a, b) => {
        if (data) {
            return data[b.key] - data[a.key]
        }
        return -1;
    }) : []

    return (
        <div className='tooltip__data'>
            <div className={`tooltip__col ${indicators?.length > 8 ? 'tooltip__col--two-col' : ''}`}>
                {sorted.map((indicator) => {
                    return (
                        <div key={indicator.key}>
                            <h6>
                                {formatLabel(indicator.key)}
                            </h6>
                            <ScoreBar color={indicator.color}
                                value={data ? data[indicator.key] : 0} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProfileTooltip;