import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import ActiveElements from '../../ActiveElements/ActiveElements';
import Categories from '../../Categories/Categories';
import ChampionList from '../../ChampionList/ChampionList';
import ItemFilter from '../../ItemFilter/ItemFilter';
import ItemList from '../../ItemList/ItemList';
import RunesFilter from '../../RunesFilter/RunesFilter';
import RunesList from '../../RunesList/RunesList';
import state from './state';
import './styles.css'
import {
  addActiveElement,
  removeActiveElement,
  addActiveCategory,
  removeActiveCategory
} from '../../../actions/elements';
import { addVideo } from '../../../actions/videos';

const TOOLBAR_HEIGHT = 80;
const INCOMPLETE_SUBMISSION = 'To submit a video you need to select: \n1) a Champion \n2) a combination of runes and items';
const SUBMITTING_A_VIDEO = 'The video is being submitted...';

class Elements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...state,
      fixedPosition: false,
      filteredChampions: this.props.champions,
      filteredItems: this.props.items
    };
    this.updateTagMap = this.updateTagMap.bind(this);
    this.updateRunesPath = this.updateRunesPath.bind(this);
    this.toggleActiveCategory = this.toggleActiveCategory.bind(this);
    this.addActiveCategory = this.addActiveCategory.bind(this);
    this.removeActiveCategory = this.removeActiveCategory.bind(this);
    this.addActiveElement = this.addActiveElement.bind(this);
    this.removeActiveElement = this.removeActiveElement.bind(this);
    this.addVideo = this.addVideo.bind(this);
    this.updateVideoURL = this.updateVideoURL.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.filterElements = this.filterElements.bind(this);
  }
  componentDidMount() {
    if (this.props.userLoaded && this.props.user === null) {
      this.props.history.replace('/login?redirect=add')
    }
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  componentDidUpdate() {
    if (this.props.userLoaded && this.props.user === null) {
      this.props.history.replace('/login?redirect=add')
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.champions.length && !this.state.filteredChampions.length) {
      this.setState({
        filteredChampions: newProps.champions
      })
    }
    if (newProps.items.length && !this.state.filteredItems.length) {
      this.setState({
        filteredItems: newProps.items
      })
    }
    if (this.props.user !== null && newProps.user === null) {
      this.props.history.replace('/login?redirect=add')
    }
  }
  handleScroll() {
    const { scrollTop } = document.documentElement;
    if (scrollTop > TOOLBAR_HEIGHT && !this.state.fixedPosition) {
      this.setState({ fixedPosition: true });
    } else if (scrollTop < TOOLBAR_HEIGHT && this.state.fixedPosition) {
      this.setState({ fixedPosition: false });
    }
  }
  updateTagMap(update) {
    this.setState(update);
  }
  updateRunesPath(update) {
    this.setState({ runesPath: update });
  }
  setActiveTab(activeTabIndex) {
    this.setState({
      activeTabIndex,
      elementsFilter: '',
      filteredChampions: this.props.champions,
      filteredItems: this.props.items
   });
  }
  toggleActiveCategory(category) {
    if (this.state.activeCategoriesMap[category.name]) {
      let index;
      this.state.activeCategories.find((cat, idx) => {
        if (cat.name === category.name) {
          index = idx;
          return true;
        }
        return false;
      })
      this.removeActiveCategory(index);
    } else {
      this.addActiveCategory(category);
    }
  }
  addActiveCategory(category) {
    if (this.props.activeCategoriesMap[category.id]) return;
    this.props.addActiveCategory(category);
  }
  removeActiveCategory(index) {
    this.props.removeActiveCategory(index);
  }
  addActiveElement(element, type) {
    if (this.props.activeElementsMap[type][element.id]) return;
    this.props.addActiveElement(element, type);
  }
  removeActiveElement(index) {
    this.props.removeActiveElement(index)
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
  filterElements(event) {
    const filter = event.target.value;
    this.setState({ elementsFilter: filter });
    switch(this.state.activeTabIndex) {
      case 0:
        this.setState({
          filteredChampions: this.props.champions
          .filter(champion => champion.name.toLowerCase().includes(filter.toLowerCase()))
        })
        break;
      case 1:
        this.setState({
          filteredItems: this.props.items
            .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
        });
        break;
      default:
    }
  }
  render() {
    const itemsTab = this.props.itemsLoading ? 'Loading...' :
      <div className="items-selector-container">
        <ItemFilter
          tree={this.props.tree}
        />
        <ItemList
          items={this.state.filteredItems}
          addActiveElement={this.addActiveElement}
        />
      </div>
    const championsTab = this.props.championsLoading ? 'Loading...' :
      <ChampionList
        champions={this.state.filteredChampions}
        addActiveElement={this.addActiveElement}
      />;
    const runesTab = this.props.runesLoading ? 'Loading...' :
      <div className="runes-selector-container">
        <RunesFilter
          runesPath={this.state.runesPath}
          updateRunesPath={this.updateRunesPath}
        />
        <RunesList
          runes={this.props.runes}
          runesPath={this.state.runesPath}
          addActiveElement={this.addActiveElement}
        />
      </div>
    const categoriesTab = this.props.categoriesLoaing ? 'Loading...' :
      <Categories
        categories={this.props.categories}
        activeCategoriesMap={this.state.activeCategoriesMap}
        toggleActiveCategory={this.toggleActiveCategory}
      />
    const elementsFilter = [0, 1].includes(this.state.activeTabIndex) ?
      <input className="elements-filter" type="text" value={this.state.elementsFilter}
        onChange={this.filterElements} placeholder="Filter..."/> : null;

    return (
      <div className="elements-container">
        <form>
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
          <div className={classnames({
            'tabs-container': true,
            'tabs-container-add-video-top-margin': this.state.fixedPosition
          })}>
            <div className="tabs-controls">
              <ul className="tabs">
                <li className="tab" onClick={() => this.setActiveTab(0)}>
                  Champions
                </li>
                <li className="tab" onClick={() => this.setActiveTab(1)}>
                  Items
                </li>
                <li className="tab" onClick={() => this.setActiveTab(2)}>
                  Runes
                </li>
                <li className="tab" onClick={() => this.setActiveTab(3)}>
                  Categories
                </li>
              </ul>
              {elementsFilter}
            </div>
            <ul className="tabContent">
              <div className={classnames({ 'tab-page': true, active: this.state.activeTabIndex === 0 })}>
                {championsTab}
              </div>
              <div className={classnames({ 'tab-page': true, active: this.state.activeTabIndex === 1 })} >
                {itemsTab}
              </div>
              <div className={classnames({ 'tab-page': true, active: this.state.activeTabIndex === 2 })} >
                {runesTab}
              </div>
              <div className={classnames({ 'tab-page': true, active: this.state.activeTabIndex === 3 })} >
                {categoriesTab}
              </div>
            </ul>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeElements: state.elements.activeElements,
  activeElementsMap: state.elements.activeElementsMap,
  activeCategories: state.elements.activeCategories,
  activeCategoriesMap: state.elements.activeCategoriesMap
});

const mapDispatchToProps = {
  addActiveElement,
  removeActiveElement,
  addActiveCategory,
  removeActiveCategory,
  addVideo
}

export default connect(mapStateToProps, mapDispatchToProps)(Elements);
