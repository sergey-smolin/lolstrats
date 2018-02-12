import React, { Component } from 'react';
import './styles.css';
import ChampionListItem from '../ChampionListItem/ChampionListItem';

class ChampionList extends Component {

  render() {
    const jsx = this.props.champions.map(champion =>
      <ChampionListItem
        {...this.props}
        key={champion.id}
        champion={champion}
      />
    );
    return (
      <ul className="champion-list">
        {jsx}
      </ul>
    );
  }

}

export default ChampionList;
