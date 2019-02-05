import React, { Component } from 'react'
import './App.css'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import OtherPage from './components/OtherPage'
import FiboPage from './components/FiboPage'

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <Link to='/'>Home</Link>
          <Link to='/otherpage'>OtherPage</Link>
          <div>
            <Route exact path='/' component={FiboPage} />
            <Route exact path='/otherpage' component={OtherPage} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
