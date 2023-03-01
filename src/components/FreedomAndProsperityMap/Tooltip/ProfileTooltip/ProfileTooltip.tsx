import ScoreBar from '../../../ScoreBar/ScoreBar';

interface IProfileTooltip {
    data: null | FPData,
    indicators: Array<any>
}

function ProfileTooltip(props: IProfileTooltip) {
    let { data, indicators } = props;

    if (!data) {
        return <></>;
    }

    return (
        <div className='tooltip__data'>
            <div className='tooltip__col'>
                {indicators?.map((indicator) => {
                    return (
                        <div key={indicator.key}>
                            <h6>
                                {indicator.indicator}
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