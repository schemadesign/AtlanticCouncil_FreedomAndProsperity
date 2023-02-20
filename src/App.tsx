import React, { Suspense, useState } from 'react'
import Header from './components/Header/Header'
import Home from './pages/Home/Home';
import Rankings from './pages/Rankings/Rankings';
const Map = React.lazy(() => import('./pages/Map/Map'))

function App() {
    const [page, setPage] = useState('map');

    return (
        <>
            <Home />
            <Header page={page}
                setPage={setPage} />
            <div className='sections'>
                {page === 'rankings' ?
                    <Rankings />
                    : page === 'map' ?
                        <Suspense fallback={<div></div>}>
                            <Map />
                        </Suspense>
                        :
                        null
                }
            </div>
        </>
    )
}

export default App;
