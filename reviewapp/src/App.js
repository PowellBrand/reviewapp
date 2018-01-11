import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom'
import Home from './components/Home/home';
import Private from './components/Private/private'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/private' component={Private} />
        </Switch>
      </div>
    )
  }
}

export default App;
