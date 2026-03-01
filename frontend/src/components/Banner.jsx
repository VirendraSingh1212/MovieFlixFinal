import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from '../axios';
import { tmdbImageBaseURL } from '../axios';
import requests from '../requests';
import { mockMovies } from '../mockData';
import './Banner.css';

// Cache for banner data
let bannerCache = null;
let preloadedImage = null;

// High-quality backdrop images from TMDB (no API key needed for images)
const highQualityBackdrops = [
  `${tmdbImageBaseURL}/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`, // Stranger Things
  `${tmdbImageBaseURL}/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg`, // Interstellar
  `${tmdbImageBaseURL}/s3TBrRGB1iav7gFOCNx3H31MoES.jpg`, // Inception
  `${tmdbImageBaseURL}/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg`, // Avengers
  `${tmdbImageBaseURL}/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg`, // Avengers Endgame
  `${tmdbImageBaseURL}/fydUcbKQLyzMX2g5R5jlGCAr6ka.jpg`, // The Dark Knight
  `${tmdbImageBaseURL}/gG9fTyDL03fiKnPyfhzgYxuLofA.jpg`, // The Matrix
  `${tmdbImageBaseURL}/lOr9NKxh4vMweufMOUDJjJTZRro.jpg`, // Dune
  `${tmdbImageBaseURL}/xJHokMbljvjADYdit5fK5VQsXEG.jpg`, // Avatar
  `${tmdbImageBaseURL}/5vNW7gR7h3E5U8YJq9W8z1Q8J7.jpg`, // Popular series
];

// Preload image function
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

const Banner = memo(function Banner() {
  const [movie, setMovie] = useState(bannerCache?.movie || null);
  const [backdropUrl, setBackdropUrl] = useState(bannerCache?.backdropUrl || null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(!bannerCache);
  const [error, setError] = useState(null);

  // Preload and set background image
  const loadBackdrop = useCallback(async (url) => {
    if (!url) return;
    try {
      await preloadImage(url);
      setBackdropUrl(url);
      setImageLoaded(true);
    } catch (err) {
      // If image fails to load, still show the banner with fallback
      setBackdropUrl(url);
      setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      // Use cached data immediately if available
      if (bannerCache) {
        setMovie(bannerCache.movie);
        if (!preloadedImage || preloadedImage !== bannerCache.backdropUrl) {
          await loadBackdrop(bannerCache.backdropUrl);
          preloadedImage = bannerCache.backdropUrl;
        } else {
          setBackdropUrl(bannerCache.backdropUrl);
          setImageLoaded(true);
        }
        setLoading(false);
        return;
      }

      const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

      if (!API_KEY) {
        const randomMovie = mockMovies[Math.floor(Math.random() * mockMovies.length)];
        const randomBackdrop = highQualityBackdrops[Math.floor(Math.random() * highQualityBackdrops.length)];
        bannerCache = { movie: randomMovie, backdropUrl: randomBackdrop };
        setMovie(randomMovie);
        await loadBackdrop(randomBackdrop);
        preloadedImage = randomBackdrop;
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const request = await axios.get(requests.fetchNetflixOriginals);
        if (request.data.Search && request.data.Search.length > 0) {
          const randomMovie = request.data.Search[Math.floor(Math.random() * request.data.Search.length)];
          const detailRequest = await axios.get(`?i=${randomMovie.imdbID}&apikey=${API_KEY}`);
          const randomBackdrop = highQualityBackdrops[Math.floor(Math.random() * highQualityBackdrops.length)];
          bannerCache = { movie: detailRequest.data, backdropUrl: randomBackdrop };
          setMovie(detailRequest.data);
          await loadBackdrop(randomBackdrop);
          preloadedImage = randomBackdrop;
          setError(null);
        } else {
          setError('No data available');
        }
      } catch (err) {
        const randomMovie = mockMovies[Math.floor(Math.random() * mockMovies.length)];
        const randomBackdrop = highQualityBackdrops[Math.floor(Math.random() * highQualityBackdrops.length)];
        bannerCache = { movie: randomMovie, backdropUrl: randomBackdrop };
        setMovie(randomMovie);
        await loadBackdrop(randomBackdrop);
        preloadedImage = randomBackdrop;
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [loadBackdrop]);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  }

  if (error) {
    return <div className="banner__error">{error}</div>;
  }

  return (
    <header
      className={`banner ${imageLoaded ? 'banner--loaded' : 'banner--loading'}`}
      style={{
        backgroundImage: backdropUrl
          ? `url("${backdropUrl}")`
          : 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
      }}
    >
      <div className="banner__gradient" />
      <motion.div
        className="banner__contents"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Meta info row */}
        <div className="banner__meta">
          <span className="banner__rating">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e50914">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {movie?.imdbRating || '8.5'}
          </span>
          <span className="banner__year">{movie?.Year || '2024'}</span>
          <span className="banner__runtime">{movie?.Runtime || '2h 15m'}</span>
          <span className="banner__hd">HD</span>
        </div>

        {/* Title */}
        <h1 className="banner__title">
          {movie?.Title || movie?.title || movie?.name}
        </h1>

        {/* Description */}
        <p className="banner__description">
          {truncate(movie?.Plot || movie?.overview, 180)}
        </p>

        {/* CTAs */}
        <div className="banner__buttons">
          <button className="btn-primary banner__playBtn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
          <button className="btn-secondary banner__listBtn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            My List
          </button>
        </div>

        {/* Genres */}
        <div className="banner__genres">
          {(movie?.Genre || 'Action, Drama, Thriller').split(', ').slice(0, 3).map((genre, i) => (
            <span key={i} className="banner__genre">
              {genre}
              {i < 2 && <span className="banner__dot">•</span>}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="banner__fadeBottom" />
    </header>
  );
});

export default Banner;
