import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { Link } from 'react-router-dom'
import './styles.css';

const CURRENT_PATCH = '8.3.1';

class VideoListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCategories: false
    };
    this.toggleCategories = this.toggleCategories.bind(this);
  }
  getElements() {
    return this.props.elementsNamesIds ? this.props.elementsNamesIds.map(data => {
      let result;
      if (data.type === 'champions') {
        result = `https://ddragon.leagueoflegends.com/cdn/${CURRENT_PATCH}/img/champion/${data.id}.png`;
      }
      if (data.type === 'items') {
        result = `https://ddragon.leagueoflegends.com/cdn/${CURRENT_PATCH}/img/item/${data.id}.png`;
      }
      if (data.type === 'runes') {
        result = `/images/runes/${data.id}.png`;
      }
      return result;
    }) : [];
  }
  toggleCategories() {
    this.setState({
      showCategories: !this.state.showCategories
    });
  }

  render() {
    const elements = this.getElements();
    const data = this.props.data || this.props.ytData;
    const build = this.props.ytData ?
      <div>
        <p>Build:</p>
        <ul className="video-elements-list">
          {elements.map((element, idx) => <li className="video-elements-list-item" key={idx}>
            <img key={idx} src={element} alt="Element Thumbnail"/>
          </li>)}
        </ul>
      </div> : null;
    const categories = this.props.ytData ? <div>
      <div className="show-categories-switch" onClick={this.toggleCategories}>
        <span className="show-categories-text">
          {this.state.showCategories ? 'Hide Categories' : 'Show Categories'}
        </span>
        <div className={classnames({
          'arrow-up': this.state.showCategories,
          'arrow-down': !this.state.showCategories
        })}></div>
      </div>
      {
        this.state.showCategories ?
        <ul>
          {this.props.categories
            .map(id => <li key={id}>{this.props.categoriesMap[id].name}</li>)}
        </ul> : null
      }
    </div> : null;
    return (
      <li className="video-result">
        <Link className="video-link" to={{
          pathname: `/video/${this.props.id}`,
          state: this.props.data
        }}>
          <img src={this.props.data.thumbnails.high.url} alt="video thumbnail" />
          <div className="playback-button">
            <div className="playback-button-triangle"></div>
          </div>
        </Link>
        <div className="video-meta-data">
          <p className="video-title">{this.props.data.title}</p>
          <p>{`Published on ${moment(data.publishedAt).format('MMM D, YYYY')}`}</p>
          <p>{`Author: ${data.channelTitle}`}</p>
          {build}
          {categories}
        </div>
      </li>
    );
  }

}

export default VideoListing;
