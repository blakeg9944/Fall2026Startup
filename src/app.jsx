import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';
import { BrowserRouter, NavLink, Link, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Browse } from './browse/browse';
import { Restaurant } from './restaurant/restaurant';
import { Review } from './review/review';
import { MyReviews } from './myReviews/myReviews';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <nav className="navbar navbar-expand-md navbar-dark">
            <div className="container">
              <Link className="navbar-brand" to="/">
                <h1>
                  <svg className="brand-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 2 4 5v6c0 5 3.4 9.5 8 11 4.6-1.5 8-6 8-11V5l-8-3Z" />
                    <path className="brand-check" d="m8.5 12 2.5 2.5 4.5-5" />
                  </svg>
                  GlutenGuard
                </h1>
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="mainNav">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/">
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/browse">
                      Browse Reviews
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/my-reviews">
                      My Reviews
                    </NavLink>
                  </li>
                </ul>
                <p className="welcome">
                  Welcome, <span id="username">guest</span>
                </p>
              </div>
            </div>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/review" element={<Review />} />
          <Route path="/my-reviews" element={<MyReviews />} />
        </Routes>

        <footer>
          <div className="container footer-inner">
            <p>Blake Gertsch</p>
            <a href="https://github.com/blakeg9944/Fall2026Startup">GitHub Repository</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
