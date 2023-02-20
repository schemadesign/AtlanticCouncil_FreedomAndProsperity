import { IndexType } from "../../@enums/IndexType";
import Button from "../Button/Button";

import './_mode-controls.scss';

interface IModeControls {
    mode: IndexType,
    setMode: (mode: IndexType) => void,
}

function ModeControls(props: IModeControls) {
    const { mode, setMode } = props;

    return (
        <div className="mode-controls">
            {[IndexType.COMBINED, IndexType.FREEDOM, IndexType.PROSPERITY].map((type: IndexType) => (
                <Button key={type}
                    variant={type}
                    selected={mode === type}
                    onClick={() => setMode(mode === type ? IndexType.COMBINED : type)}>
                    {type}
                </Button>
            ))}
        </div>
    )
}

export default ModeControls;