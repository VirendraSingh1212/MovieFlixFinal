import React, { useState } from 'react';
import Row from '../components/Row';
import Banner from '../components/Banner';
import Navbar from '../components/Navbar';
import CategoryPills from '../components/CategoryPills';
import MovieModal from '../components/MovieModal';
import requests from '../requests';
import '../App.css'; // Make sure the OTT App.css is used

function Home() {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // For the optional "Welcome back, {Username}" text
    const user = JSON.parse(localStorage.getItem('user'));

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    return (
        <div className="app">
            <Navbar />
            <Banner />

            {/* Optional Subtle Welcome Text in Hero Area under Banner if desired. But Netflix usually doesn't have it there. 
          The requirements state: "If logged in: Optionally show small subtle text in hero... Keep it minimal and elegant".
          We'll place it right below the Banner for now, or inside it if easy. We'll just put it above CategoryPills. */}
            {user && (
                <div style={{ padding: '0 var(--padding-x)', marginTop: '-80px', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 500 }}>
                        Welcome back, {user.uname || user.username}!
                    </p>
                </div>
            )}

            <CategoryPills />
            <Row
                title="MovieFlix Originals"
                fetchUrl={requests.fetchNetflixOriginals}
                isLargeRow
                onMovieClick={handleMovieClick}
            />
            <Row
                title="Trending Now"
                fetchUrl={requests.fetchTrending}
                onMovieClick={handleMovieClick}
            />
            <Row
                title="Top Rated"
                fetchUrl={requests.fetchTopRated}
                onMovieClick={handleMovieClick}
            />
            <Row
                title="Action Movies"
                fetchUrl={requests.fetchActionMovies}
                onMovieClick={handleMovieClick}
            />
            <Row
                title="Comedy Movies"
                fetchUrl={requests.fetchComedyMovies}
                onMovieClick={handleMovieClick}
            />
            <Row
                title="Horror Movies"
                fetchUrl={requests.fetchHorrorMovies}
                onMovieClick={handleMovieClick}
            />
            <Row
                title="Romance Movies"
                fetchUrl={requests.fetchRomanceMovies}
                onMovieClick={handleMovieClick}
            />
            <Row
                title="Documentaries"
                fetchUrl={requests.fetchDocumentaries}
                onMovieClick={handleMovieClick}
            />

            <MovieModal
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default Home;
