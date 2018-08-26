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
import { fetchUser, setUserData } from './actions/user';
import { fetchItems, fetchChampions, fetchRunes, fetchCategories, allElementsLoaded } from './actions/rootActions';
import Modal from './components/Modal/Modal';
import StaticModal from './components/StaticModal/StaticModal';

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
    this.props.setUserData(user);
  }
  componentWillMount() {
    this.props.fetchUser();
    Promise.all([
      this.props.fetchItems(),
      this.props.fetchChampions(),
      this.props.fetchRunes(),
      this.props.fetchCategories(),
    ]).then(() => {
      this.props.allElementsLoaded()
    })
  }
  showModal(modalMessage) {
    this.setState({ modalMessage });
  }
  hideModal() {
    this.setState({ modalMessage: null });
  }
  showStaticModal(staticModalMessage) {
    this.setState({ staticModalMessage });
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
        showModal={this.showModal} 
        showStaticModal={this.showStaticModal}
        hideStaticModal={this.hideStaticModal}
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
        setUserData={this.setUserData}
      />
    );
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <Router>
            <div>
              <Toolbar {...this.props} user={this.props.user || this.state.user} showModal={this.showModal} setUserData={this.setUserData} />
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
          <StaticModal
            staticModalMessage={this.state.staticModalMessage}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  items: state.root.items,
  itemsLoading: state.root.itemsLoading,
  champions: state.root.champions,
  championsLoading: state.root.championsLoading,
  runes: state.root.runes,
  runesLoading: state.root.runesLoading,
  categories: state.root.categories,
  categoriesLoading: state.root.categoriesLoading,
  tree: state.root.tree,
  user: state.user.user
});

const mapDispacthToProps = {
  fetchUser,
  fetchItems,
  fetchChampions,
  fetchRunes,
  fetchCategories,
  allElementsLoaded,
  setUserData
};

export default connect(mapStateToProps, mapDispacthToProps)(App); 