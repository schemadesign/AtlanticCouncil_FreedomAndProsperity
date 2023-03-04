import { useState } from "react";
import { IndexType } from "../../@enums/IndexType";
import FreedomAndProsperityTable from "../../components/FreedomAndProsperityTable/FreedomAndProsperityTable"
import { getColumns } from "../../data/data-util";
import ModeControls from "../../components/ModeControls/ModeControls";

interface IRankings {
    goToProfile: (val: FPData) => void,
    selectedCountries: FPData[],
}

function Rankings(props: IRankings) {
    const { goToProfile, selectedCountries } = props;
    const [mode, setMode] = useState<IndexType>(IndexType.COMBINED);

    return (
        <div className="page page--rankings">
            <div className="page__header">
                <div className="container">
                    <h1>
                        Rankings
                    </h1>
                </div>
            </div>
            <div className="container">
                <ModeControls mode={mode}
                    setMode={(mode: IndexType) => setMode(mode)} />
                <FreedomAndProsperityTable columns={getColumns(mode)}
                    goToProfile={goToProfile}
                    selectedCountries={selectedCountries}
                    />
            </div>
        </div>
    )
}

export default Rankings
