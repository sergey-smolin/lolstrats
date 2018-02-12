import React, { Component } from 'react';
import classnames from 'classnames';
import './styles.css';

class ActiveElements extends Component {
  createChampionElement(data) {
    // hover effect for runes
  }
  createItemElement(data) {
    const parser = new DOMParser();
    const replace_re = /<br>/g
    const replace_double = /<br><br>/g
    const xmlDoc = parser.parseFromString(data.description.replace(replace_double, '<br/>')
      .replace(replace_re, '<br/>'), "text/xml");
    const reactifyXML = (collection) => {
      return Array.prototype.map.call(collection, (elem, i) => {
        switch (elem.nodeName) {
          case '#text':
            return <div key={i}>{elem.nodeValue}</div>;
          case 'br':
            return <br key={i}/>;
          case 'hr':
            return <hr key={i}/>;
          case 'u':
            return <span key={i} className={`item-description-class-underline`}>{elem.textContent}</span>
          case 'i':
            return <span key={i} className={`item-description-class-italic`}>{elem.textContent}</span>
          case 'a':
            return <span key={i} className={`item-description-class-ancor`}>{elem.textContent}</span>
          default:
            if (elem.childNodes[0] && elem.childNodes[0].nodeName === '#text') {
              return <span key={i} className={`item-description-class-${elem.nodeName}`}>{elem.textContent}</span>
            }
            return <span
              key={i}
              className={`item-description-class-${elem.nodeName}`}
            >
              {reactifyXML(elem.childNodes)}
            </span>
        }
      });
    }
    const desc = reactifyXML(xmlDoc.documentElement.childNodes);
    return <div className="item-list-item-tooltip">
      <p>{data.name}</p>
      {desc}
    </div>;
  }
  createRuneElement() {
    // hover effect for runes
  }
  render() {
    const jsx = this.props.elements.map(({ type, data }, idx) => {
      let element;
      let src;
      switch (type) {
        case 'champions':
          element = this.createChampionElement(data);
          src = `https://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/${data.id}.png`;
          break;
        case 'items':
          element = this.createItemElement(data);
          src = `https://ddragon.leagueoflegends.com/cdn/7.24.1/img/item/${data.id}.png`;
          break;
        case 'runes':
          element = this.createRuneElement(data);
          src = `/images/runes/${data.id}.png`
          break;
        default:
      }
      return <li key={idx} className="active-elements-list-item">
        <div
          className="close-button-container remove-active-element-button-container"
          onClick={() => this.props.removeActiveElement(idx)}
        >
          <div className="close-button"></div>
        </div>
        <img className="active-element-image" src={src} alt="element thumbnail" />
        {element}
      </li>;
    })
    if (this.props.categories.length) {
      jsx.push(<li key={jsx.length} className="active-elements-list-item">
        <div className="category-icon">
          <div className="category-icon-text">
            <div>Cate</div>
            <div>gori</div>
            <div className="categories-icon-arrow-container">es<div className="arrow-down"></div></div>
          </div>
          <ul>
            {this.props.categories.map((category, idx) => <li key={idx}>
              <span>
                {category.name}
              </span>
              <div
                className="category-close-button-container close-button-container"
                onClick={() => this.props.removeActiveCategory(idx)}
              >
                <div className="close-button"></div>
              </div>
            </li>)}
          </ul>
        </div>
      </li>);
    }
    return (
      <div className={classnames({
        'active-elements-container': true,
        'active-elements-container-fixed-position': this.props.fixedPosition
      })}>
        <ul className="active-elements">
          {jsx}
        </ul>
        <div className="search-videos-button" onClick={this.props.searchVideos}>
          Search
        </div>
      </div>
    );
  }

}

export default ActiveElements;
