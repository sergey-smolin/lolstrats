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

const TOOLBAR_HEIGHT = 80;
const LIMITS_ENABLED = false;
const INCOMPLETE_SUBMISSION = 'To submit a video you need to select: \n1) a Champion \n2) a combination of runes and items';
const SUBMITTING_A_VIDEO = 'The video is being submitted...';
const API_OPERATION_SUCCESS = 'success';

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
  componentWillMount() {
    if (this.props.user === null) {
      this.props.history.replace('/login?redirect=add')
    }
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
    if (this.props.user !== null && newProps.user === null) {
      this.props.history.replace('/login?redirect=add')
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
    const elements = this.state.activeElements.reduce((memo, next) => {
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
      ...this.state.activeCategories.map(category => category.id)
    ];

    if (!elements.champions.length ||
      (!elements.items.length && !elements.runes.length && !elements.categories.length)) {
        this.props.showModal(INCOMPLETE_SUBMISSION);
        return;
      }
    const body = { ...elements, elementsNamesIds, id: videoId };
    this.props.showStaticModal(SUBMITTING_A_VIDEO);
    fetch('/api/videos/add', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(body)
    }).then(res => res.json())
    .then(json => {
      this.props.hideStaticModal(SUBMITTING_A_VIDEO);
      if (json.result === API_OPERATION_SUCCESS) {
        this.setState({
          activeElements: [],
          activeElementsMap: {
            champions: {},
            items: {},
            runes: {}
          },
          activeCategories: [],
          activeCategoriesMap: {},
          videoURL: ''
        })
      }
      this.props.showModal(json.message);
    })
    .catch(err => err);
  }
  getVideoId(url) {
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
              categories={this.state.activeCategories}
              elements={this.state.activeElements}
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
  removeActiveCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(Elements);
