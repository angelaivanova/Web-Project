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
                    <Link className="navbar-brand" to="/">
                        <img
                            src={finkilogo}
                            alt="Finki Logo"
                            style={{ width: '40px', height: '40px', marginRight: '10px' }}
                        />
                        <strong>Projects Management System</strong>
                    </Link>

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
                        {currentUser && (
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-tabs">
                            {currentUser && currentUser.role === "ROLE_PROFESSOR" ? (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to={`/subject-allocations/${currentUser.username}/subjects`}
                                        >
                                            <strong>Subjects</strong>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={`/subject-allocations/professors/${currentUser.username}/topics`}>
                                            <strong>Topics</strong>
                                        </Link>

                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/students">
                                            <strong>Students</strong>
                                        </Link>
                                    </li>
                                </>
                            ) : currentUser && currentUser.role === "ROLE_ADMIN" ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/subjects">
                                            <strong>Subjects</strong>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/students">
                                            <strong>Students</strong>
                                        </Link>
                                    </li>
                                </>
                            ): (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={`/student/${currentUser?.username}/subjects`}>
                                            <strong>Subjects</strong>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={`/student/${currentUser?.username}/subjects/topics`}>
                                            <strong>Topics</strong>
                                        </Link>
                                    </li>
                                    
                                </>
                                
                            )}
                            <li className="nav-item">
                                <Link className="nav-link" to="/professors">
                                    <strong>Professors</strong>
                                </Link>
                            </li>
                        </ul>
                        )}
                        <ul className="navbar-nav ms-auto me-3 nav-tabs">
                            {!currentUser ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">
                                            <strong>Register</strong>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">
                                            <strong>Login</strong>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item nav-link text-white pe-3">
                                        <strong>{currentUser.username || currentUser.name || "User"}</strong>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link" onClick={handleLogout}>
                                            <strong>Logout</strong>
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
