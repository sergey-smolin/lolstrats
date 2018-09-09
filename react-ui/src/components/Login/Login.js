import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { setUserData } from '../../actions/user';
import { setFormUsed, setUserCredentials, login } from '../../actions/login';
import RaisedButton from 'material-ui/RaisedButton';
import queryString from 'query-string';
import './styles.css';

class Login extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidUpdate(newProps) {
    if (newProps.user) {
      this.redirect();
    }
  }

  get isValid() {
    return !this.props.usernameError && !this.props.passwordError;
  }

  handleSubmit() {
    if (!this.props.formUsed) {
      this.props.setFormUsed()
    }
    if (!this.isValid) {
      return;
    }
    const { username, password } = this.props;
    this.props.login(username, password).then(res => {
      if (res.result === 'error') {
        return;
      }
      this.props.setUserData(res.data)
      this.redirect()
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
    this.props.setUserCredentials(name, value)
  }

  render() {
    const { formUsed, usernameError, passwordError } = this.props;
    return (
      <div className="register-container">
        {this.props.responseError ? this.props.responseError : null}
        <div>
          <div className="register-input-label">Username</div>
          <div className="register-input-container">
            <input
              type="text"
              name="username"
              className="register-input"
              value={this.props.username}
              onLoad={this.handleInputChange}
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

const mapStateToProps = state => ({
  usernameError: state.login.username ? null : 'Please enter a username',
  passwordError: state.login.password ? null : 'Please enter a password',
  username: state.login.username,
  password: state.login.password,
  formUsed: state.login.formUsed,
  responseError: state.login.responseError
})

const mapDispatchToProps = {
  setUserCredentials,
  setUserData,
  setFormUsed,
  login
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
