import { useEffect, useState } from "react";
import { IndexType } from "../../@enums/IndexType";
import ModeControls from "../../components/ModeControls/ModeControls";
import FreedomAndProsperityMap from "../../components/FreedomAndProsperityMap/Map/Map";
import FreedomAndProsperityMapLegend from "../../components/FreedomAndProsperityMap/Legend/Legend";
import Panel from "../../components/Panel/Panel";

import './_map.scss';

interface IHome {
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setPanelData: (data: FPData) => void,
    setPanelOpen: (state: boolean) => void,
    panelOpen: boolean,
}

function Map(props: IHome) {
    const { mode, setMode, setPanelData, setPanelOpen, panelOpen } = props;

    return (
        <div className="page--map">
            <div className="page--map__header">
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
                        setPanelData(data);

                        if (!panelOpen) {
                            setPanelOpen(true)
                        }
                    }}
                />
                <FreedomAndProsperityMapLegend mode={mode} />
            </div>
        </div>
    )
}

export default Map
