import queryString from 'query-string';
import { API_ENDPOINT_VIDEOS, API_ENDPOINT_VIDEOS_ADD } from '../constants/endpoints';
import { resetActiveEntities } from '../actions/elements';

export const FETCH_VIDEOS_START = 'FETCH_VIDEOS_START';
export const FETCH_VIDEOS_SUCCESS = 'FETCH_VIDEOS_SUCCESS';
export const FETCH_VIDEOS_ERROR = 'FETCH_VIDEOS_ERROR';
export const FETCH_YOUTUBE_VIDEOS_SUCCESS = 'FETCH_YOUTUBE_VIDEOS_SUCCESS';
export const FETCH_YOUTUBE_VIDEOS_ERROR = 'FETCH_YOUTUBE_VIDEOS_ERROR';
export const ADD_VIDEO_SUCCESS = 'ADD_VIDEO_SUCCESS';
export const ADD_VIDEO_ERROR = 'ADD_VIDEO_ERROR';

const API_OPERATION_SUCCESS = 'success';
const API_KEY = 'AIzaSyDP8_FbyKEyuT_-fIa1l7LcUsJzW-rV5j0';

const requestVideos = () => ({
    type: FETCH_VIDEOS_START
})

const requestVideosSuccess = videos => ({
    videos,
    type: FETCH_VIDEOS_SUCCESS
})

const requestVideosError = () => ({
    type: FETCH_VIDEOS_ERROR
})

const requestYouTubeVideosSuccess = youtubeVideos => ({
    type: FETCH_YOUTUBE_VIDEOS_SUCCESS,
    youtubeVideos
})


const requestYouTubeVideosError = () => ({
    type: FETCH_YOUTUBE_VIDEOS_ERROR
})


export const fetchVideos = (query, ytQuery) => dispatch => {
  const videosUrl = `${API_ENDPOINT_VIDEOS}?${query}`;
  dispatch(requestVideos());
  return fetch(videosUrl).then(res => res.json())
    .then(
      json => {
        if (json.result) {
          dispatch(requestVideosSuccess(json.result))
        }
        fetch('https://www.googleapis.com/youtube/v3/search?' +
          queryString.stringify({
            'maxResults': '25',
            'part': 'snippet',
            'q': ytQuery,
            'type': 'video',
            'key': API_KEY,
          })).then(res => res.json()).then(
            videos => {
              dispatch(requestYouTubeVideosSuccess(videos.items))
            },
            err => dispatch(requestYouTubeVideosError(err))
          )
      },
      err => dispatch(requestVideosError(err))
    );
}

export const addVideoSuccess = () => ({
  type: ADD_VIDEO_SUCCESS
})

export const addVideoError = () => ({
  type: ADD_VIDEO_ERROR
})

export const addVideo = body => dispatch => {
  return fetch(API_ENDPOINT_VIDEOS_ADD, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  }).then(res => res.json())
  .then(
    json => {
      if (json.result === API_OPERATION_SUCCESS) {
        dispatch(addVideoSuccess());
        dispatch(resetActiveEntities());
      } else {
        dispatch(addVideoError());
      }
      return json
    },
    err => dispatch(addVideoError())
  )
}