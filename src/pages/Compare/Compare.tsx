import { Pages } from '../../@enums/Pages';
import CompareChart from '../../components/CompareChart/CompareChart';
import Page from '../Page/Page';

interface ICompare {
    selectedCountries: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
}

function Compare(props: ICompare) {
    const { selectedCountries, panelOpen, selectedIndicators } = props;

    const title = selectedCountries.length > 0 ? selectedCountries.map((d, i) => ' ' + d.Name).toString() : ''

    return (
        <Page id={Pages.COMPARE}
            title={title}>

            <CompareChart
                panelOpen={panelOpen}
                selectedCountries={selectedCountries}
                selectedIndicators={selectedIndicators}
            />
        </Page>
    )
}

export default Compare
