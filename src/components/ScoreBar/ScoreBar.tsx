import { useEffect, useState } from 'react';
import './_score-bar.scss';

interface IScoreBar {
    value: number,
}

function ScoreBar(props: IScoreBar) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(props.value)
    }, [])

    return (
        <div className="score-bar">
            <div className="score-bar__value" style={{width: `${value}%`}}></div>
        </div>
    )
}

export default ScoreBar;