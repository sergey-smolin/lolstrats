import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Elements from '../Elements/Elements';
import ActiveElements from '../ActiveElements/ActiveElements';
import ChampionList from '../ChampionList/ChampionList';
import Categories from '../Categories/Categories';
import ItemFilter from '../ItemFilter/ItemFilter';
import ItemList from '../ItemList/ItemList';
import RunesFilter from '../RunesFilter/RunesFilter';
import RunesList from '../RunesList/RunesList';
import './styles.css';
import { filterChampions } from '../../actions/champions';
import { filterItems } from '../../actions/items';
import {
  addActiveElement,
  removeActiveElement,
  addActiveCategory,
  removeActiveCategory,
  setElementsFilter
} from '../../actions/elements';

const esc = encodeURIComponent;

class SearchVideosElements extends Elements {
  constructor(props) {
    super(props);
    this.updateTagMap = this.updateTagMap.bind(this);
    this.searchVideos = this.searchVideos.bind(this);
  }
  updateTagMap(update) {
    this.setState(update);
  }
  createSearchQuery() {
    const initialData = this.props.activeElements.reduce(
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
      ...this.props.activeCategories.map(category => category.id)
    ];

    const finalData = Object.keys(initialData).reduce((memo, next) => {
      if (initialData[next].length === 0) return memo;
      return { ...memo, [next]: initialData[next] };
    }, {});

    const result = Object.keys(finalData).map(key =>
      `${key}=${esc(finalData[key].join(','))}`, '').join('&');

    return result;
  }
  searchVideos() {
    this.props.history.push('/videos/list?' + this.createSearchQuery());
  }
  render() {
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

    return (
      <div className="elements-container">
        <ActiveElements
          elements={this.props.activeElements}
          categories={this.props.activeCategories}
          removeActiveElement={this.removeActiveElement}
          removeActiveCategory={this.removeActiveCategory}
          actionButtonCallback={this.searchVideos}
          searchCriteriaText="Click on icons below to create a build to search"
          actionButtonText="Search"
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
  filteredItems: state.items.filteredChampions
});

const mapDispatchToProps = {
  addActiveElement,
  removeActiveElement,
  addActiveCategory,
  removeActiveCategory,
  setElementsFilter,
  filterChampions,
  filterItems
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchVideosElements);
