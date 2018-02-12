import React, { Component } from 'react';
import classnames from 'classnames'
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
          <div className="modal-button" onClick={this.props.hideModal}>OK</div>
        </div>
      </div>
    );
  }

}

export default Modal;
