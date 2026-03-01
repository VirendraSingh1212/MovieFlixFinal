import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './CategoryPills.css';

const categories = [
  'All',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
];

function CategoryPills({ onCategoryChange }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const scrollRef = useRef(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      className="categoryPills"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <button 
        className="categoryPills__arrow categoryPills__arrowLeft"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      
      <div className="categoryPills__container hide-scrollbar" ref={scrollRef}>
        {categories.map((category) => (
          <button
            key={category}
            className={`pill categoryPills__pill ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <button 
        className="categoryPills__arrow categoryPills__arrowRight"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    </motion.div>
  );
}

export default CategoryPills;
