import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../repository/Authentication/auth_service';
import finkilogo from '../../images/finki-logo.png';
import './header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Header = () => {
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = authService.subscribe((user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <img src={finkilogo} alt="Finki Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                        <strong>Projects Management System</strong>
                    </a>

                    {/* Toggle button */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-tabs">
                            <li className="nav-item"><Link className="nav-link" to="/subjects"><strong>Subjects</strong></Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/professors"><strong>Professors</strong></Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/students"><strong>Students</strong></Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/topics"><strong>Topics</strong></Link></li>
                        </ul>
                        <ul className="navbar-nav ms-auto me-3 nav-tabs">
                            {!currentUser ? (
                                <>
                                    <li className="nav-item"><Link className="nav-link" to="/register"><strong>Register</strong></Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/login"><strong>Login</strong></Link></li>
                                </>
                            ) : (
                                <li className="nav-item"><button className="nav-link btn btn-link" onClick={handleLogout}><strong>Logout</strong></button></li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
