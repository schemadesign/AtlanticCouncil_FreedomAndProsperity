import { useRef } from "react";
import { CSSTransition } from 'react-transition-group';
import { IndexType } from "../../@enums/IndexType";
import { getDataByISO } from "../../data/data-util";
import Button from "../Button/Button";
import ModeControls from "../ModeControls/ModeControls";
import FiltersFreedom from "../Filters/FiltersFreedom";
import FiltersProsperity from "../Filters/FiltersProsperity";
import FreedomAndProsperityTable from "../FreedomAndProsperityTable/FreedomAndProsperityTable";
import MiniMap from "../MiniMap/MiniMap";
import CountryOverview from "./CountryOverview/CountryOverview";
import './_panel.scss';

interface IPanel {
    data: FPData | null,
    open: boolean,
    mode: IndexType,
    setMode: (mode: IndexType) => void,
    setOpen: (open: boolean) => void,
    setPanelData: (data: FPData) => void,
}

function Panel(props: IPanel) {
    const { open, data, mode, setMode, setOpen, setPanelData } = props;
    const nodeRef = useRef(null);

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
                <div className='panel__content'>
                    <div className='panel__content__header'>
                        <ModeControls setMode={setMode}
                            mode={mode} />
                        {mode === IndexType.FREEDOM ?
                            <FiltersFreedom />
                            :
                            mode === IndexType.PROSPERITY ?
                                <FiltersProsperity />
                                :
                                <></>
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
                                        type={IndexType.FREEDOM} />
                                    :
                                    <></>
                                }
                                {mode !== IndexType.FREEDOM ?
                                    <CountryOverview data={data}
                                        type={IndexType.PROSPERITY} />
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                        :
                        mode === IndexType.PROSPERITY ?
                            <FreedomAndProsperityTable key={mode}
                                defaultSort={{col: 'Prosperity rank', direction: 1}}
                                handleSelectCountry={(iso) => setPanelData(getDataByISO(iso))}
                                columns={['Prosperity rank', 'Name', 'Prosperity score']}
                            />
                            : mode === IndexType.FREEDOM ?
                                <FreedomAndProsperityTable key={mode}
                                    defaultSort={{col: 'Freedom rank', direction: 1}}
                                    handleSelectCountry={(iso) => setPanelData(getDataByISO(iso))}
                                    columns={['Freedom rank', 'Name', 'Freedom score']}
                                />
                                :
                                <></>
                    }
                </div>
            </div>
        </CSSTransition>
    );
}

export default Panel;