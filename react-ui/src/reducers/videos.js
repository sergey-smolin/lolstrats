
import {
  FETCH_VIDEOS_START,
  FETCH_VIDEOS_SUCCESS,
  FETCH_VIDEOS_ERROR,
  FETCH_YOUTUBE_VIDEOS_SUCCESS,
  ADD_VIDEO_SUCCESS
} from '../actions/videos';

const initialState = {
  videos: [],
  videosLoading: false,
  youtubeVideos: [],
  youtubeVideosLoading: false,
  videoURL: '',
};

export default function videosReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_VIDEOS_START:
      return {
        ...state,
        videosLoading: true,
        youtubeVideosLoading: true,
      }
    case FETCH_VIDEOS_SUCCESS:
      return {
        ...state,
        videos: action.videos,
        videosLoading: false
      }
    case FETCH_VIDEOS_ERROR:
      return {
        ...state,
        videosLoading: false
      }
    case FETCH_YOUTUBE_VIDEOS_SUCCESS:
      return {
        ...state,
        youtubeVideos: action.youtubeVideos,
        youtubeVideosLoading: false
      }
    case ADD_VIDEO_SUCCESS:
      return {
        ...state,
        videoURL: ''
      }
    default:
  }
  return state;
}