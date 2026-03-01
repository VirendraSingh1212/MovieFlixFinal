import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { motion } from 'framer-motion';
import axios from '../axios';
import { mockMovies, mockTrending, mockAction, mockComedy } from '../mockData';
import './Row.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Simple cache for API responses
const apiCache = new Map();

// Security: Sanitize movie data
const sanitizeMovieData = (movie) => {
  if (!movie || typeof movie !== 'object') return null;
  return {
    ...movie,
    Title: movie.Title?.toString().slice(0, 200) || '',
    Year: movie.Year?.toString().slice(0, 20) || '',
    imdbID: movie.imdbID?.toString().slice(0, 20) || '',
    Type: movie.Type?.toString().slice(0, 20) || '',
    Poster: movie.Poster?.match(/^https?:\/\//i) ? movie.Poster : null,
  };
};

const Row = memo(function Row({ title, fetchUrl, isLargeRow = false, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for lazy loading rows
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    const rowElement = document.getElementById(`row-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (rowElement) {
      observer.observe(rowElement);
    }

    return () => observer.disconnect();
  }, [title]);

  useEffect(() => {
    if (!isVisible) return;
    
    async function fetchData() {
      // Check cache first
      if (apiCache.has(fetchUrl)) {
        const cached = apiCache.get(fetchUrl).map(sanitizeMovieData).filter(Boolean);
        setMovies(cached);
        setLoading(false);
        return;
      }
      
      const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
      
      if (!API_KEY) {
        let mockData = mockMovies;
        if (title.includes('Trending')) mockData = mockTrending;
        else if (title.includes('Action')) mockData = mockAction;
        else if (title.includes('Comedy')) mockData = mockComedy;
        
        const sanitized = mockData.map(sanitizeMovieData).filter(Boolean);
        setMovies(sanitized);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const request = await axios.get(fetchUrl);
        if (request.data.Search) {
          const sanitized = request.data.Search.map(sanitizeMovieData).filter(Boolean);
          apiCache.set(fetchUrl, sanitized);
          setMovies(sanitized);
          setError(null);
        } else {
          setError('No data available');
        }
      } catch (err) {
        let mockData = mockMovies;
        if (title.includes('Trending')) mockData = mockTrending;
        else if (title.includes('Action')) mockData = mockAction;
        else if (title.includes('Comedy')) mockData = mockComedy;
        
        const sanitized = mockData.map(sanitizeMovieData).filter(Boolean);
        setMovies(sanitized);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchUrl, title, isVisible]);

  // Memoized click handler
  const handleMovieClick = useCallback((movie) => {
    if (onMovieClick && movie) {
      onMovieClick(movie);
    }
  }, [onMovieClick]);

  const getSlidesPerView = () => {
    if (isLargeRow) {
      return {
        mobile: 2.5,
        tablet: 4,
        desktop: 6,
        large: 8
      };
    }
    return {
      mobile: 3,
      tablet: 4.5,
      desktop: 6.5,
      large: 8.5
    };
  };

  const slides = getSlidesPerView();

  const rowId = `row-${title.replace(/\s+/g, '-').toLowerCase()}`;

  if (loading) {
    return (
      <div id={rowId} className="row">
        <h2 className="row__title">{title}</h2>
        <div className="row__loading"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div id={rowId} className="row">
        <h2 className="row__title">{title}</h2>
        <div className="row__error">{error}</div>
      </div>
    );
  }

  return (
    <motion.div 
      id={rowId}
      className="row"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="row__title">{title}</h2>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={isLargeRow ? 16 : 12}
        slidesPerView={slides.mobile}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          640: {
            slidesPerView: slides.tablet,
            spaceBetween: isLargeRow ? 16 : 12,
          },
          1024: {
            slidesPerView: slides.desktop,
            spaceBetween: isLargeRow ? 16 : 14,
          },
          1400: {
            slidesPerView: slides.large,
            spaceBetween: isLargeRow ? 16 : 16,
          },
        }}
        className="row__swiper"
      >
        {movies.map((movie) => (
          movie.Poster && (
            <SwiperSlide key={movie.imdbID}>
              <motion.div
                className={`row__posterContainer ${isLargeRow ? 'row__posterLarge' : ''}`}
                whileHover={{ 
                  scale: 1.06, 
                  y: -6,
                  transition: { duration: 0.25, ease: 'easeOut' }
                }}
                onClick={() => handleMovieClick(movie)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleMovieClick(movie)}
                aria-label={`View details for ${movie.Title}`}
              >
                <img
                  className="row__poster"
                  src={movie.Poster}
                  alt={movie.Title}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="row__posterOverlay">
                  <h3 className="row__posterTitle">{movie.Title}</h3>
                  <div className="row__posterMeta">
                    <span>{movie.Year}</span>
                    <span className="row__posterDot">•</span>
                    <span>{movie.Type === 'series' ? 'Series' : 'Movie'}</span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          )
        ))}
      </Swiper>
    </motion.div>
  );
});

export default Row;
