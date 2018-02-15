import React, { Component } from 'react';
import classnames from 'classnames'
import RaisedButton from 'material-ui/RaisedButton';
import './styles.css';

class Modal extends Component {

  render() {
    return (
      <div
        className={classnames({
          'modal-container': true,
          'modal-container-visible': this.props.modalMessage
        })}
      >
        <div className="modal-window">
          {this.props.modalMessage}
          <RaisedButton
            onClick={this.props.hideModal}
            className="modal-button"
            label="OK"
            backgroundColor="#2c2f5d"
            labelColor="#ffffff"
          />
        </div>
      </div>
    );
  }

}

export default Modal;
