import React from 'react';
import { connect } from 'react-redux';
import Elements from '../Elements/Elements';
import ActiveElements from '../ActiveElements/ActiveElements';
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
        {this.renderTabs('tabs-container-top-margin')}
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
