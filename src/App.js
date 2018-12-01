import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapComp from './comps/mapComp';
import ErrorBoundary from './comps/ErrorBoundary';

class App extends Component {
  state = {
    lat: 30.2672,
    long: -97.7431,
    zoom: 12,
    allLocations: locations,
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>bands</h1>
        </header>
        <nav>
          <ul>
            <li>home</li>
            <li>artists</li>
            <li>venues</li>
            <li>about</li>
            <li>contact us</li>
          </ul>
        </nav>
        <ErrorBoundary>
          <MapComp {...this.state} />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;