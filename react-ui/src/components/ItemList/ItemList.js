import React, { Component } from 'react';
import ItemListItem from '../ItemListItem/ItemListItem';
import './styles.css';

class ItemList extends Component {
  render() {
    const jsx = this.props.items
      .reduce((memo, next) => {
          if (!next.tags) return memo;
          const pass = this.props.activeTags
            .every(tag => next.tags.map(tag => tag.toUpperCase()).includes(tag));
          if (pass) {
            return [
              ...memo,
              <ItemListItem
                {...this.props}
                key={next.id}
                item={next}
              />
            ];
          }
          return memo;
        }
      , [])
    return (
      <ul className="item-list">{jsx}</ul>
    );
  }

}

export default ItemList;
