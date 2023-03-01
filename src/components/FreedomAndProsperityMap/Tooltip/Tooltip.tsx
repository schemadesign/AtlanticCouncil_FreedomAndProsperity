import { IndexType } from '../../../@enums/IndexType';
import MapTooltip from './MapTooltip/MapTooltip';
import ProfileTooltip from './ProfileTooltip/ProfileTooltip';
import './_tooltip.scss';

interface ITooltip {
    data: null | FPData,
    mode: IndexType,
    countryProfile?: boolean,
    indicators?: Array<any>
}

function Tooltip(props: ITooltip) {
    let { data, mode, countryProfile, indicators } = props;

    if (!data) {
        return <></>;
    }

    return (
        <div className='tooltip tooltip__content'>
            <div className='tooltip__title'>
                <h3>
                    {data.Name}
                </h3>
                {countryProfile ? 
                    <h3>
                        {data['Index Year']}
                    </h3>
                    :
                    <></>
                }
            </div>
            {countryProfile && indicators ?
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