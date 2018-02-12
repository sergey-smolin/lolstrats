import React, { Component } from 'react';
import './styles.css';

class ItemFilter extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const tagMap = {
      ...this.props.tagMap,
      [name]: value
    }
    const activeTags = Object.keys(tagMap).reduce((memo, next) => {
      if (tagMap[next]) return [ ...memo, next ];
      return memo;
    }, []);

    this.props.updateTagMap({ tagMap, activeTags });
  }

  render() {
    return (
      <ul className="item-filter">
        {this.props.tree.reduce((memo, next, index) => {
          const group = [ <h2 key={0}>{next.header}</h2> ];
          next.tags.forEach((tag, index) =>
            group.push(
              <label className="item-filter-checkbox-label" key={index + 1}>
                <input
                  name={tag}
                  type="checkbox"
                  checked={this.props.tagMap[tag] || false}
                  onChange={this.handleInputChange}
                />
                {tag}
              </label>
            )
          );
          return [ ...memo, <li key={index} className="item-filter-group">{group}</li> ];
        }, [])}
      </ul>
    );
  }

}

export default ItemFilter;
