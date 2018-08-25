import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import VideoListing from '../VideoListing/VideoListing';
import VideosElements from '../VideosElements/VideosElements';
import { fetchVideos } from '../../actions/videos';
import './styles.css';

class Videos extends Component {
  componentDidMount() {
    if (this.props.allElementsLoaded) {
      this.getVideos();
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.allElementsLoaded && this.props.allElementsLoaded) {
      this.getVideos();
    }
  }
  getVideos(props) {
    const query = '/api/videos?' + this.props.location.search.slice(1);
    const ytQuery = `League of Legends ${this.createYTSearchQuery()}`;
    this.props.fetchVideos(query, ytQuery);
  }
  createYTSearchQuery() {
    const props = this.props;
    const parsedQuery = queryString.parse(props.location.search);
    return Object.keys(parsedQuery).map(prop => {
      if (prop === 'champions') {
        return props.champions
          .reduce((memo, next) => {
            if (parsedQuery[prop].split(',').includes(next.key)) {
              return [ ...memo, next.name ];
            }
            return memo;
          }, []).join(' ');
      } else if (prop === 'items') {
        return props.items
          .reduce((memo, next) => {
            if (parsedQuery[prop].split(',').includes(next.id.toString())) {
              return [ ...memo, next.name ];
            }
            return memo;
          }, []).join(' ');
      } else if (prop === 'runes') {
        return props.runes
          .reduce((memo, next) => {
            if (parsedQuery[prop].split(',').includes(next.id.toString())) {
              return [ ...memo, next.name ];
            }
            return memo;
          }, []).join(' ');
      } else if (prop === 'categories') {
        return parsedQuery[prop].split(',').map(id => props.categoriesMap[id]).join(' ');
      }
      return '';
    }).join(' ');
  }
  handleLSSearchResults(json) {
  }

  render() {
    const { categoriesMap } = this.props;
    const createVideoList = videos =>
      <ul>
        {videos.map(video => {
          const data = video.snippet ? video.snippet : video.ytData;
          const key = video.snippet ? video.id.videoId : video._id;
          const id = video.snippet ? video.id.videoId : video.id;
          return (
            <VideoListing
              {...this.props}
              {...video}
              categoriesMap={categoriesMap}
              key={key}
              id={id}
              data={data}
            />
          );
        })}
      </ul>;
      const videos = this.props.videos.length ? createVideoList(this.props.videos) :
        'No videos found';
      const youtubeVideos = this.props.youtubeVideos.length ?
        createVideoList(this.props.youtubeVideos) : 'No vidieos found';

    return (
      <div className="video-results-container">
        <VideosElements
          champions={this.props.champions}
          categoriesMap={categoriesMap}
          parsedQuery={queryString.parse(this.props.location.search)}
        />
        <div  className="video-results">
          <div className="video-results-set">
            <h2>LoL Strats Results</h2>
            {this.props.videosLoading ? 'Loading...' : videos}
          </div>
          <div className="video-results-set">
            <h2>YouTube Results</h2>
            {this.props.youtubeVideosLoading ? 'Loading...' : youtubeVideos}
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  allElementsLoaded: state.root.allElementsLoaded,
  categories: state.root.categories,
  categoriesMap: state.root.categoriesMap,
  videos: state.videos.videos,
  youtubeVideos: state.videos.youtubeVideos,
  videosLoading: state.videos.videosLoading,
  youtubeVideosLoading: state.videos.youtubeVideosLoading
});

const mapDispatchToProps = {
  fetchVideos
};

export default connect(mapStateToProps, mapDispatchToProps)(Videos);
