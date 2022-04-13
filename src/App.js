import React, { useContext } from 'react'
//Components
import Nav from './components/frontendBoilerplate/Nav'
import Footer from './components/frontendBoilerplate/Footer'
import Hero from './components/Hero'
//Styles
import './App.css'
//Context
import { ModeContext } from './contexts/Mode'
import { GraphContext } from './contexts/Graph'

function App() {
  //Context
  const mode = useContext(ModeContext)
  const graphData = useContext(GraphContext)

  console.log(graphData)
  return (
    <div className={mode && mode.mode === 'dark' ? 'App' : 'AppLight'}>
      <Nav />
      <div
        className={
          mode && mode.mode === 'dark' ? 'HeroContainer' : 'HeroContainerLight'
        }
      >
        <h1>Tellor Treasuries</h1>
      </div>
      <Footer />
    </div>
  )
}

export default App
