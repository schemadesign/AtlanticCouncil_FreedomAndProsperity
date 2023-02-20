import React, { Suspense, useState } from 'react'
import { IndexType } from './@enums/IndexType';
import Header from './components/Header/Header'
import Panel from './components/Panel/Panel';
import Home from './pages/Home/Home';
import Rankings from './pages/Rankings/Rankings';
const Map = React.lazy(() => import('./pages/Map/Map'))

function App() {
    const [page, setPage] = useState('map');
    const [mode, setMode] = useState<IndexType>(IndexType.COMBINED);
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelData, setPanelData] = useState<FPData | null>(null);

    return (
        <>
            <Home />
            <Header page={page}
                setPage={setPage} 
                openPanel={() => {
                    setPanelData(null);
                    setPanelOpen(true);
                }}
                />
            <div className='sections'>
                {page === 'rankings' ?
                    <Rankings />
                    : page === 'map' ?
                        <Suspense fallback={<div></div>}>
                            <Map mode={mode}
                                setMode={setMode}
                                panelOpen={panelOpen}
                                setPanelData={setPanelData}
                                setPanelOpen={setPanelOpen} 
                                />
                        </Suspense>
                        :
                        null
                }

                <Panel
                    mode={mode}
                    setMode={setMode}
                    setOpen={setPanelOpen}
                    setPanelData={setPanelData}
                    open={panelOpen}
                    data={panelData} />
            </div>
        </>
    )
}

export default App;
