import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import classnames from 'classnames';
import ActiveElements from '../ActiveElements/ActiveElements';
import ChampionList from '../ChampionList/ChampionList';
import Categories from '../Categories/Categories';
import ItemFilter from '../ItemFilter/ItemFilter';
import ItemList from '../ItemList/ItemList';
import RunesFilter from '../RunesFilter/RunesFilter';
import RunesList from '../RunesList/RunesList';
import Videos from '../Videos/Videos';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import state from './state.js';
import './styles.css';

const TOOLBAR_HEIGHT = 80;
const LIMITS_ENABLED = false;
const LOADING = 'Loading...';
// const CHAMPION_TYPE = 'champions';
// const ITEM_TYPE = 'items';
// const RUNE_TYPE = 'runes';
var esc = encodeURIComponent;

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
    this.searchVideos = this.searchVideos.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.closeVideoPlayer = this.closeVideoPlayer.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.filterElements = this.filterElements.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
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
  }
  handleScroll(event) {
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
  checkLimits(type) {
    switch(type) {
      case 'champions':
        if (this.state.activeCounts.champions === 1) return false;
        break;
      case 'items':
        if (this.state.activeCounts.items === 3) return false;
        break;
      case 'runes':
        if (this.state.activeCounts.runes === 3) return false;
        break;
      default:
        return true;
    }
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
    if (this.state.activeCategoriesMap[category.id]) return;
    if (LIMITS_ENABLED) {
      if (!this.checkLimits('categories')) {
        this.setState({ limitOverflow: true, limitOverflowMessage: 1 });
        return;
      }
    }
    const activeCategories = [ ...this.state.activeCategories, category ];
    this.setState({
      activeCategories,
      activeCounts: {
        ...this.state.activeCounts,
        categories: this.state.activeCounts.categories + 1
      },
      activeCategoriesMap: {
        ...this.state.activeCategoriesMap,
        [category.name]: true
      }
    });
  }
  removeActiveCategory(index) {
    const { name } = this.state.activeCategories.splice(index, 1)[0];
    const activeCategories = [ ...this.state.activeCategories ];
    this.setState({
      activeCategories,
      activeCounts: {
        ...this.state.activeCounts,
        categories: this.state.activeCounts.categories - 1
      },
      activeCategoriesMap: {
        ...this.state.activeCategoriesMap,
        [name]: false
      }
    });
  }
  addActiveElement(element, type) {
    if (this.state.activeElementsMap[type][element.id]) return;
    if (LIMITS_ENABLED) {
      if (!this.checkLimits(type)) {
        this.setState({ limitOverflow: true, limitOverflowMessage: 1 });
        return;
      }
    }
    const activeElements = [ ...this.state.activeElements, { type, data: element } ];
    this.setState({
      activeElements,
      activeCounts: {
        ...this.state.activeCounts,
        [type]: this.state.activeCounts[type] + 1
      },
      activeElementsMap: {
        ...this.state.activeElementsMap,
        [type]: {
          ...this.state.activeElementsMap[type],
          [element.id]: true
        }
      }
    });
  }
  removeActiveElement(index) {
    const { type, data } = this.state.activeElements.splice(index, 1)[0];
    const activeElements = [ ...this.state.activeElements ];
    this.setState({
      activeElements,
      activeCounts: {
        ...this.state.activeCounts,
        [type]: this.state.activeCounts[type] - 1
      },
      activeElementsMap: {
        ...this.state.activeElementsMap,
        [type]: {
          ...this.state.activeElementsMap[type],
          [data.id]: false
        }
      }
    });
  }
  createSearchQuery() {
    const initialData = this.state.activeElements.reduce(
      (memo, { type, data }) => {
        if (type === 'champions') {
          memo.champions.push(parseInt(data.key, 10));
        } else {
          memo[type].push(data.id);
        }
        return memo;
      },
      {
          champions: [],
          items: [],
          runes: []
      });

    initialData.categories = [
      ...this.state.activeCategories.map(category => category.id)
    ];

    const finalData = Object.keys(initialData).reduce((memo, next) => {
      if (initialData[next].length === 0) return memo;
      return { ...memo, [next]: initialData[next] };
    }, {});

    const result = Object.keys(finalData).map(key =>
      `${key}=${esc(finalData[key].join(','))}`, '').join('&');

    return result;
  }
  searchVideos(query) {
    this.props.history.push('/videos/list?' + this.createSearchQuery());
  }
  playVideo(id, data) {
    this.setState({ playVideo: { id, data } });
  }
  closeVideoPlayer() {
    this.setState({ playVideo: {} });
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
          updateTagMap={this.updateTagMap}
          tree={this.props.tree}
          tagMap={this.state.tagMap}
        />
        <ItemList
          items={this.state.filteredItems}
          activeTags={this.state.activeTags}
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
    const videos = this.state.videos.length || this.state.youtubeVideos.length ?
      <Videos
        {...this.props}
        videos={this.state.videos}
        youtubeVideos={this.state.youtubeVideos}
        closeVideoResults={this.closeVideoResults}
        playVideo={this.playVideo}
      /> : null;
    const playVideo = this.state.playVideo.id ?
      <VideoPlayer
        id={this.state.playVideo.id}
        data={this.state.playVideo.data}
        closeVideoPlayer={this.closeVideoPlayer}
      /> : null;
    const elementsFilter = [0, 1].includes(this.state.activeTabIndex) ?
      <input className="elements-filter" type="text" value={this.state.elementsFilter}
        onChange={this.filterElements} placeholder="Filter..."/> : null;

    return (
      <div className="elements-container">
        <ActiveElements
          elements={this.state.activeElements}
          categories={this.state.activeCategories}
          removeActiveElement={this.removeActiveElement}
          removeActiveCategory={this.removeActiveCategory}
          searchVideos={this.searchVideos}
          fixedPosition={this.state.fixedPosition}
        />
        <div className={classnames({
          'tabs-container': true,
          'tabs-container-top-margin': this.state.fixedPosition
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
            <div className={classnames({ 'tab-page': true, active: this.state.activeTabIndex === 1 })}>
              {itemsTab}
            </div>
            <div className={classnames({ 'tab-page': true, active: this.state.activeTabIndex === 2 })}>
              {runesTab}
            </div>
            <div className={classnames({ 'tab-page': true, active: this.state.activeTabIndex === 3 })}>
              {categoriesTab}
            </div>
          </ul>
        </div>
        {videos}
        {playVideo}
      </div>
    );
  }
}

export default withRouter(Elements);
