import { Page } from '../../@enums/Page';
import CountryProfileChart from '../../components/CountryProfileChart/CountryProfileChart';

interface IProfiles {
    selectedCountries: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
}

function Profiles(props: IProfiles) {
    const { selectedCountries, panelOpen, selectedIndicators } = props;

    return (
        <div className="page page--profiles" id={Page.PROFILES}>
            <div className="page__header">
                <div className="container">
                    <h1>
                        Profiles
                    </h1>
                    
                </div>
            </div>
            <CountryProfileChart selectedCountries={selectedCountries} 
                selectedIndicators={selectedIndicators}
                panelOpen={panelOpen}
                />
        </div>
    )
}

export default Profiles
