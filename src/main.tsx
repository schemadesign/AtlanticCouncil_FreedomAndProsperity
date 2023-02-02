import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home/Home'
import Map from './components/FreedomAndProsperityMap/Map'
import './main.scss'
import Rankings from './pages/Rankings/Rankings'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <Home /> */}
    {/* <Map /> */}
    <Rankings />
  </React.StrictMode>,
)
