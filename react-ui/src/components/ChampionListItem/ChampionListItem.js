import React, { Component } from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './styles.css';

class ChampionListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
    this.handleLoad = this.handleLoad.bind(this);
    this.addActiveElement = this.addActiveElement.bind(this);
  }
  handleLoad() {
    this.setState({ loaded: true });
  }
  addActiveElement() {
    this.props.addActiveElement(this.props.champion, 'champions');
  }

  render() {
    return (
      <li className="champion-list-item" onClick={this.addActiveElement}>
        <div className="champion-image-container">
          <img
            className="champion-image"
            onLoad={this.handleLoad}
            src={`https://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/${this.props.champion.id}.png`}
            alt={this.props.champion.name}
          />
          { this.state.loaded ? null :
            <RefreshIndicator
            top={12}
            left={12}
            status={this.state.loaded ? 'hide' : 'loading'}
          />
          }
        </div>
        <div>{this.props.champion.name}</div>
      </li>
    );
  }

}

export default ChampionListItem;
