import { useEffect, useState } from "react";
import { IndexType } from "../../@enums/IndexType";
import ControlsSidePanel from "../../components/ControlsSidePanel/ControlsSidePanel";
import FreedomAndProsperityMap from "../../components/FreedomAndProsperityMap/Map/Map";
import FreedomAndProsperityMapLegend from "../../components/FreedomAndProsperityMap/Legend/Legend";
import Panel from "../../components/Panel/Panel";

function Map() {
    const [mode, setMode] = useState<null | IndexType>(null);
    const [ panelOpen, setPanelOpen ] = useState(false);
    const [ panelData, setPanelData ] = useState<FPData | null>(null);

    useEffect(() => {
        if (mode && !panelOpen) {
            setPanelOpen(true)
        } else if (!mode && !panelData && panelOpen) {
            setPanelOpen(false)
        }
    }, [mode])

    return (
        <div className="page--map container">
            <h1>
                Map
            </h1>
            <ControlsSidePanel mode={mode}
                setMode={(mode: null | IndexType) => setMode(mode)}
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
