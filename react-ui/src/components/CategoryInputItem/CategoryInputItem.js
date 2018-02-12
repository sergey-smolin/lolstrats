import React, { Component } from 'react';
import './styles.css';

class CategoryInputItem extends Component {
  constructor(props) {
    super(props);
    this.toggleActiveCategory = this.toggleActiveCategory.bind(this);
  }
  toggleActiveCategory() {
    this.props.toggleActiveCategory(this.props.category);
  }

  render() {
    return (
      <li className="category-list-item">
        <label>
          <input
            type="checkbox"
            name={this.props.category.name}
            checked={this.props.activeCategoriesMap[this.props.category.name] || false}
            onChange={this.toggleActiveCategory}
          />
          {this.props.category.name}
        </label>
      </li>
    );
  }

}

export default CategoryInputItem;
