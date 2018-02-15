import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton';
import './styles.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        usernameError: '',
        passwordError: '',
        repeatPasswordError: '',
      },
      username: '',
      password: '',
      repeatPassword: '',
      registrationSuccessful: false,
      responseError: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.redirect = this.redirect.bind(this);
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
    if (this.state.repeatPassword === '') {
      stateUpdate = {
        ...stateUpdate,
        repeatPasswordError: 'Please repeat a password'
      }
    }
    if (this.state.password && this.state.repeatPassword && this.state.password !== this.state.repeatPassword) {
      stateUpdate = {
        ...stateUpdate,
        passwordError: 'Passwords do not match'
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
    fetch('/api/register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    }).then(res => res.json()).then(res => {
      if (res.result === 'error') {
        this.setState({ responseError: res.message });
      } else {
        this.setState({ registrationSuccessful: true });
        setTimeout(this.redirect, 2000);
      }
    })
  }

  redirect() {
    this.props.history.push('/');
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    if (this.state.registrationSuccessful) {
      return <div className="registration-successful">Registration successful, redirecting...</div>
    }
    const { usernameError, passwordError, repeatPasswordError } = this.state.errors;
    return (
      <div className="register-container">
        <div className="registration-response-error">
          {this.state.responseError ? this.state.responseError : null}
        </div>
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
        <div>
          <div className="register-input-label">Repeat Password</div>
          <div className="register-input-container">
            <input
              type="password"
              name="repeatPassword"
              className="register-input"
              value={this.state.repeatPassword}
              onChange={this.handleInputChange}
            />
            <div className="register-error-message">
              {repeatPasswordError ? repeatPasswordError : null}
            </div>
          </div>
        </div>
        <RaisedButton
          onClick={this.handleSubmit}
          label="Register"
          className="register-button"
          backgroundColor="#2c2f5d"
          labelColor="#ffffff"
        />
      </div>
    );
  }

}

export default withRouter(Register);
