import CountryProfile from '../../components/CountryProfile/CountryProfile';

interface IProfiles {
    selectedCountry: FPData[],
    panelOpen: boolean,
}

function Profiles(props: IProfiles) {
    const { selectedCountry, panelOpen } = props;

    return (
        <div className="page--profiles">
            <div className="page__header">
                <div className="container">
                    <h1>
                        Profiles
                    </h1>
                    
                </div>
            </div>
            <CountryProfile selectedCountry={selectedCountry} 
                panelOpen={panelOpen}
                />
        </div>
    )
}

export default Profiles
