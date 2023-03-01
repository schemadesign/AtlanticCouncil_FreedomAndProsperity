import React, { Suspense, useEffect, useState } from 'react'
import { IndexType } from './@enums/IndexType';
import { Page } from './@enums/Page';
import Button from './components/Button/Button';
import Header from './components/Header/Header'
import Panel from './components/Panel/Panel';
import Search from './components/Search/Search';
import Compare from './pages/Compare/Compare';
import Home from './pages/Home/Home';
import Profiles from './pages/Profiles/Profiles';
const Rankings = React.lazy(() => import('./pages/Rankings/Rankings'))
const Map = React.lazy(() => import('./pages/Map/Map'))

function App() {
    const getInitialPage = () => {
        const hash = window.location.hash.replace('#', '');

        for (let i in Page) {
            if (Page[i as keyof typeof Page] === hash) {
                return Page[i as keyof typeof Page];
            }
        }

        return null;
    }

    const [page, setPage] = useState<Page | null>(getInitialPage());
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
        if (page === Page.PROFILES) {
            if (selectedIndicators.length === 0) {
                setSelectedIndicators(([IndexType.PROSPERITY, IndexType.FREEDOM]));
            }
        }
    }, [selected])

    useEffect(() => {
        if (page === Page.PROFILES) {
            setSelectedIndicators(([IndexType.PROSPERITY, IndexType.FREEDOM]));
        } else if (page === Page.COMPARE) {
            setSelectedIndicators([IndexType.FREEDOM])
        } else {
            setSelectedIndicators([])
        }
        if (page === Page.MAP || page === Page.COMPARE) {
            setMode(IndexType.COMBINED)
        }
        if (page === Page.RANKINGS) {
            setPanelOpen(false)
        }
    }, [page])

    const getPage = () => {
        switch (page) {
            case Page.RANKINGS:
                return (
                    <Suspense fallback={<div className='page .page--rankings' id={Page.RANKINGS}></div>}>
                        <Rankings />
                    </Suspense>
                )
            case Page.MAP:
            case null:
                return (
                    <Suspense fallback={<div className='page .page--map' id={Page.MAP}></div>}>
                        <Map mode={mode}
                            setMode={setMode}
                            setSelected={setSelected}
                            setPanelOpen={setPanelOpen}
                        />
                    </Suspense>
                )
            case Page.PROFILES:
                return (
                    <Profiles selectedCountry={selected}
                        panelOpen={panelOpen}
                        selectedIndicators={selectedIndicators}
                    />
                )
            case Page.COMPARE:
                return (
                    <Compare
                        selectedCountry={selected}
                        panelOpen={panelOpen}
                        selectedIndicators={selectedIndicators}
                    />
                )
            default:
                return <></>
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
                        setSelected={(newSelection: Array<FPData>) => setSelected(newSelection)} />

                    <Button variant='open-panel'
                        style={{ visibility: page === Page.RANKINGS ? 'hidden' : 'visible' }}
                        onClick={() => {
                            setPanelOpen(true);
                        }}>
                    </Button>
                </div>
            </Header>
            <div className='sections'>
                {getPage()}

                <Panel
                    mode={mode}
                    page={page ? page : Page.MAP}
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
