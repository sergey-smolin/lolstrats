import React, { Component } from 'react';
import RunesListItem from '../RunesListItem/RunesListItem';
import './styles.css';

class RunesList extends Component {

  render() {
    return (
      <ul className="runes-list">
        {
          this.props.runes.filter(rune => this.props.runesPath === rune.path)
            .map(rune => <RunesListItem
              {...this.props}
              key={rune.id}
              rune={rune}
            />)
        }
      </ul>
    );
  }

}

export default RunesList;
