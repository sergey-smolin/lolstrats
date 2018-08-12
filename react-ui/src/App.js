import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import { connect } from 'react-redux';
import './App.css';
import Toolbar from './components/Toolbar/Toolbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SearchVideos from './components/Elements/Elements';
import AddVideos from './components/AddVideos/Elements/Elements';
import ListVideos from './components/Videos/Videos';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import {
  fetchUser,
  fetchItems,
  fetchChampions,
  fetchRunes,
  fetchCategories
} from './actions/rootActions';
import Modal from './components/Modal/Modal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalMessage: ''
    };
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
  setUserData(user) {
    this.setState({ user });
  }
  componentWillMount() {
    this.props.fetchUser();
    this.props.fetchItems();
    this.props.fetchChampions();
    this.props.fetchRunes();
    this.props.fetchCategories();
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
        {...this.props}
      />
    );
  }
  renderAddVideos(props) {
    return (
      <AddVideos
        {...props}
        {...this.props}
      />
    );
  }
  renderListVideos(props) {
    return (
      <ListVideos
        {...props}
        {...this.props}
      />
    );
  }
  renderLogIn(props) {
    return (
      <Login
        {...props}
        {...this.props}
      />
    );
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <Router>
            <div>
              <Toolbar {...this.props} />
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

const mapStateToProps = state => ({
  itemsLoading: state.itemsLoading,
  championsLoading: state.championsLoading,
  runesLoading: state.runesLoading,
  items: state.items,
  champions: state.champions,
  runes: state.runes,
  categories: state.categories,
  tree: state.tree,
  showLoader: state.showLoader,
  hideLoader: state.hideLoader,
  showModal: state.showModal,
  showStaticModal: state.showStaticModal,
  hideStaticModal: state.hideStaticModal,
  setUserData: state.setUserData,
  user: state.user
});

const mapDispacthToProps = {
  fetchUser,
  fetchItems,
  fetchChampions,
  fetchRunes,
  fetchCategories
};

export default connect(mapStateToProps, mapDispacthToProps)(App); 