import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Elements from '../Elements/Elements'
import ActiveElements from '../ActiveElements/ActiveElements';
import { filterChampions } from '../../actions/champions';
import { filterItems } from '../../actions/items';
import {
  addActiveElement,
  removeActiveElement,
  addActiveCategory,
  removeActiveCategory,
  setElementsFilter
} from '../../actions/elements';
import { addVideo } from '../../actions/videos';
import './styles.css'

const INCOMPLETE_SUBMISSION = 'To submit a video you need to select: \n1) a Champion \n2) a combination of runes and items';
const SUBMITTING_A_VIDEO = 'The video is being submitted...';

class AddVideosElements extends Elements {
  constructor(props) {
    super(props);
    this.state.urlError = false;
    this.addVideo = this.addVideo.bind(this);
    this.updateVideoURL = this.updateVideoURL.bind(this);
  }
  componentDidMount() {
    super.componentDidMount();
    if (this.props.userLoaded && this.props.user === null) {
      this.props.history.replace('/login?redirect=add')
    }
  }
  componentDidUpdate() {
    if (this.props.userLoaded && this.props.user === null) {
      this.props.history.replace('/login?redirect=add')
    }
  }
  updateVideoURL(event) {
    const { value } = event.target;
    this.setState({ videoURL: value });
  }
  addVideo() {
    this.setState({ urlError: false });
    const videoId = this.getVideoId();
    if (!videoId) {
      this.setState({ urlError: true });
      return;
    };
    const elementsNamesIds = [];
    const elements = this.props.activeElements.reduce((memo, next) => {
      if (next.type === 'champions') {
        memo.champions.push(String(next.data.key));
      } else {
        memo[next.type].push(String(next.data.id));
      }
      elementsNamesIds.push({
        type: next.type,
        id: next.data.id,
        name: next.data.name
      });
      return memo;
    }, {
      champions: [],
      items: [],
      runes: [],
    });

    elements.categories = [
      ...this.props.activeCategories.map(category => category.id)
    ];

    if (!elements.champions.length ||
      (!elements.items.length && !elements.runes.length && !elements.categories.length)) {
        this.props.showModal(INCOMPLETE_SUBMISSION);
        return;
      }
    const body = { ...elements, elementsNamesIds, id: videoId };
    this.props.showStaticModal(SUBMITTING_A_VIDEO);
    this.props.addVideo(body).then(json => {
      this.props.hideStaticModal();
      this.props.showModal(json.message);
    })
  }
  getVideoId() {
    const result = /^(https?:\/\/)?(www\.youtube\.com\/watch\?(.*&)?v=([^&]+))|(youtu.be\/([^&]+))/g
      .exec(this.state.videoURL);
    if (!result) return false;
    return result[4] || result[6];
  }

  render() {
    return (
      <div className="elements-container">
        <div className={classnames({
          'add-video-controls': true,
          'add-video-controls-fixed-position': this.state.fixedPosition
        })}>
          <div className="video-url-input-container">
            <label>
              <input
                type="text"
                name="videoURL"
                value={this.state.videoURL}
                className={classnames({ 'input-error': this.state.urlError })}
                onChange={this.updateVideoURL}
              />
              Youtube Video URL
            </label>
            {
              this.state.urlError && <div className="url-error">
                Please enter a valid YouTube video url!
              </div>
            }
          </div>
          <ActiveElements
            categories={this.props.activeCategories}
            elements={this.props.activeElements}
            removeActiveElement={this.removeActiveElement}
            removeActiveCategory={this.removeActiveCategory}
            searchCriteriaText="Click on icons below to specify a build"
            actionButtonCallback={this.addVideo}
            actionButtonText="Add"
          />
        </div>
        {this.renderTabs('tabs-container-add-video-top-margin')}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeElements: state.elements.activeElements,
  activeElementsMap: state.elements.activeElementsMap,
  activeCategories: state.elements.activeCategories,
  activeCategoriesMap: state.elements.activeCategoriesMap,
  elementsFilter: state.elements.elementsFilter,
  filteredChampions: state.champions.filteredChampions,
  filteredItems: state.items.filteredChampions,
  userLoaded: state.user.userLoaded
});

const mapDispatchToProps = {
  addActiveElement,
  removeActiveElement,
  addActiveCategory,
  removeActiveCategory,
  addVideo,
  setElementsFilter,
  filterChampions,
  filterItems
}

export default connect(mapStateToProps, mapDispatchToProps)(AddVideosElements);
