import { useRef } from "react";
import { CSSTransition } from 'react-transition-group';
import { IndexType } from "../../@enums/IndexType";
import './_panel.scss';
import PanelContentMap from "../../pages/Map/PanelContentMap/PanelContentMap";
import { Page } from "../../@enums/Page";
import PanelContentProfiles from "../../pages/Profiles/PanelContentProfiles/PanelContentProfiles";
import PanelContentCompare from "../../pages/Compare/PanelContentCompare/PanelContentCompare";

interface IPanel {
    data: FPData[],
    open: boolean,
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setOpen: (open: boolean) => void,
    setSelected: (data: FPData[]) => void,
    selectedIndicators: Array<string>,
    setSelectedIndicators: (indicators: Array<string>) => void,
    page: Page,
}

function Panel(props: IPanel) {
    const { open, data, mode, setMode, setOpen, setSelected, page, selectedIndicators, setSelectedIndicators } = props;
    const nodeRef = useRef(null);

    const toggleFilter = (type: string | null) => {
        if (!type) {
            setSelectedIndicators([])
        } else {
            const newVal = selectedIndicators.includes(type) ? selectedIndicators.filter(val => val !== type) : [...selectedIndicators, type]
            setSelectedIndicators(newVal)
        }
    }


    const inner = () => {
        switch (page) {
            case Page.MAP:
                return (
                    <PanelContentMap data={data ? data[0] : null}
                        setOpen={setOpen}
                        mode={mode}
                        setMode={setMode}
                        filters={selectedIndicators}
                        toggleFilter={toggleFilter}
                        setSelected={(data: FPData) => setSelected([data])}
                    />
                )
            case Page.PROFILES:
                return (
                    <PanelContentProfiles data={data}
                        setOpen={setOpen}
                        selectedIndicators={selectedIndicators}
                        toggleFilter={toggleFilter}
                    />
                )
            case Page.COMPARE:
                return (
                    <PanelContentCompare setOpen={setOpen}
                        mode={mode}
                        setMode={setMode}
                        selectedIndicators={selectedIndicators}
                        toggleFilter={(indicator: string) => setSelectedIndicators([indicator])}
                        selected={data}
                        setSelected={setSelected}
                    />
                )
            default:
                return <></>
        }
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
                {inner()}
            </div>
        </CSSTransition>
    );
}

export default Panel;