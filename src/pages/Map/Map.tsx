import { IndexType } from "../../@enums/IndexType";
import ModeControls from "../../components/ModeControls/ModeControls";
import FreedomAndProsperityMap from "../../components/FreedomAndProsperityMap/Map/Map";
import FreedomAndProsperityMapLegend from "../../components/FreedomAndProsperityMap/Legend/Legend";

import './_map.scss';
import { Pages } from "../../@enums/Pages";
import Page from "../Page/Page";

interface IHome {
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setSelected: (data: FPData[]) => void,
    setPanelOpen: (state: boolean) => void,
}

function Map(props: IHome) {
    const { mode, setMode, setSelected, setPanelOpen } = props;

    return (
        <Page id={Pages.MAP}
            title={'Freedom and Prosperity Map'}
            >
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
        </Page>
    )
}

export default Map
