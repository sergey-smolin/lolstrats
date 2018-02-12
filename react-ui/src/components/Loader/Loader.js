import React, { Component } from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './styles.css';

class Loader extends Component {

  render() {
    return (
      <div className="app-loader-container">
        <RefreshIndicator
            status="loading"
        />
      </div>
    );
  }

}

export default Loader;
