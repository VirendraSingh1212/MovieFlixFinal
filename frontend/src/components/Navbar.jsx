import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [show, setShow] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5005/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <motion.nav
      className={`navbar ${show ? 'navbar__scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="navbar__container">
        <div className="navbar__left">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="navbar__logo">MovieFlix</h1>
          </Link>
          <ul className="navbar__menu">
            <li className="navbar__menuItem active">Home</li>
            <li className="navbar__menuItem">Movies</li>
            <li className="navbar__menuItem">Series</li>
            <li className="navbar__menuItem" onClick={() => alert("The Watchlist feature is coming soon!")} style={{ cursor: 'pointer' }}>My List</li>
          </ul>
        </div>
        <div className="navbar__right">
          {!user ? (
            <div className="navbar__authButtons" style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login">
                <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Login</button>
              </Link>
              <Link to="/signup">
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Sign Up</button>
              </Link>
            </div>
          ) : (
            <>
              <button className="navbar__icon" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
              <button className="navbar__icon" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
              </button>

              <div
                className="navbar__profile"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                style={{ position: 'relative' }}
              >
                <img
                  className="navbar__avatar"
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                  alt="User Avatar"
                />
                <svg className="navbar__dropdownIcon" width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M7 10l5 5 5-5z" />
                </svg>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="navbar__dropdownMenu"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '10px',
                        background: 'rgba(0,0,0,0.9)',
                        border: '1px solid #333',
                        borderRadius: '4px',
                        width: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1000
                      }}
                    >
                      <Link to="/profile" style={{ color: 'white', padding: '10px 15px', textDecoration: 'none', borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
                        Profile
                      </Link>
                      <div
                        onClick={() => alert("The Watchlist feature is coming soon!")}
                        style={{ color: 'white', padding: '10px 15px', borderBottom: '1px solid #333', fontSize: '0.9rem', cursor: 'pointer' }}
                      >
                        Watchlist
                      </div>
                      <div onClick={handleLogout} style={{ color: 'white', padding: '10px 15px', fontSize: '0.9rem', cursor: 'pointer' }}>
                        Logout
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
