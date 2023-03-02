import { IndexType } from "../../@enums/IndexType";
import ModeControls from "../../components/ModeControls/ModeControls";
import FreedomAndProsperityMap from "../../components/FreedomAndProsperityMap/Map/Map";
import FreedomAndProsperityMapLegend from "../../components/FreedomAndProsperityMap/Legend/Legend";

import './_map.scss';
import { Page } from "../../@enums/Page";

interface IHome {
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setSelected: (data: FPData[]) => void,
    setPanelOpen: (state: boolean) => void,
}

function Map(props: IHome) {
    const { mode, setMode, setSelected, setPanelOpen } = props;

    return (
        <div className="page page--map" id={Page.MAP}>
            <div className="page__header">
                <div className="container">
                    <h1>
                        Freedom and Prosperity Map
                    </h1>
                </div>
            </div>
            <div className="container">
                <ModeControls mode={mode}
                    setMode={(mode: IndexType) => setMode(mode)}
                />
                <FreedomAndProsperityMap mode={mode}
                    setPanelData={(data: FPData) => {
                        setSelected([data]);
                        setPanelOpen(true);
                    }}
                />
                <FreedomAndProsperityMapLegend mode={mode} />
            </div>
        </div>
    )
}

export default Map
