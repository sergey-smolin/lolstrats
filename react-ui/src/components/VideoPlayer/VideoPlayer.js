import React, { Component } from 'react';
import './styles.css';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      error: false,
      errorMessage: ''
    }
  }
  componentWillMount() {
    if (!this.props.location.state) {
      this.getVideoData();
    } else {
      this.setState({ data: this.props.location.state });
    }
  }
  getVideoData() {
    fetch(`/api/video/${this.props.match.params.id}`).then(res => res.json())
      .then(response => {
        if (response.error) {
          this.setState({ error: true, errorMessage: response.message })
        } else {
          this.setState({ data: response.data });
        }
      });
  }

  render() {
    if (!Object.keys(this.state.data).length) return null;
    if (this.state.error) {
      return this.state.errorMessage;
    }
    return (
      <div className="video-player-container">
        <div className="video-player">
          <iframe width="480" height="360"
            title={this.state.data.title}
            src={`https://www.youtube.com/embed/${this.props.match.params.id}?rel=0&autoplay=true`} allowFullScreen>
          </iframe>
          <h2>{this.state.data.title}</h2>
        </div>
      </div>
    );
  }

}

export default VideoPlayer;
