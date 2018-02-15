import React, { Component } from 'react';
import classnames from 'classnames';
import './styles.css';

class VideosElements extends Component {
  render() {
    if (!this.props.champions.length) {
      return null;
    }
    const jsx = Object.keys(this.props.parsedQuery).reduce((memo, next, idx) => {
      if (next === 'categories') {
        return memo;
      }
      const elementsArray = this.props.parsedQuery[next].split(',');
      const elements = elementsArray.map(element => {
        let src;
        switch(next) {
          case 'champions':
            const champion = this.props.champions.find(champion => champion.key === element);
            src = `https://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/${champion.id}.png`;
            break;
          case 'items':
            src = `https://ddragon.leagueoflegends.com/cdn/7.24.1/img/item/${element}.png`;
            break;
          case 'runes':
            src = `/images/runes/${element}.png`;
            break;
          default:
        }
        return (
          <li key={memo.length + idx} className="active-elements-list-item">
            <img className="active-element-image" src={src} alt="element thumbnail" />
          </li>
        );
      });
      return [ ...memo, ...elements ];
    }, []);
    if (this.props.parsedQuery.categories && this.props.parsedQuery.categories.length) {
      jsx.push(<li key={jsx.length} className="active-elements-list-item">
        <div className="category-icon">
          <div className="category-icon-text">
            <div>Cate</div>
            <div>gori</div>
            <div className="categories-icon-arrow-container">es<div className="arrow-down"></div></div>
          </div>
          <ul>
            {this.props.parsedQuery.categories.split(',').map((category, idx) => <li key={idx}>
              <span>
                {this.props.categoriesMap[category].name}
              </span>
            </li>)}
          </ul>
        </div>
      </li>);
    }
    return (
      <div className="requested-elements-display">
        <div className="requested-elements-display-title">
          You searched for:
        </div>
        <div className={classnames({
          'active-elements-container': true,
        })}>
          <ul className="active-elements">
            {jsx}
          </ul>
        </div>
      </div>
    );
  }

}

export default VideosElements;
