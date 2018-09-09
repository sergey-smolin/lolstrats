import React, { Component } from 'react';
import classnames from 'classnames';
import Categories from '../Categories/Categories';
import ChampionList from '../ChampionList/ChampionList';
import ItemFilter from '../ItemFilter/ItemFilter';
import ItemList from '../ItemList/ItemList';
import RunesFilter from '../RunesFilter/RunesFilter';
import RunesList from '../RunesList/RunesList';

const TOOLBAR_HEIGHT = 80;

class Elements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fixedPosition: false,
      activeTabIndex: 0,
      runesPath: 'Precision'
    };
    this.updateRunesPath = this.updateRunesPath.bind(this);
    this.toggleActiveCategory = this.toggleActiveCategory.bind(this);
    this.addActiveCategory = this.addActiveCategory.bind(this);
    this.removeActiveCategory = this.removeActiveCategory.bind(this);
    this.addActiveElement = this.addActiveElement.bind(this);
    this.removeActiveElement = this.removeActiveElement.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.filterElements = this.filterElements.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll() {
    const { scrollTop } = document.documentElement;
    if (scrollTop > TOOLBAR_HEIGHT && !this.state.fixedPosition) {
      this.setState({ fixedPosition: true });
    } else if (scrollTop < TOOLBAR_HEIGHT && this.state.fixedPosition) {
      this.setState({ fixedPosition: false });
    }
  }
  updateRunesPath(update) {
    this.setState({ runesPath: update });
  }
  setActiveTab(activeTabIndex) {
    this.setState({ activeTabIndex });
    this.props.filterChampions('');
    this.props.filterItems('');
    this.props.setElementsFilter('');
  }
  toggleActiveCategory(category) {
    if (this.props.activeCategoriesMap[category.name]) {
      let index;
      this.props.activeCategories.find((cat, idx) => {
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
  filterElements(event) {
    const filter = event.target.value;
    this.props.setElementsFilter(filter);
    switch(this.state.activeTabIndex) {
      case 0:
        this.props.filterChampions(filter)
        break;
      case 1:
        this.props.filterItems(filter)
        break;
      default:
    }
  }
  renderTabs(marginClassName) {
    const itemsTab = this.props.itemsLoading ? 'Loading...' :
      <div className="items-selector-container">
        <ItemFilter tree={this.props.tree} />
        <ItemList addActiveElement={this.addActiveElement} />
      </div>
    const championsTab = this.props.championsLoading ? 'Loading...' :
      <ChampionList
        champions={this.props.filteredChampions}
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
        activeCategoriesMap={this.props.activeCategoriesMap}
        toggleActiveCategory={this.toggleActiveCategory}
      />
    const elementsFilter = [0, 1].includes(this.state.activeTabIndex) ?
      <input className="elements-filter" type="text" value={this.props.elementsFilter}
        onChange={this.filterElements} placeholder="Filter..."/> : null;
    
    return <div className={classnames({
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
  }
}

export default Elements;
