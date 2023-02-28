import _ from "lodash";
import { isArray } from "lodash";
import { IndexType } from "../../../@enums/IndexType";
import Button from "../../../components/Button/Button";
import Category from "../../../components/Category/Category";
import Checkbox from "../../../components/Checkbox/Checkbox";
import PanelOverviewValues from "../../../components/Panel/PanelOverviewValues/PanelOverviewValues";
import { INDICATORS } from "../../../data/data-util";

import './_panel-content-profiles.scss';

interface IPanelContentProfiles {
    data: FPData[],
    setOpen: (open: boolean) => void,
    selectedIndicators: Array<string>,
    setSelectedIndicators: (indicators: Array<string>) => void,
}

function PanelContentProfiles(props: IPanelContentProfiles) {
    const { setOpen, data, selectedIndicators, setSelectedIndicators } = props;
    const country = data.length > 0 ? data[0] as FPData : null;

    const toggleSelectedIndicator = (indicator: string) => {
        if (selectedIndicators.includes(indicator)) {
            setSelectedIndicators(selectedIndicators.filter(d => d !== indicator))
        } else {
            setSelectedIndicators([...selectedIndicators, indicator])
        }
    }

    const isDisabled = (key: string) => {
        if (country) {
            return data.findIndex(d => d[key] > 0) === -1
        }

        return true;
    }

    let inner = <></>

    if (country) {
        inner = (
            <>
                <div className='panel__content__country-info panel__content__padded'>
                    <h2>
                        {country.Name}
                    </h2>
                </div>
                <div className='d-flex flex-row'>
                    <PanelOverviewValues data={country}
                        type={IndexType.FREEDOM}
                    />
                    <PanelOverviewValues data={country}
                        type={IndexType.PROSPERITY}
                    />
                </div>
                <div className='d-flex flex-row'>
                    <div>
                        <Category type={IndexType.FREEDOM}
                            category={_.get(country, `${IndexType.FREEDOM} category`) as string} />
                    </div>
                    <div>
                        <Category type={IndexType.PROSPERITY}
                            category={_.get(country, `${IndexType.PROSPERITY} category`) as string} />
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className='panel__content panel__content--profiles'>
            <div className='panel__content__header'>
                <Button onClick={() => setOpen(false)}
                    variant={'close'}>

                </Button>
            </div>
            <div className='panel__content__inner'>
                {inner}

                <div className='d-flex flex-row panel__content--profiles__checkboxes'>
                    {Object.keys(INDICATORS).sort().map((type: string) => {
                        const subIndicators = INDICATORS[type as keyof typeof INDICATORS];
                        return (
                            <div key={type}>
                                <div>
                                    <Checkbox value={type}
                                        handleClick={() => toggleSelectedIndicator(type)}
                                        checked={selectedIndicators.includes(type)}
                                    />
                                </div>
                                {isArray(subIndicators) ?
                                    <div className='panel__content--profiles__checkboxes__subsubsection'
                                    >
                                        {subIndicators.map((subIndicator: string) => {
                                            return (
                                                <div key={subIndicator}>
                                                    <Checkbox
                                                        value={subIndicator}
                                                        disabled={isDisabled(subIndicator)}
                                                        checked={selectedIndicators.includes(subIndicator)}
                                                        handleClick={() => toggleSelectedIndicator(subIndicator)}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    :
                                    (Object.keys(subIndicators)).map((subIndicator: string) => {
                                        return (
                                            <div key={subIndicator}
                                                className='panel__content--profiles__checkboxes__subsection'
                                            >
                                                <Checkbox value={subIndicator}
                                                    disabled={isDisabled(subIndicator)}
                                                    handleClick={() => toggleSelectedIndicator(subIndicator)}
                                                    checked={selectedIndicators.includes(subIndicator)}
                                                />
                                                <div key={subIndicator}
                                                    className='panel__content--profiles__checkboxes__subsubsection'
                                                >
                                                    {subIndicators[subIndicator as keyof typeof subIndicators].map((subsub: string) => {
                                                        return (
                                                            <div key={subsub}>
                                                                <Checkbox value={subsub}
                                                                    disabled={isDisabled(subsub)}
                                                                    handleClick={() => toggleSelectedIndicator(subsub)}
                                                                    checked={selectedIndicators.includes(subsub)}
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })}
                </div>

                <div className="flex-row">
                    <Button className="panel__content--profiles__clear-filters"
                        onClick={() => setSelectedIndicators([])}>
                        Clear all
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PanelContentProfiles;