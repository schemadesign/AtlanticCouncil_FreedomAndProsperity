import React, { Suspense, useState } from 'react'
import Header from './components/Header/Header'
const Rankings = React.lazy(() => import('./pages/Rankings/Rankings'))
const Home = React.lazy(() => import('./pages/Home/Home'))
const Map = React.lazy(() => import('./pages/Map/Map'))

function App() {
    const [page, setPage] = useState('map');

    return (
        <>
            <Header page={page}
                setPage={setPage} />
            {page === 'rankings' ?
                <Suspense fallback={<div></div>}>
                    <Rankings />
                </Suspense>
                : page === 'map' ?
                <Suspense fallback={<div></div>}>
                    <Map />
                </Suspense>
                : page === 'home' ?
                <Suspense fallback={<div></div>}>
                    <Home />
                </Suspense>
                :
                null
            }
        </>
    )
}

export default App;
