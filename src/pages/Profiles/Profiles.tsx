import { Pages } from '../../@enums/Pages';
import CountryProfileChart from '../../components/CountryProfileChart/CountryProfileChart';
import Page from '../Page/Page';

interface IProfiles {
    selectedCountries: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
    isAxisScaled: boolean,
}

function Profiles(props: IProfiles) {
    const { selectedCountries, panelOpen, selectedIndicators, isAxisScaled } = props;

    const title = selectedCountries.length > 0 ? selectedCountries[0].Name : ''

    return (
        <Page id={Pages.PROFILES}
            title={title}
            >
            <CountryProfileChart selectedCountries={selectedCountries} 
                selectedIndicators={selectedIndicators}
                panelOpen={panelOpen}
                isAxisScaled={isAxisScaled}
                />
        </Page>
    )
}

export default Profiles
