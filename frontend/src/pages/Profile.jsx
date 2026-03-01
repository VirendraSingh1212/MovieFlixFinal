import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <>
            <Navbar />
            <div
                className="profile-container"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '100px 20px 20px',
                    background: 'var(--bg-dark)'
                }}
            >
                <div
                    className="profile-card"
                    style={{
                        background: 'var(--bg-card)',
                        padding: '40px',
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <h1 style={{ marginBottom: '30px', fontSize: '2rem', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                        Account Profile
                    </h1>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Username</span>
                            <span style={{ fontWeight: 600 }}>{user.uname || user.username}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Email Address</span>
                            <span style={{ fontWeight: 600 }}>{user.email || 'N/A'}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Account Role</span>
                            <span style={{ fontWeight: 600 }}>{user.role}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <button
                            onClick={handleLogout}
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '15px' }}
                        >
                            Sign Out of MovieFlix
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                padding: '15px',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 500,
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;
