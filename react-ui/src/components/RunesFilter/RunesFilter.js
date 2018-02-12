import React, { Component } from 'react';
import './styles.css';

const runesPaths = [
  'Precision',
  'Domination',
  'Sorcery',
  'Resolve',
  'Inspiration'
]

class RunesFilter extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const { name } = event.target;
    this.props.updateRunesPath(name);
  }
  render() {
    return (
      <ul className="runes-filter">
        {runesPaths.map((path, idx) => <li
          key={idx} className="runes-filter-checkbox-container"
        >
          <label>
            <input
              type="radio"
              name={path}
              checked={this.props.runesPath === path}
              onChange={this.handleInputChange}
            />
            {path}
          </label>
        </li>
        )}
      </ul>
    );
  }

}

export default RunesFilter;
