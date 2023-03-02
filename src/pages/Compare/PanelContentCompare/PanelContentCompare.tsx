import { IndexType, Indicator } from "../../../@enums/IndexType";
import Button from "../../../components/Button/Button";
import Checkbox from "../../../components/Checkbox/Checkbox";
import FiltersFreedom from "../../../components/Filters/FiltersFreedom";
import FiltersProsperity from "../../../components/Filters/FiltersProsperity";
import ModeControls from "../../../components/ModeControls/ModeControls";
import Search from "../../../components/Search/Search";
import { sortedData } from "../../../data/data-util";

interface IPanelContentCompare {
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setOpen: (open: boolean) => void,
    selectedIndicators: Array<string>,
    toggleFilter: (indicator: string) => void,
    selected: FPData[],
    setSelected: (val: FPData[]) => void,
}

function PanelContentCompare(props: IPanelContentCompare) {
    const { mode, setMode, selectedIndicators, toggleFilter, setOpen, selected, setSelected } = props;

    return (
        <div className='panel__content panel__content--compare'>
            <div className='panel__content__header'>
                {/* <ModeControls setMode={setMode}
                    mode={mode} />
                <span>
                    {mode !== IndexType.PROSPERITY ?
                        <FiltersFreedom toggleFilter={toggleFilter}
                            includeSubindicators={true}
                            filters={selectedIndicators}
                        />
                        :
                        <></>
                    }
                    {mode !== IndexType.FREEDOM ?
                        <FiltersProsperity toggleFilter={toggleFilter}
                            filters={selectedIndicators}
                        />
                        :
                        <></>
                    }
                </span> */}
                <Button key={Indicator.FREEDOM}
                    variant={IndexType.FREEDOM}
                    selected={selectedIndicators.includes(Indicator.FREEDOM)}
                    onClick={() => toggleFilter(Indicator.FREEDOM)}>
                    {Indicator.FREEDOM}
                </Button>
                <FiltersFreedom toggleFilter={toggleFilter}
                    includeSubindicators={true}
                    filters={selectedIndicators}
                />
                <Button key={Indicator.PROSPERITY}
                    variant={IndexType.PROSPERITY}
                    selected={selectedIndicators.includes(Indicator.PROSPERITY)}
                    onClick={() => toggleFilter(Indicator.PROSPERITY)}>
                    {Indicator.PROSPERITY}
                </Button>
                <FiltersProsperity toggleFilter={toggleFilter}
                    filters={selectedIndicators}
                />

                <Button onClick={() => setOpen(false)}
                    variant={'close'}>

                </Button>
            </div>
            <div>
                <Search selected={selected}
                    setSelected={setSelected}
                />
            </div>
            <div className='panel__content__inner'>
                <div>
                    {selected.map((country: FPData) => {
                        return (
                            <Checkbox key={`${country.ISO3}--selected`}
                                value={country.ISO3}
                                label={country.Name}
                                checked={true}
                                handleClick={() => {
                                    setSelected(selected.filter(d => d.ISO3 !== country.ISO3))
                                }}
                            />
                        )
                    })}
                </div>
                {sortedData({ col: 'Name', direction: 1 }).map((country: FPData) => {
                    if (selected.findIndex(d => d.ISO3 === country.ISO3) > -1) {
                        return <></>
                    }
                    return (
                        <Checkbox key={country.ISO3}
                            value={country.ISO3}
                            label={country.Name}
                            checked={false}
                            handleClick={() => {
                                setSelected([...selected, country])
                            }}
                        />
                    )
                })}
            </div>
            <div>
            </div>
        </div>
    )
}

export default PanelContentCompare;