import React, { Component } from 'react';
import classnames from 'classnames'
import './styles.css';

class StaticModal extends Component {

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
        </div>
      </div>
    );
  }

}

export default StaticModal;
