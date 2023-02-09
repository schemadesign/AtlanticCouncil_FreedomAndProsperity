import { useState } from "react";
import { IndexType } from "../../@enums/IndexType";
import ControlsSidePanel from "../../components/ControlsSidePanel/ControlsSidePanel"
import FreedomAndProsperityTable from "../../components/FreedomAndProsperityTable/FreedomAndProsperityTable"
import { getColumns } from "../../data/data-util";

function Rankings() {
    const [mode, setMode] = useState<null | IndexType>(null);
    return (
        <div className="page--rankings container">
            <h1>
                Rankings
            </h1>
            <ControlsSidePanel mode={mode}
                setMode={(mode: null | IndexType) => setMode(mode)} />
            <FreedomAndProsperityTable columns={getColumns(mode)}
                mode={mode} />
        </div>
    )
}

export default Rankings
