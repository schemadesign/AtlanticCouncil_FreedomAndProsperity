import _ from "lodash";
import { isArray } from "lodash";
import { IndexType } from "../../../@enums/IndexType";
import { IChartIndicator } from "../../../@types/chart";
import Button from "../../../components/Button/Button";
import Category from "../../../components/Category/Category";
import Checkbox from "../../../components/Checkbox/Checkbox";
import PanelOverviewValues from "../../../components/Panel/PanelOverviewValues/PanelOverviewValues";
import { formatLabel, getSelectedFlattenedIndicators, NESTED_INDICATORS } from "../../../data/data-util";

import './_panel-content-profiles.scss';

interface IPanelContentProfiles {
    selectedCountries: FPData[],
    selectedIndicators: Array<string>,
    toggleFilter: (indicator: string | null) => void,
    axisToggle: React.ReactNode,
    resetFilters: () => void
}

function PanelContentProfiles(props: IPanelContentProfiles) {
    const { selectedCountries, selectedIndicators, toggleFilter, axisToggle, resetFilters } = props;

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
                {getSelectedFlattenedIndicators(Object.keys(NESTED_INDICATORS).sort()).map((topLevel: IChartIndicator) => {
                    const subindicators = NESTED_INDICATORS[topLevel.key as keyof typeof NESTED_INDICATORS];
                    return (
                        <div key={topLevel.key}>
                            <div className='d-flex flex-row panel__content--country-profiles__checkboxes'>
                                <Checkbox value={topLevel.key}
                                    label={topLevel.label}
                                    handleClick={() => toggleFilter(topLevel.key)}
                                    checked={selectedIndicators.includes(topLevel.key)}
                                    color={topLevel.color}
                                />
                            </div>
                            {isArray(subindicators) ?
                                <div className='panel__content--country-profiles__checkboxes__subsubsection'
                                >
                                    { getSelectedFlattenedIndicators(subindicators).map((subindicator: IChartIndicator) => {
                                        return (
                                            <div key={subindicator.key}>
                                                <Checkbox
                                                    value={subindicator.key}
                                                    label={subindicator.label}
                                                    disabled={isDisabled(subindicator.key)}
                                                    checked={selectedIndicators.includes(subindicator.key)}
                                                    handleClick={() => toggleFilter(subindicator.key)}
                                                />
                                            </div>
                                        )
                                    })}
                                    <Button className="panel__content--country-profiles__clear-filters"
                                        variant={'outline'}
                                        onClick={resetFilters}>
                                        Reset
                                    </Button>
                                    <div>
                                        {axisToggle}
                                    </div>
                                </div>
                                :
                                getSelectedFlattenedIndicators(Object.keys(subindicators)).map((subindicator: IChartIndicator) => {
                                    return (
                                        <div key={subindicator.key}
                                            className='panel__content--country-profiles__checkboxes__subsection'
                                        >
                                            <Checkbox value={subindicator.key}
                                                disabled={isDisabled(subindicator.key)}
                                                label={subindicator.label}
                                                handleClick={() => toggleFilter(subindicator.key)}
                                                checked={selectedIndicators.includes(subindicator.key)}
                                                color={subindicator.color}
                                            />
                                            <div key={subindicator.key}
                                                className='panel__content--country-profiles__checkboxes__subsubsection'
                                            >
                                                {subindicators[subindicator.key as keyof typeof subindicators].map((subsub: string) => {
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