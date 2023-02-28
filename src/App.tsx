import React, { Suspense, useEffect, useState } from 'react'
import { IndexType } from './@enums/IndexType';
import { Page } from './@enums/Page';
import Button from './components/Button/Button';
import Header from './components/Header/Header'
import Panel from './components/Panel/Panel';
import Search from './components/Search/Search';
import Home from './pages/Home/Home';
import Profiles from './pages/Profiles/Profiles';
import Rankings from './pages/Rankings/Rankings';
const Map = React.lazy(() => import('./pages/Map/Map'))

function App() {
    const getInitialPage = () => {
        const hash = window.location.hash.replace('#', '');

        for (let i in Page) {
            if (Page[i as keyof typeof Page] === hash) {
                return Page[i as keyof typeof Page];
            }
        }

        return Page.MAP
    }

    const [page, setPage] = useState<Page>(getInitialPage());
    const [mode, setMode] = useState<IndexType>(IndexType.COMBINED);
    const [panelOpen, setPanelOpen] = useState(false);
    const [selected, setSelected] = useState<Array<FPData>>([]);
    const [selectedIndicators, setSelectedIndicators] = useState<Array<string>>([IndexType.PROSPERITY, IndexType.FREEDOM])


    useEffect(() => {
        if (page === Page.MAP) {
            if (selected.length > 0) {
                setPanelOpen(true)
            }
        }
    }, [selected])

    useEffect(() => {
        if (page === Page.PROFILES) {
            setSelectedIndicators(([IndexType.PROSPERITY, IndexType.FREEDOM]));
        }
    }, [page])

    const handleSetSelected = (newSelection: FPData[]) => {
        // prevent reseting selected country
        if (newSelection.length > 0) {
            setSelected(newSelection)
        }
    }

    return (
        <>
            <Home />
            <Header page={page}
                setPage={setPage}
            >
                <div className='flex-row justify-end'>
                    <Search selected={selected}
                        setSelected={handleSetSelected} />

                    <Button variant='open-panel'
                        onClick={() => {
                            setPanelOpen(true);
                        }}>
                    </Button>
                </div>
            </Header>
            <div className='sections'>
                {page === 'rankings' ?
                    <Rankings />
                    : page === Page.MAP ?
                        <Suspense fallback={<div id="map"></div>}>
                            <Map mode={mode}
                                setMode={setMode}
                                setSelected={setSelected}
                                setPanelOpen={setPanelOpen}
                            />
                        </Suspense>
                        : page === Page.PROFILES ?
                            <Profiles selectedCountry={selected}
                                panelOpen={panelOpen}
                                selectedIndicators={selectedIndicators}
                            />
                            :
                            null
                }

                <Panel
                    mode={mode}
                    page={page}
                    setMode={setMode}
                    setOpen={setPanelOpen}
                    setSelected={setSelected}
                    selectedIndicators={selectedIndicators}
                    setSelectedIndicators={setSelectedIndicators}
                    open={panelOpen}
                    data={selected} />
            </div>
        </>
    )
}

export default App;
