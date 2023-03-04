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
    selectedCountries: FPData[],
    selectedIndicators: Array<string>,
    toggleFilter: (indicator: string | null) => void,
}

function PanelContentProfiles(props: IPanelContentProfiles) {
    const { selectedCountries, selectedIndicators, toggleFilter } = props;

    const isDisabled = (key: string) => {
        if (selectedCountries) {
            return selectedCountries.findIndex(d => d[key] > 0) === -1
        }
        return true;
    }

    let inner = <></>

    const country = selectedCountries ? selectedCountries[0] : null;

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
        <div className='panel__content__inner'>
            {inner}

            <div className='d-flex flex-row panel__content--country-profiles__checkboxes'>
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
                                <div className='panel__content--country-profiles__checkboxes__subsubsection'
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
                                    <Button className="panel__content--country-profiles__clear-filters"
                                        onClick={() => toggleFilter(null)}>
                                        Reset
                                    </Button>
                                </div>
                                :
                                (Object.keys(subindicators)).map((subindicator: string) => {
                                    return (
                                        <div key={subindicator}
                                            className='panel__content--country-profiles__checkboxes__subsection'
                                        >
                                            <Checkbox value={subindicator}
                                                disabled={isDisabled(subindicator)}
                                                label={formatLabel(subindicator)}
                                                handleClick={() => toggleFilter(subindicator)}
                                                checked={selectedIndicators.includes(subindicator)}
                                            />
                                            <div key={subindicator}
                                                className='panel__content--country-profiles__checkboxes__subsubsection'
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
        </div>
    )
}

export default PanelContentProfiles;