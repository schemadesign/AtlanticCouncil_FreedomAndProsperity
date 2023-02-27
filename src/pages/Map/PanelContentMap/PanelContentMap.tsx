import { IndexType } from "../../../@enums/IndexType";
import { getDataByISO } from "../../../data/data-util";
import Button from "../../../components/Button/Button";
import FiltersFreedom from "../../../components/Filters/FiltersFreedom";
import FiltersProsperity from "../../../components/Filters/FiltersProsperity";
import FreedomAndProsperityTable from "../../../components/FreedomAndProsperityTable/FreedomAndProsperityTable";
import MiniMap from "../../../components/MiniMap/MiniMap";
import ModeControls from "../../../components/ModeControls/ModeControls";
import CountryOverview from "../CountryOverview/CountryOverview";

import './_panel-content-map.scss';


interface IPanelContentMap {
    data: FPData | null,
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setOpen: (open: boolean) => void,
    setSelected: (data: FPData) => void,
    filters: Array<string>,
    toggleFilter: (type: string) => void,
}

function PanelContentMap(props: IPanelContentMap) {
    const { data, filters, mode, setSelected, setMode, toggleFilter, setOpen } = props;

    const handleSelectCountry = (iso: string) => {
        const data = getDataByISO(iso);
        setSelected(data as FPData)
    }

    return (
        <div className='panel__content panel__content--map'>
            <div className='panel__content__header'>
                <ModeControls setMode={setMode}
                    mode={mode} />
                {data ?
                    <span>
                        {mode !== IndexType.PROSPERITY ?
                            <FiltersFreedom toggleFilter={toggleFilter}
                                filters={filters}
                            />
                            :
                            <></>
                        }
                        {mode !== IndexType.FREEDOM ?
                            <FiltersProsperity toggleFilter={toggleFilter}
                                filters={filters}
                            />
                            :
                            <></>
                        }
                    </span>
                    :
                    null
                }
                <Button onClick={() => setOpen(false)}
                    variant={'close'}>

                </Button>
            </div>
            {data ?
                <div className='panel__content__inner'>
                    <div className='panel__content__country-info panel__content__padded'>
                        <h2>
                            {data.Name}
                        </h2>
                        {/* <h4>
                                    {data['Region (WB 2022)'] || ''}
                                </h4> */}
                        <MiniMap iso={data.ISO3} />
                    </div>
                    <div>
                        {mode !== IndexType.PROSPERITY ?
                            <CountryOverview data={data}
                                filters={filters}
                                type={IndexType.FREEDOM} />
                            :
                            <></>
                        }
                        {mode !== IndexType.FREEDOM ?
                            <CountryOverview data={data}
                                filters={filters}
                                type={IndexType.PROSPERITY} />
                            :
                            <></>
                        }
                    </div>
                </div>
                :
                mode === IndexType.PROSPERITY ?
                    <FreedomAndProsperityTable key={mode}
                        defaultSort={{ col: 'Prosperity rank', direction: -1 }}
                        handleSelectCountry={handleSelectCountry}
                        columns={['Prosperity rank', 'Name', 'Prosperity score']}
                    />
                    : mode === IndexType.FREEDOM ?
                        <FreedomAndProsperityTable key={mode}
                            defaultSort={{ col: 'Freedom rank', direction: -1 }}
                            handleSelectCountry={handleSelectCountry}
                            columns={['Freedom rank', 'Name', 'Freedom score']}
                        />
                        :
                        <FreedomAndProsperityTable key={mode}
                            defaultSort={{ col: 'Freedom rank', direction: -1 }}
                            handleSelectCountry={handleSelectCountry}
                            columns={['Freedom rank', 'Name', 'Freedom score', 'Prosperity rank', 'Prosperity score']}
                        />
            }
        </div>
    )
}

export default PanelContentMap;