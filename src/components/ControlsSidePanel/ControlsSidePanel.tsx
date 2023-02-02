import { IndexType } from "../../@enums/IndexType";
import Button from "../Button/Button";

import './_controls-side-panel.scss';

interface IControlsSidePanel {
    mode: null | IndexType,
    setMode: (mode: null | IndexType) => void,
}

function ControlsSidePanel(props: IControlsSidePanel) {
    const { mode, setMode } = props;

    return (
        <div className="controls-side-panel">
            {[IndexType.FREEDOM, IndexType.PROSPERITY].map((type: IndexType) => (
                <Button key={type}
                    variant={type}
                    selected={mode === type}
                    onClick={() => setMode(mode === type ? null : type)}>
                    {type}
                </Button>
            ))}
        </div>
    )
}

export default ControlsSidePanel;