import { useEffect, useState } from 'react';
import { formatValue } from '../../data/data-util';
import './_score-bar.scss';

interface IScoreBar {
    value: number,
    color?: string,
}

function ScoreBar(props: IScoreBar) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(props.value)
    }, [props.value])


    if (isNaN(value) || value < 0) {
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
                {formatValue(value, 1)}
            </h5>
            <div className="score-bar">
                <div className="score-bar__value" style={{ width: `${value}%`, background: props.color ? props.color : '' }}></div>
            </div>
        </div>
    )
}

export default ScoreBar;