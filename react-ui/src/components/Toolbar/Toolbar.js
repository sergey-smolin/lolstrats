import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import './styles.css';

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout() {
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    }).then(res => res.json()).then(res => {
      console.log(this);
      if (res.result === "error") {
        this.props.showModal("There was an error logging out");
      }
        this.props.showModal("Logged out successfully");
        this.props.setUserData(null);
        this.props.history.push('/');
    });
  }

  render() {
    const registerLink = this.props.user ?
      null :
      <div className="toolbar-flat-button">
        <Link className="flat-link toolbar-link" to="/register">Register</Link>
      </div>;
    const logoutLink = this.props.user ?
      <div className="toolbar-flat-button">
        <a className="toolbar-link" onClick={this.handleLogout}>Logout</a>
      </div> : null;
    const loginLink = this.props.user ?
      null :
      <div className="toolbar-flat-button">
        <Link className="flat-link toolbar-link" to="/login">Log in</Link>
      </div>;
    const userGreeting = this.props.user ?
        <div id="toolbar-user-greeting">{`Welcome, ${this.props.user.username}`}</div> : null;

    return (
      <div className="toolbar">
        <h1 className="app-title"><Link className="app-title-link" to="/">LoL Strats</Link></h1>
        <div className="toolbar-flat-button">
          <Link className="flat-link toolbar-link" to="/">Find videos</Link>
        </div>
        <div className="toolbar-flat-button">
          <Link className="flat-link toolbar-link" to="/add">Add a video</Link>
        </div>
        {registerLink}
        {loginLink}
        {logoutLink}
        {userGreeting}
      </div>
    );
  }

}

export default withRouter(Toolbar);
