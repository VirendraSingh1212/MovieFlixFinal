import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './MovieModal.css';

// Security: Sanitize text content to prevent XSS
const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Security: Validate and sanitize image URLs
const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '/placeholder-movie.png';
  // Only allow http/https URLs
  if (!url.match(/^https?:\/\//i)) return '/placeholder-movie.png';
  return url;
};

function MovieModal({ movie, isOpen, onClose }) {
  const navigate = useNavigate();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Memoize sanitized data for performance
  const sanitizedData = useMemo(() => {
    if (!movie) return null;
    return {
      Title: sanitizeText(movie.Title),
      Year: sanitizeText(movie.Year),
      Rated: sanitizeText(movie.Rated),
      Runtime: sanitizeText(movie.Runtime),
      Genre: sanitizeText(movie.Genre),
      Director: sanitizeText(movie.Director),
      Actors: sanitizeText(movie.Actors),
      Plot: sanitizeText(movie.Plot),
      imdbRating: sanitizeText(movie.imdbRating),
      Poster: sanitizeImageUrl(movie.Poster),
    };
  }, [movie]);

  if (!movie || !sanitizedData) return null;

  const data = sanitizedData;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="movieModal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="movieModal"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="movie-modal-title"
          >
            {/* Close button */}
            <button className="movieModal__close" onClick={onClose} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>

            <div className="movieModal__content">
              {/* Poster */}
              <div className="movieModal__poster">
                <img
                  src={data.Poster}
                  alt={`${data.Title} poster`}
                  loading="lazy"
                  onError={(e) => { e.target.src = '/placeholder-movie.png'; }}
                />
              </div>

              {/* Details */}
              <div className="movieModal__details">
                <h2 id="movie-modal-title" className="movieModal__title">{data.Title}</h2>

                <div className="movieModal__meta">
                  <span className="movieModal__rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e50914">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {data.imdbRating || 'N/A'}
                  </span>
                  <span className="movieModal__year">{data.Year}</span>
                  <span className="movieModal__rated">{data.Rated || 'PG-13'}</span>
                  <span className="movieModal__runtime">{data.Runtime || 'N/A'}</span>
                </div>

                <p className="movieModal__plot">{data.Plot}</p>

                <div className="movieModal__info">
                  <div className="movieModal__infoRow">
                    <span className="movieModal__label">Genre:</span>
                    <span className="movieModal__value">{data.Genre}</span>
                  </div>
                  <div className="movieModal__infoRow">
                    <span className="movieModal__label">Director:</span>
                    <span className="movieModal__value">{data.Director}</span>
                  </div>
                  <div className="movieModal__infoRow">
                    <span className="movieModal__label">Cast:</span>
                    <span className="movieModal__value">{data.Actors}</span>
                  </div>
                </div>

                <div className="movieModal__buttons">
                  <button className="btn-primary movieModal__playBtn" aria-label="Play movie">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Now
                  </button>
                  <button
                    className="btn-outline movieModal__addBtn"
                    aria-label="Add to list"
                    onClick={() => {
                      const user = localStorage.getItem('user');
                      if (!user) {
                        onClose(); // Close modal before navigation
                        navigate('/login');
                      } else {
                        // Normally this would trigger an API call to add to watchlist
                        alert('Added to your watchlist!');
                      }
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    Add to List
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MovieModal;
