import React, { Suspense, useEffect, useState } from 'react'
import { IndexType, Indicator } from './@enums/IndexType';
import { Pages } from './@enums/Pages';
import Button from './components/Button/Button';
import Header from './components/Header/Header'
import Panel from './components/Panel/Panel';
import Search from './components/Search/Search';
import Home from './pages/Home/Home';
import Page from './pages/Page/Page';
import { getHashLocation } from './util/app-nav';
const Rankings = React.lazy(() => import('./pages/Rankings/Rankings'))
const Map = React.lazy(() => import('./pages/Map/Map'))
const Profiles = React.lazy(() => import('./pages/Profiles/Profiles'))
const Compare = React.lazy(() => import('./pages/Compare/Compare'))

function App() {
    const [page, setPage] = useState<Pages | null>(getHashLocation());
    const [searchVisible, setSearchVisible] = useState(false)
    const [mode, setMode] = useState<IndexType>(IndexType.COMBINED);
    const [panelOpen, setPanelOpen] = useState(false);
    const [selectedIndicators, setSelectedIndicators] = useState<Array<string>>([Indicator.PROSPERITY, Indicator.FREEDOM])
    const [isAxisScaled, setIsAxisScaled] = useState(false)
    /* used in search */
    const [selected, setSelected] = useState<Array<FPData>>([]);
    /* used for display */
    const [selectedCountries, setSelectedCountries] = useState<Array<FPData>>([]);

    useEffect(() => {
        const handleHashChange = () => {
            setPage(getHashLocation())
        }

        const handleScroll = () => {
            checkSearchVisible()
        }

        window.addEventListener('hashchange', handleHashChange)
        window.addEventListener('scroll', handleScroll)

        checkSearchVisible()

        return () => {
            window.removeEventListener('hashchange', handleHashChange)
            window.removeEventListener('scroll', handleHashChange)
        }
    }, [])

    const checkSearchVisible = () => {
        if (window.scrollY < window.innerHeight/2) {
            setPanelOpen(false)
        }

        if (window.scrollY < 100) {
            setSearchVisible(false)
        } else {
            if (!searchVisible) {
                setSearchVisible(true)
            }
        }
    }

    useEffect(() => {
        if (page === Pages.MAP) {
            if (selected.length > 0) {
                setPanelOpen(true)
            }
        }
        if (page === Pages.PROFILES) {
            if (selectedIndicators.length === 0) {
                setSelectedIndicators(([Indicator.PROSPERITY, Indicator.FREEDOM]));
            }
        }

        // prevents redrawing page while searching for new country
        if (selected.length > 0) {
            setSelectedCountries(selected)
        }
    }, [selected])

    useEffect(() => {
        if (page === Pages.PROFILES) {
            setSelectedIndicators(([Indicator.PROSPERITY, Indicator.FREEDOM]));
        } else if (page === Pages.COMPARE) {
            setSelectedIndicators(([Indicator.FREEDOM]));
        } else {
            setSelectedIndicators([])
        }

        if (page === Pages.MAP) {
            setMode(IndexType.COMBINED)
        }

        if (page === Pages.RANKINGS) {
            setSelected([])
            setSelectedCountries([])
            if (panelOpen) {
                setPanelOpen(false)
            }
        }
    }, [page])

    const goToProfile = (val: FPData) => {
        setSelectedCountries([]);
        window.location.hash = Pages.PROFILES;

        setTimeout(() => {
            setSelectedCountries([val]);
        }, 10)
    }

    const handleSetSelected = (val: FPData[], resetCountries?: boolean) => {
        setSelected(val);
    
        if (resetCountries) {
            setSelectedCountries([])
        }
    }

    const getPage = () => {
        switch (page) {
            case Pages.RANKINGS:
                return (
                    <Suspense fallback={<Page id={page} title={''}> </Page>}>
                        <Rankings goToProfile={goToProfile}
                            selectedCountries={selected}
                        />
                    </Suspense>
                )
            case Pages.MAP:
            case null:
                return (
                    <Suspense fallback={<Page id={Pages.MAP} title={''}> </Page>}>
                        <Map mode={mode}
                            setMode={setMode}
                            setSelected={setSelected}
                            setPanelOpen={setPanelOpen}
                        />
                    </Suspense>
                )
            case Pages.PROFILES:
                return (
                    <Suspense fallback={<Page id={page} title={''}> </Page>}>
                        <Profiles selectedCountries={selectedCountries}
                            panelOpen={panelOpen}
                            selectedIndicators={selectedIndicators}
                            isAxisScaled={isAxisScaled}
                        />
                    </Suspense>
                )
            case Pages.COMPARE:
                return (
                    <Suspense fallback={<Page id={page} title={''}> </Page>}>
                        <Compare
                            selectedCountries={selectedCountries}
                            panelOpen={panelOpen}
                            selectedIndicators={selectedIndicators}
                            isAxisScaled={isAxisScaled}
                        />
                    </Suspense>
                )
            default:
                return (
                    <Page id={page}
                        title={page}>

                    </Page>
                )
        }
    }

    return (
        <>
            <Home />
            <Header page={page}
                setPage={setPage}
                className={searchVisible ? 'header--search-visible' : ''}
            >
                {!panelOpen ?
                    <div className='flex-row justify-end'>
                        <Search selected={selected}
                            setSelected={(val: FPData[], resetCountries?: boolean) => handleSetSelected(val, page === Pages.MAP ? resetCountries : false)}
                            multiple={page === Pages.COMPARE ? true : false}
                        />

                        <Button variant='open-panel'
                            style={{ visibility: page === Pages.RANKINGS ? 'hidden' : 'visible' }}
                            onClick={() => {
                                setPanelOpen(true);
                            }}>
                        </Button>
                    </div>
                    :
                    <></>
                }
            </Header>
            <div className='sections'>
                {getPage()}

                <Panel
                    mode={mode}
                    page={page ? page : Pages.MAP}
                    setMode={setMode}
                    setOpen={setPanelOpen}
                    setSelected={handleSetSelected}
                    selectedIndicators={selectedIndicators}
                    setSelectedIndicators={setSelectedIndicators}
                    open={panelOpen}
                    searchSelected={selected}
                    selectedCountries={selectedCountries} 
                    isAxisScaled={isAxisScaled}
                    toggleIsAxisScaled={() => setIsAxisScaled(prev => !prev)}
                    />
            </div>
        </>
    )
}

export default App;
