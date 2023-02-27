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
    const [page, setPage] = useState<Page>(Page.MAP);
    const [mode, setMode] = useState<IndexType>(IndexType.COMBINED);
    const [panelOpen, setPanelOpen] = useState(false);
    const [selected, setSelected] = useState<Array<FPData>>([]);

    return (
        <>
            <Home />
            <Header page={page}
                setPage={setPage}
            >
                <div className='flex-row justify-end'>
                    <Search selected={selected}
                        setSelected={setSelected} />

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
                        <Suspense fallback={<div></div>}>
                            <Map mode={mode}
                                setMode={setMode}
                                panelOpen={panelOpen}
                                setSelected={setSelected}
                                setPanelOpen={setPanelOpen}
                            />
                        </Suspense>
                        : page === Page.PROFILES ?
                            <Suspense fallback={<div></div>}>
                                <Profiles selectedCountry={selected}
                                    panelOpen={panelOpen}
                                    />
                            </Suspense>
                            :
                            null
                }

                <Panel
                    mode={mode}
                    page={page}
                    setMode={setMode}
                    setOpen={setPanelOpen}
                    setSelected={setSelected}
                    open={panelOpen}
                    data={selected} />
            </div>
        </>
    )
}

export default App;
