import _ from "lodash";
import { isArray } from "lodash";
import { useEffect, useState } from "react";
import { IndexType } from "../../../@enums/IndexType";
import Button from "../../../components/Button/Button";
import Category from "../../../components/Category/Category";
import Checkbox from "../../../components/Checkbox/Checkbox";
import PanelOverviewValues from "../../../components/Panel/PanelOverviewValues/PanelOverviewValues";
import { formatLabel, NESTED_INDICATORS } from "../../../data/data-util";

import './_panel-content-profiles.scss';

interface IPanelContentProfiles {
    data: FPData[],
    setOpen: (open: boolean) => void,
    selectedIndicators: Array<string>,
    toggleFilter: (indicator: string | null) => void,
}

function PanelContentProfiles(props: IPanelContentProfiles) {
    const [ country, setCountry ] = useState<FPData | null>(null)
    const { setOpen, data, selectedIndicators, toggleFilter } = props;

    useEffect(() => {
        // prevent reseting panel when searching for new country
        if (data.length > 0) {
            setCountry(data[0] as FPData)
        }
    }, [data])

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
                    {Object.keys(NESTED_INDICATORS).sort().map((type: string) => {
                        const subindicators = NESTED_INDICATORS[type as keyof typeof NESTED_INDICATORS];
                        return (
                            <div key={type}>
                                <div>
                                    <Checkbox value={type}
                                        label={formatLabel(type)}
                                        handleClick={() => toggleFilter(type)}
                                        checked={selectedIndicators.includes(type)}
                                    />
                                </div>
                                {isArray(subindicators) ?
                                    <div className='panel__content--profiles__checkboxes__subsubsection'
                                    >
                                        {subindicators.map((subindicator: string) => {
                                            return (
                                                <div key={subindicator}>
                                                    <Checkbox
                                                        value={subindicator}
                                                        label={formatLabel(subindicator)}
                                                        disabled={isDisabled(subindicator)}
                                                        checked={selectedIndicators.includes(subindicator)}
                                                        handleClick={() => toggleFilter(subindicator)}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    :
                                    (Object.keys(subindicators)).map((subindicator: string) => {
                                        return (
                                            <div key={subindicator}
                                                className='panel__content--profiles__checkboxes__subsection'
                                            >
                                                <Checkbox value={subindicator}
                                                    disabled={isDisabled(subindicator)}
                                                    label={formatLabel(subindicator)}
                                                    handleClick={() => toggleFilter(subindicator)}
                                                    checked={selectedIndicators.includes(subindicator)}
                                                />
                                                <div key={subindicator}
                                                    className='panel__content--profiles__checkboxes__subsubsection'
                                                >
                                                    {subindicators[subindicator as keyof typeof subindicators].map((subsub: string) => {
                                                        return (
                                                            <div key={subsub}>
                                                                <Checkbox value={subsub}
                                                                    label={formatLabel(subsub)}
                                                                    disabled={isDisabled(subsub)}
                                                                    handleClick={() => toggleFilter(subsub)}
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
                        onClick={() => toggleFilter(null)}>
                        Clear all
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PanelContentProfiles;