import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton';
import { setFormUsed, setUserCredentials, register } from '../../actions/register';
import './styles.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  get isValid() {
    const { usernameError, passwordError, repeatPasswordError } = this.props;
    return !(usernameError || passwordError || repeatPasswordError);
  }

  handleSubmit() {
    if (!this.props.formUsed) {
      this.props.setFormUsed()
    }
    if (!this.isValid) {
      return;
    }
    const { username, password } = this.props;
    this.props.register(username, password).then(res => {
      if (res.result === 'error') {
        return;
      }
      setTimeout(this.redirect, 2000)
    })
  }

  redirect() {
    this.props.history.push('/');
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.props.setUserCredentials(name, value)
  }

  render() {
    if (this.props.registrationSuccessful) {
      return <div className="registration-successful">Registration successful, redirecting...</div>
    }
    const { usernameError, passwordError, repeatPasswordError, formUsed } = this.props;
    return (
      <div className="register-container">
        <div className="registration-response-error">
          {this.props.responseError ? this.props.responseError : null}
        </div>
        <div>
          <div className="register-input-label">Username</div>
          <div className="register-input-container">
            <input
              type="text"
              name="username"
              className="register-input"
              value={this.props.username}
              onChange={this.handleInputChange}
            />
            <div className="register-error-message">
              {formUsed && usernameError ? usernameError : null}
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
              value={this.props.password}
              onChange={this.handleInputChange}
            />
            <div className="register-error-message">
              {formUsed && passwordError ? passwordError : null}
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
              value={this.props.repeatPassword}
              onChange={this.handleInputChange}
            />
            <div className="register-error-message">
              {formUsed && repeatPasswordError ? repeatPasswordError : null}
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

const mapStateToProps = state => ({
  usernameError: state.register.username ? null : 'Please enter a username',
  passwordError: state.register.password ? null : 'Please enter a password',
  repeatPasswordError: state.register.password === state.register.repeatPassword ?
    null : 'Passwords do not match',
  username: state.register.username,
  password: state.register.password,
  formUsed: state.register.formUsed,
  responseError: state.register.responseError,
  registrationSuccessful: state.register.registrationSuccessful
})

const mapDispatchToProps = {
  setUserCredentials,
  setFormUsed,
  register
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
