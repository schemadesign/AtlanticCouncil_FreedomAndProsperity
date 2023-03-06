import { formatLabel } from '../../../data/data-util';
import { IAssignedColorDictionary } from '../../CompareChart/CompareChart';
import ScoreBar from '../../ScoreBar/ScoreBar';
import './../_tooltip.scss';

interface ICompareTooltip {
    data: null | FPData[],
    indicator: string,
    assignedColors: IAssignedColorDictionary,
    title?: number | null,
}

function CompareTooltip(props: ICompareTooltip) {
    let { data, title, indicator, assignedColors } = props;

    if (!data || data.length === 0) {
        return <></>;
    }

    return (
        <div className='tooltip tooltip__content'>
            <div className='tooltip__title'>
                <h3>
                    {title}
                </h3>
                <h3>
                    {formatLabel(indicator)}
                </h3>
            </div>
            <div className='tooltip__data'>
                <div className={`tooltip__col ${data.length > 8 ? 'tooltip__col--two-col' : ''}`}>
                    {data.map((d: FPData) => {
                        return (
                            <div key={d.ISO3}>
                                <h6>
                                    {d.Name}
                                </h6>
                                <ScoreBar value={d[indicator]}
                                    color={assignedColors[d.ISO3]}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CompareTooltip;