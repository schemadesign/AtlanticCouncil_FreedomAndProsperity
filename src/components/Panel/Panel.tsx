import { useRef, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import { IndexType } from "../../@enums/IndexType";
import './_panel.scss';
import PanelContentMap from "../../pages/Map/PanelContentMap/PanelContentMap";
import { Page } from "../../@enums/Page";
import PanelContentProfiles from "../../pages/Profiles/PanelContentProfiles/PanelContentProfiles";

interface IPanel {
    data: FPData[],
    open: boolean,
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setOpen: (open: boolean) => void,
    setSelected: (data: FPData[]) => void,
    page: Page,
}

function Panel(props: IPanel) {
    const { open, data, mode, setMode, setOpen, setSelected, page } = props;
    const [filters, setFilters] = useState<Array<string>>([]);
    const nodeRef = useRef(null);

    const toggleFilter = (type: string) => {
        setFilters(prev => prev.includes(type) ? prev.filter(val => val !== type) : [...prev, type])
    }

    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={open}
            appear={true}
            timeout={500}
            mountOnEnter={true}
            unmountOnExit={true}
            classNames={`slide`}>
            <div className={`panel`}
                ref={nodeRef}
            >
                {page === Page.MAP ?
                    <PanelContentMap data={data ? data[0] : null}
                        setOpen={setOpen}
                        mode={mode}
                        setMode={setMode}
                        filters={filters}
                        toggleFilter={toggleFilter}
                        setSelected={(data: FPData) => setSelected([data])}
                        />
                        :
                        <></>
                }
                {page === Page.PROFILES ?
                    <PanelContentProfiles data={data}
                        setOpen={setOpen}
                        />
                    :
                    <></>
                }
            </div>
        </CSSTransition>
    );
}

export default Panel;