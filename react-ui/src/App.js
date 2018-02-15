import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import './App.css';
import Toolbar from './components/Toolbar/Toolbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SearchVideos from './components/Elements/Elements';
import AddVideos from './components/AddVideos/Elements/Elements';
import ListVideos from './components/Videos/Videos';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import Modal from './components/Modal/Modal';
import StaticModal from './components/StaticModal/StaticModal';
import Loader from './components/Loader/Loader';
import state from './state';

const SRID = 11;
const API_ENDPOINT_ITEMS = '/api/items';
const API_ENDPOINT_CHAMPIONS = '/api/champions';
const API_ENDPOINT_RUNES = '/api/runes';
const API_ENDPOINT_CATEGORIES = '/api/categories';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = state;
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.renderSearchVideos = this.renderSearchVideos.bind(this);
    this.renderAddVideos = this.renderAddVideos.bind(this);
    this.renderListVideos = this.renderListVideos.bind(this);
    this.renderLogIn = this.renderLogIn.bind(this);
    this.showStaticModal = this.showStaticModal.bind(this);
    this.hideStaticModal = this.hideStaticModal.bind(this);
    this.setUserData = this.setUserData.bind(this);
  }
  getCommonProps() {
    return {
      itemsLoading: this.state.itemsLoading,
      championsLoading: this.state.championsLoading,
      runesLoading: this.state.runesLoading,
      items: this.state.items,
      champions: this.state.champions,
      runes: this.state.runes,
      categories: this.state.categories,
      tree: this.state.tree,
      showLoader: this.showLoader,
      hideLoader: this.hideLoader,
      showModal: this.showModal,
      showStaticModal: this.showStaticModal,
      hideStaticModal: this.hideStaticModal,
      setUserData: this.setUserData,
      user: this.state.user
    };
  }
  setUserData(user) {
    this.setState({ user });
  }
  prepareChampionsData(json) {
    return Object.keys(json.data).map(key => json.data[key]);
  }
  componentWillMount() {
    fetch('/api/user', {
      credentials: 'include'
    }).then(res => res.json()).then(res => {
      if (res.result === 'success') {
        this.setState({ user: res.data });
      }
    });
    this.setState({
      itemsLoading: true,
      championsLoading: true,
      runesLoading: true,
      categoriesLoaing: true
    });
    fetch(API_ENDPOINT_ITEMS).then(res => res.json())
      .then(items => this.setState({
        itemsLoading: false,
        items: this.prepareSRItemData(items.data),
        tree: items.tree
      }));
    fetch(API_ENDPOINT_CHAMPIONS).then(res => res.json())
      .then(champions => this.setState({
        champions: this.prepareChampionsData(champions),
        championsLoading: false
      }));
    fetch(API_ENDPOINT_RUNES).then(res => res.json())
      .then(runes => this.setState({ runes, runesLoading: false }));
    fetch(API_ENDPOINT_CATEGORIES).then(res => res.json())
      .then(categories => this.setState({ categories, categoriesLoading: false }));
  }
  prepareSRItemData(data) {
    return Object.keys(data).reduce(
      (memo, next) => {
        const item = data[next];
        if (item.maps[SRID]) {
          item.description = `<description>${item.description}</description>`;
          return [ ...memo, item ];
        }
        return memo;
      },
    []);
  }
  showModal(modalMessage) {
    this.setState({ modalMessage });
  }
  hideModal() {
    this.setState({ modalMessage: null });
  }
  showStaticModal(lMessage) {
    this.setState({ lMessage });
  }
  hideStaticModal() {
    this.setState({ staticModalMessage: null });
  }
  renderSearchVideos(props) {
    return (
      <SearchVideos
        {...props}
        {...this.getCommonProps()}
      />
    );
  }
  renderAddVideos(props) {
    return (
      <AddVideos
        {...props}
        {...this.getCommonProps()}
      />
    );
  }
  renderListVideos(props) {
    return (
      <ListVideos
        {...props}
        {...this.getCommonProps()}
      />
    );
  }
  renderLogIn(props) {
    return (
      <Login
        {...props}
        {...this.getCommonProps()}
      />
    );
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <Router>
            <div>
              <Toolbar {...this.getCommonProps()} />
              <Route exact path="/" component={this.renderSearchVideos}/>
              <Route exact path="/login" component={this.renderLogIn}/>
              <Route exact path="/register" component={Register}/>
              <Route exact path="/add" component={this.renderAddVideos}/>
              <Route exact path="/videos/list" component={this.renderListVideos}/>
              <Route exact path="/video/:id" component={VideoPlayer}/>
            </div>
          </Router>
          <Modal
            modalMessage={this.state.modalMessage}
            hideModal={this.hideModal}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
