import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton';
import queryString from 'query-string';
import './styles.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        usernameError: '',
        passwordError: '',
      },
      username: '',
      password: '',
      responseError: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user) {
      this.redirect();
    }
  }

  validateInputs() {
    let stateUpdate = {};
    if (this.state.username === '') {
      stateUpdate = {
        ...stateUpdate,
        usernameError: 'Please enter a username'
      }
    }
    if (this.state.password === '') {
      stateUpdate = {
        ...stateUpdate,
        passwordError: 'Please enter a password'
      }
    }
    if (Object.keys(stateUpdate).length) {
      this.setState({ errors: stateUpdate });
      return false;
    }
    return true;
  }

  handleSubmit() {
    if (!this.validateInputs()) {
      return;
    }
    fetch('/api/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    }).then(res => res.json()).then(res => {
      if (res.result === 'error') {
        this.setState({ responseError: res.message });
      } else {
        this.props.setUserData(res.data);
        this.redirect();
      }
    })
  }

  redirect() {
    let { search } = this.props.location;
    if (!search) {
      this.props.history.replace('/');
    } else {
      search = search.slice(1);
      const redirect = queryString.parse(search).redirect;
      this.props.history.replace(`/${redirect}`);
    }
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    const { usernameError, passwordError } = this.state.errors;
    return (
      <div className="register-container">
        {this.state.responseError ? this.state.responseError : null}
        <div>
          <div className="register-input-label">Username</div>
          <div className="register-input-container">
            <input
              type="text"
              name="username"
              className="register-input"
              value={this.state.username}
              onChange={this.handleInputChange}
            />
            <div className="register-error-message">
              {usernameError ? usernameError : null}
            </div>
          </div>
        </div>
        <div>
          <div className="register-input-label">Password</div>
          <div className="register-input-container">
            <input
              type="password"
              name="password"
              className="register-input"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
            <div className="register-error-message">
              {passwordError ? passwordError : null}
            </div>
          </div>
        </div>
        <RaisedButton
          onClick={this.handleSubmit}
          label="Log in"
          className="register-button"
          backgroundColor="#2c2f5d"
          labelColor="#ffffff"
        />
      </div>
    );
  }

}

export default withRouter(Login);
