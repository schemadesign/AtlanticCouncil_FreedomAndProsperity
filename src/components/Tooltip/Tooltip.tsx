import { IndexType } from '../../@enums/IndexType';
import CompareTooltip from './CompareTooltip/CompareTooltip';
import MapTooltip from './MapTooltip/MapTooltip';
import ProfileTooltip from './ProfileTooltip/ProfileTooltip';
import './_tooltip.scss';

interface ITooltip {
    data: null | FPData,
    mode: IndexType,
    countryProfileChart?: boolean,
    indicators?: Array<any>,
}

// TODO
// refactor this to handle different versions better
// generalized title etc

function Tooltip(props: ITooltip) {
    let { data, mode, countryProfileChart, indicators } = props;

    if (!data) {
        return <></>;
    }

    return (
        <div className='tooltip tooltip__content'>
            <div className='tooltip__title'>
                <h3>
                    {data.Name}
                </h3>
                {countryProfileChart ?
                    <h3>
                        {data['Index Year']}
                    </h3>
                    :
                    <></>
                }
            </div>
            {countryProfileChart && indicators ?
                <ProfileTooltip data={data}
                    indicators={indicators}
                />
                :
                <MapTooltip data={data}
                    mode={mode}
                />
            }
        </div>
    )
}

export default Tooltip;