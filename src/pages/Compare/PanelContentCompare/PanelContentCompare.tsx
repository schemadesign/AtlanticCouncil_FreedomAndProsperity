import { IndexType } from "../../../@enums/IndexType";
import Button from "../../../components/Button/Button";
import FiltersFreedom from "../../../components/Filters/FiltersFreedom";
import FiltersProsperity from "../../../components/Filters/FiltersProsperity";
import ModeControls from "../../../components/ModeControls/ModeControls";

interface IPanelContentCompare {
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setOpen: (open: boolean) => void,
    selectedIndicators: Array<string>,
    toggleFilter: (indicator: string) => void,
}

function PanelContentCompare(props: IPanelContentCompare) {
    const { mode, setMode, selectedIndicators, toggleFilter, setOpen } = props;

    return (
        <div className='panel__content panel__content--compare'>
            <div className='panel__content__header'>
                <ModeControls setMode={setMode}
                    mode={mode} />
                <span>
                    {mode !== IndexType.PROSPERITY ?
                        <FiltersFreedom toggleFilter={toggleFilter}
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
                </span>
                <Button onClick={() => setOpen(false)}
                    variant={'close'}>

                </Button>
            </div>
            <div className='panel__content__inner'>
                {/* <div className='panel__content__country-info panel__content__padded'>
                        <h2>
                            {data.Name}
                        </h2>
                        {/* <h4>
                                    {data['Region (WB 2022)'] || ''}
                                </h4> */}
            </div>
            <div>
            </div>
        </div>
    )
}

export default PanelContentCompare;