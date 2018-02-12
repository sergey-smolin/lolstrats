import React, { Component } from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './styles.css';

class RunesListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
    this.handleLoad = this.handleLoad.bind(this);
  }
  handleLoad() {
    this.setState({ loaded: true });
  }

  render() {
    return (
      <li
        className="rune-container"
        onClick={() => this.props.addActiveElement(this.props.rune, 'runes')}
      >
        <div className="rune-image-container">
          <img
            src={`/images/runes/${this.props.rune.id}.png`}
            className="rune-image"
            onLoad={this.handleLoad}
            alt="rune thumbnail"
          />
          { this.state.loaded ? null :
            <RefreshIndicator
            top={34}
            left={34}
            status={this.state.loaded ? 'hide' : 'loading'}
          />
          }
        </div>
        {this.props.rune.name}
      </li>
    );
  }

}

export default RunesListItem;
