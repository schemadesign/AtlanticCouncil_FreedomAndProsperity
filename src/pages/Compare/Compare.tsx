import { Page } from '../../@enums/Page';
import CompareChart from '../../components/CompareChart/CompareChart';

interface ICompare {
    selectedCountries: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
}

function Compare(props: ICompare) {
    const { selectedCountries, panelOpen, selectedIndicators } = props;

    return (
        <div className="page page--compare" id={Page.COMPARE}>
            <div className="page__header">
                <div className="container">
                    <h1>
                        Comparison Tool
                    </h1>
                </div>
            </div>
            <CompareChart
                panelOpen={panelOpen}
                selectedCountries={selectedCountries}
                selectedIndicators={selectedIndicators}
            />
        </div>
    )
}

export default Compare
