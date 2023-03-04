import { useRef } from "react";
import { CSSTransition } from 'react-transition-group';
import { IndexType, Indicator } from "../../@enums/IndexType";
import './_panel.scss';
import PanelContentMap from "../../pages/Map/PanelContentMap/PanelContentMap";
import { Pages } from "../../@enums/Pages";
import PanelContentProfiles from "../../pages/Profiles/PanelContentProfiles/PanelContentProfiles";
import PanelContentCompare from "../../pages/Compare/PanelContentCompare/PanelContentCompare";
import Search from "../Search/Search";
import Button from "../Button/Button";
import FiltersFreedom from "../Filters/FiltersFreedom";
import FiltersProsperity from "../Filters/FiltersProsperity";

interface IPanel {
    searchSelected: FPData[],
    selectedCountries: FPData[],
    open: boolean,
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setOpen: (open: boolean) => void,
    setSelected: (data: FPData[], resetCountries?: boolean) => void,
    selectedIndicators: Array<string>,
    setSelectedIndicators: (indicators: Array<string>) => void,
    page: Pages,
}

function Panel(props: IPanel) {
    const { open, selectedCountries, mode, setMode, setOpen, setSelected, page, selectedIndicators, setSelectedIndicators, searchSelected } = props;
    const nodeRef = useRef(null);

    const toggleFilter = (type: string | null) => {
        let newVal = !type ? [] : selectedIndicators.includes(type) ? selectedIndicators.filter(val => val !== type) : [...selectedIndicators, type];

        if (!type || newVal.length === 0) {
            if (page === Pages.PROFILES) {
                newVal = [IndexType.FREEDOM, IndexType.PROSPERITY]
            }
        }
        setSelectedIndicators(newVal)
    }

    const toggleFilterCompare = (indicator: string) => setSelectedIndicators([indicator])

    let header = () => {
        switch (page) {
            case Pages.COMPARE:
                return (
                    <div className='panel__content__header'>
                        <Button onClick={() => setOpen(false)}
                            variant={'close'}>
                        </Button>

                        <Button key={Indicator.FREEDOM}
                            variant={IndexType.FREEDOM}
                            selected={selectedIndicators.includes(Indicator.FREEDOM)}
                            onClick={() => toggleFilterCompare(Indicator.FREEDOM)}>
                            {Indicator.FREEDOM}
                        </Button>
                        <FiltersFreedom toggleFilter={toggleFilterCompare}
                            includeSubindicators={true}
                            filters={selectedIndicators}
                        />
                        <Button key={Indicator.PROSPERITY}
                            variant={IndexType.PROSPERITY}
                            selected={selectedIndicators.includes(Indicator.PROSPERITY)}
                            onClick={() => toggleFilterCompare(Indicator.PROSPERITY)}>
                            {Indicator.PROSPERITY}
                        </Button>
                        <FiltersProsperity toggleFilter={toggleFilterCompare}
                            filters={selectedIndicators}
                        />
                    </div>
                )
            default:
                return (
                    <div className='panel__content__header'>

                        <Search selected={searchSelected}
                            setSelected={(data: FPData[]) => setSelected(data)}
                        />

                        <Button onClick={() => setOpen(false)}
                            variant={'close'}>
                        </Button>
                    </div>
                )
        }
    }

    const inner = () => {
        switch (page) {
            case Pages.MAP:
                return (
                    <PanelContentMap
                        mode={mode}
                        filters={selectedIndicators}
                        toggleFilter={toggleFilter}
                        selectedCountries={selectedCountries}
                        setSelected={setSelected}
                    />
                )
            case Pages.PROFILES:
                return (
                    <PanelContentProfiles selectedCountries={selectedCountries}
                        selectedIndicators={selectedIndicators}
                        toggleFilter={toggleFilter}
                    />
                )
            case Pages.COMPARE:
                return (
                    <PanelContentCompare
                        mode={mode}
                        setMode={setMode}
                        selectedCountries={selectedCountries}
                        setSelected={setSelected}
                    >
                        <Search selected={searchSelected}
                            setSelected={(data: FPData[]) => setSelected(data)}
                            multiple={true}
                        />
                    </PanelContentCompare>
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
                <div className={`panel__content panel__content--${page}`}>
                    {header()}
                    {inner()}
                </div>
            </div>
        </CSSTransition>
    );
}

export default Panel;