import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import VideoListing from '../VideoListing/VideoListing';
import VideosElements from '../VideosElements/VideosElements';
import './styles.css';

const API_KEY = 'AIzaSyDP8_FbyKEyuT_-fIa1l7LcUsJzW-rV5j0';

class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      youtubeVideos: [],
      videosLoading: true,
      youtubeVideosLoading: true
    };
  }
  componentWillMount() {
    const { champions, items, runes, categories } = this.props;
    if (champions.length && items.length && runes.length && categories.length) {
      this.getVideos(this.props);
    }
  }
  componentWillReceiveProps(newProps) {
    if (!(newProps.champions.length && newProps.items.length
        && newProps.runes.length && newProps.categories.length)) {
      return;
    }
    this.getVideos(newProps);
  }
  getVideos(props) {
    const ytQuery = `League of Legends ${this.createYTSearchQuery(props)}`;
    fetch('/api/videos?' +
      this.props.location.search.slice(1)).then(res => res.json())
      .then(json => {
        this.handleLSSearchResults(json)
        fetch('https://www.googleapis.com/youtube/v3/search?' +
          queryString.stringify({'maxResults': '25',
           'part': 'snippet',
           'q': ytQuery,
           'type': 'video',
           'key': API_KEY,
        })).then(res => res.json()).then(videos => {
          this.setState({ youtubeVideos: videos.items, youtubeVideosLoading: false });
        }).catch(err => err);
      }).catch(err => err);
  }
  createYTSearchQuery(props) {
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
    if (json.result) {
      this.setState({ videos: json.result, videosLoading: false });
    }
  }

  render() {
    // const categoriesMap = this.props.categories.reduce((memo, next) => {
    //   return {
    //   ...memo,
    //   ...next[Object.keys(next)[0]]
    //     .reduce((memo, next) => ({ ...memo, [next.id]: next }), {}),
    //   }
    // }, {});
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
      const videos = this.state.videos.length ? createVideoList(this.state.videos) :
        'No videos found';
      const youtubeVideos = this.state.youtubeVideos.length ?
        createVideoList(this.state.youtubeVideos) : 'No vidieos found';

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
            {this.state.videosLoading ? 'Loading...' : videos}
          </div>
          <div className="video-results-set">
            <h2>YouTube Results</h2>
            {this.state.youtubeVideosLoading ? 'Loading...' : youtubeVideos}
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  categories: state.root.categories,
  categoriesMap: state.root.categoriesMap
});

export default connect(mapStateToProps)(Videos);
