import { useEffect, useState } from "react";
import { IndexType } from "../../@enums/IndexType";
import ModeControls from "../../components/ModeControls/ModeControls";
import FreedomAndProsperityMap from "../../components/FreedomAndProsperityMap/Map/Map";
import FreedomAndProsperityMapLegend from "../../components/FreedomAndProsperityMap/Legend/Legend";
import Panel from "../../components/Panel/Panel";

import './_map.scss';

interface IHome {
}

function Map(props: IHome) {
    const [mode, setMode] = useState<IndexType>(IndexType.COMBINED);
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelData, setPanelData] = useState<FPData | null>(null);

    return (
        <div className="page--map">
            <div className="page--map__header">
                <div className="container">
                    <h1>
                        Freedom and ProsperityMap
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

            <Panel
                mode={mode}
                setMode={setMode}
                setOpen={setPanelOpen}
                setPanelData={setPanelData}
                open={panelOpen}
                data={panelData} />
        </div>
    )
}

export default Map
