import { useEffect, useState } from 'react';
import './_score-bar.scss';

interface IScoreBar {
    value: number,
}

function ScoreBar(props: IScoreBar) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(props.value)
    }, [props.value])


    if (isNaN(value)) {
        return (
            <div className="score-bar__container">
                <h5 className="score-bar__label">
                    &mdash;
                </h5>
            </div>
        )
    }

    return (
        <div className="score-bar__container">
            <h5 className="score-bar__label">
                {value.toFixed(1)}
            </h5>
            <div className="score-bar">
                <div className="score-bar__value" style={{ width: `${value}%` }}></div>
            </div>
        </div>
    )
}

export default ScoreBar;