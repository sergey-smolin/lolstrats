import React, { Component } from 'react';
import './styles.css';
import RefreshIndicator from 'material-ui/RefreshIndicator';

class ItemListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
    this.addActiveElement = this.addActiveElement.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }
  createEntry() {
    const data = this.props.item;
    const parser = new DOMParser();
    const replace_re = /<br>/g
    const replace_double = /<br><br>/g
    const xmlDoc = parser.parseFromString(data.description.replace(replace_double, '<br/>')
      .replace(replace_re, '<br/>'), "text/xml");
    const reactifyXML = (collection) => {
      return Array.prototype.map.call(collection, (elem, i) => {
        switch (elem.nodeName) {
          case '#text':
            return <span key={i}>{elem.nodeValue}</span>;
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
            if (elem.childNodes.length === 1 && elem.childNodes[0].nodeName === '#text') {
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
  showTooltip(event) {
    const tooltip = event.currentTarget.getElementsByClassName('item-list-item-tooltip')[0];
    tooltip.style.display = 'block';
  }
  hideTooltip(event) {
    const tooltip = event.currentTarget.getElementsByClassName('item-list-item-tooltip')[0];
    tooltip.style.display = 'none';
  }
  moveTooltip(event) {
    const d = document.documentElement;
    const rightBound = d.clientWidth;
    const bottomBound = d.clientHeight;
    const target = event.currentTarget;
    const tooltip = target.getElementsByClassName('item-list-item-tooltip')[0];
    const rect = tooltip.getBoundingClientRect();
    const { nativeEvent } = event;
    let newTop = nativeEvent.clientY + 10;
    let newLeft = nativeEvent.clientX + 10;
    const newBottom = newTop + rect.height;
    const newRight = newLeft + rect.width;
    if (newBottom > bottomBound) {
      newTop = nativeEvent.clientY - 10 - rect.height;
    }
    if (newRight > rightBound) {
      newLeft = nativeEvent.clientX - 10 - rect.width;
    }
    tooltip.style.top = `${newTop}px`;
    tooltip.style.left = `${newLeft}px`;
  }
  addActiveElement() {
    this.props.addActiveElement(this.props.item, 'items');
  }
  handleLoad() {
    this.setState({ loaded: true });
  }

  render() {
    return (
      <li
        key={this.props.item.id}
        className="item-list-item"
        onClick={this.addActiveElement}
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.hideTooltip}
        onMouseMove={this.moveTooltip}
      >
        <div className="item-image-container">
          <img
            className="item-image"
            onLoad={this.handleLoad}
            src={`https://ddragon.leagueoflegends.com/cdn/8.2.1/img/item/${this.props.item.id}.png`}
            alt="item thumbnail"
          />
          { this.state.loaded ? null :
            <RefreshIndicator
            top={12}
            left={12}
            status={this.state.loaded ? 'hide' : 'loading'}
          />
          }
          {this.createEntry()}
        </div>
      </li>
    );
  }

}

export default ItemListItem;
