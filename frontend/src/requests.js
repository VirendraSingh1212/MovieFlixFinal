// Use environment variable only - no hardcoded keys for security
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

// OMDb API uses different search terms since it doesn't have genre/category endpoints like TMDB
const requests = {
  // Search by popular titles for different categories
  fetchTrending: `?s=avengers&apikey=${API_KEY}&type=movie`,
  fetchNetflixOriginals: `?s=stranger&apikey=${API_KEY}&type=series`,
  fetchTopRated: `?s=batman&apikey=${API_KEY}&type=movie`,
  fetchActionMovies: `?s=action&apikey=${API_KEY}&type=movie`,
  fetchComedyMovies: `?s=comedy&apikey=${API_KEY}&type=movie`,
  fetchHorrorMovies: `?s=horror&apikey=${API_KEY}&type=movie`,
  fetchRomanceMovies: `?s=love&apikey=${API_KEY}&type=movie`,
  fetchDocumentaries: `?s=documentary&apikey=${API_KEY}&type=movie`,
};

export default requests;
