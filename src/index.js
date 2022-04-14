import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import User from './contexts/User'
import Mode from './contexts/Mode'
import Graph from './contexts/Graph'

ReactDOM.render(
  <User>
    <Mode>
      <Graph>
        <App />
      </Graph>
    </Mode>
  </User>,
  document.getElementById('root')
)
