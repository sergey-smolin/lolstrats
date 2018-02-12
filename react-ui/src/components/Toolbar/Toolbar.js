import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

class Toolbar extends Component {

  render() {
    return (
      <div className="toolbar">
        <h1 className="app-title"><Link className="app-title-link" to="/">LoL Strats</Link></h1>
        <div className="toolbar-flat-button">
          <Link className="flat-link" to="/">Find videos</Link>
        </div>
        <div className="toolbar-flat-button">
          <Link className="flat-link" to="/add">Add a video</Link>
        </div>
      </div>
    );
  }

}

export default Toolbar;
