import Button from "../../../components/Button/Button";
import Checkbox from "../../../components/Checkbox/Checkbox";
import { sortedData } from "../../../data/data-util";

import './_panel-content-compare.scss';

interface IPanelContentCompare {
    selectedCountries: FPData[],
    setSelected: (val: FPData[], resetCountries?: boolean) => void,
    search: React.ReactNode,
    axisToggle: React.ReactNode,
}

function PanelContentCompare(props: IPanelContentCompare) {
    const { selectedCountries, setSelected, search, axisToggle } = props;

    return (
        <div className='panel__content panel__content--compare'>
            <div className='panel__content__inner panel__content__padded'>
                {selectedCountries.length > 0 ?
                    <div style={{ margin: '2rem 0' }}>
                        <div>
                            {selectedCountries.map((country: FPData) => {
                                return (
                                    <Checkbox key={`${country.ISO3}--selected`}
                                        value={country.ISO3}
                                        label={country.Name}
                                        checked={true}
                                        handleClick={() => {
                                            setSelected(selectedCountries.filter(d => d.ISO3 !== country.ISO3))
                                        }}
                                    />
                                )
                            })}
                        </div>
                        <Button onClick={() => setSelected([], true)}
                            variant={'outline'}
                        >
                            Reset
                        </Button>
                    </div>
                    :
                    <></>
                }

                <div>
                    {axisToggle}
                </div>

                <div>
                    {search}
                </div>

                {sortedData({ col: 'Name', direction: 1 }).map((country: FPData) => {
                    if (selectedCountries.findIndex(d => d.ISO3 === country.ISO3) > -1) {
                        return <></>
                    }
                    return (
                        <Checkbox key={country.ISO3}
                            value={country.ISO3}
                            label={country.Name}
                            checked={false}
                            handleClick={() => {
                                setSelected([...selectedCountries, country])
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default PanelContentCompare;