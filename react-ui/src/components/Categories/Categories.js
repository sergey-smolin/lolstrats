import React, { Component } from 'react';
import CategoryInputItem from '../CategoryInputItem/CategoryInputItem';
import './styles.css';

class Categories extends Component {

  render() {
    return (
      <div>
        <ul>
          {this.props.categories.map((category, idx) => {
            const name = Object.keys(category)[0];
            return (
              <li key={idx}>
                {name}
                <ul>
                  {category[name].map((category, idx) =>
                    <CategoryInputItem
                      {...this.props} key={idx} category={category}
                    />
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

}

export default Categories;
