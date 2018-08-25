import queryString from 'query-string';

export const FETCH_VIDEOS_START = 'FETCH_VIDEOS_START';
export const FETCH_VIDEOS_SUCCESS = 'FETCH_VIDEOS_SUCCESS';
export const FETCH_VIDEOS_ERROR = 'FETCH_VIDEOS_ERROR';
export const FETCH_YOUTUBE_VIDEOS_SUCCESS = 'FETCH_YOUTUBE_VIDEOS_SUCCESS';
export const FETCH_YOUTUBE_VIDEOS_ERROR = 'FETCH_YOUTUBE_VIDEOS_ERROR';

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
    dispatch(requestVideos());
    fetch(query).then(res => res.json())
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
            err => dispatch(requestYouTubeVideosError(err))
        );
}