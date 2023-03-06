import { IndexType } from "../../../@enums/IndexType";
import { getDataByISO } from "../../../data/data-util";
import Button from "../../../components/Button/Button";
import FiltersFreedom from "../../../components/Filters/FiltersFreedom";
import FiltersProsperity from "../../../components/Filters/FiltersProsperity";
import FreedomAndProsperityTable from "../../../components/FreedomAndProsperityTable/FreedomAndProsperityTable";
import MiniMap from "../../../components/MiniMap/MiniMap";
import CountryOverview from "../CountryOverview/CountryOverview";

import './_panel-content-map.scss';


interface IPanelContentMap {
    selectedCountries: FPData[],
    setSelected: (data: FPData[]) => void,
    mode: IndexType,
}

function PanelContentMap(props: IPanelContentMap) {
    const { selectedCountries, mode, setSelected } = props;

    const handleSelectCountry = (iso: string) => {
        const data = getDataByISO(iso);
        setSelected([data as FPData])
    }

    const country: FPData | null = selectedCountries.length > 0 ? selectedCountries[0] : null;

    if (country) {
        return (
            <div className='panel__content__inner'>
                <div className='panel__content__country-info panel__content__padded'>
                    <h2>
                        {country.Name}
                    </h2>
                    {/* <h4>
                        {country['Region (WB 2022)'] || ''}
                    </h4> */}
                    <MiniMap iso={country.ISO3} />
                </div>
                <div>
                    <CountryOverview data={country}
                        type={IndexType.FREEDOM} />
                    <CountryOverview data={country}
                        type={IndexType.PROSPERITY} />
                </div>
            </div>
        )
    }

    if (mode === IndexType.PROSPERITY) {
        return (
            <FreedomAndProsperityTable key={mode}
                defaultSort={{ col: 'Prosperity rank', direction: -1 }}
                handleSelectCountry={handleSelectCountry}
                columns={['Prosperity rank', 'Name', 'Prosperity score']}
                selectedCountries={selectedCountries}
                goToProfile={() => { }}
            />
        )
    } else if (mode === IndexType.FREEDOM) {
        return (
            <FreedomAndProsperityTable key={mode}
                defaultSort={{ col: 'Freedom rank', direction: -1 }}
                handleSelectCountry={handleSelectCountry}
                columns={['Freedom rank', 'Name', 'Freedom score']}
                selectedCountries={selectedCountries}
                goToProfile={() => { }}
            />
        )
    }

    return (
        <FreedomAndProsperityTable key={mode}
            defaultSort={{ col: 'Freedom rank', direction: -1 }}
            handleSelectCountry={handleSelectCountry}
            columns={['Freedom rank', 'Name', 'Freedom score', 'Prosperity rank', 'Prosperity score']}
            selectedCountries={selectedCountries}
            goToProfile={() => { }}
        />
    )
}

export default PanelContentMap;