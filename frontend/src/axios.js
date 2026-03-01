import axios from 'axios';

// OMDb instance for movie data
const instance = axios.create({
  baseURL: 'https://www.omdbapi.com/',
});

// TMDB instance for high-quality images (no API key needed for images)
export const tmdbImageBaseURL = 'https://image.tmdb.org/t/p/original';

export default instance;
