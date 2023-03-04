import { Pages } from '../../@enums/Pages';
import CountryProfileChart from '../../components/CountryProfileChart/CountryProfileChart';
import Page from '../Page/Page';

interface IProfiles {
    selectedCountries: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
}

function Profiles(props: IProfiles) {
    const { selectedCountries, panelOpen, selectedIndicators } = props;

    const title = selectedCountries.length > 0 ? selectedCountries[0].Name : ''

    return (
        <Page id={Pages.PROFILES}
            title={title}
            >
            <CountryProfileChart selectedCountries={selectedCountries} 
                selectedIndicators={selectedIndicators}
                panelOpen={panelOpen}
                />
        </Page>
    )
}

export default Profiles
