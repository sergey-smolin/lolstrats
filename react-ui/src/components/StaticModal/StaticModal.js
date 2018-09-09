import React, { Component } from 'react';
import classnames from 'classnames'
import './styles.css';

class StaticModal extends Component {

  render() {
    return (
      <div
        className={classnames({
          'modal-container': true,
          'modal-container-visible': this.props.staticModalMessage
        })}
      >
        <div className="modal-window">
          {this.props.staticModalMessage}
        </div>
      </div>
    );
  }

}

export default StaticModal;
