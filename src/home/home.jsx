import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

export function Home() {
  return (
    <main className="container">
      <div className="hero">
        <h2>Find gluten-free restaurants you can trust</h2>
        <p>Search for a restaurant to see community reviews about cross-contamination and kitchen practices.</p>
        <a className="btn btn-light" href="https://github.com/blakeg9944/Fall2026Startup">
          View the GitHub repository
        </a>
      </div>

      <div className="home-grid">
        <section className="gg-card" id="search-card">
          <h3>Find a restaurant</h3>
          <form method="get" action="/restaurant">
            <label htmlFor="search" className="form-label">
              Restaurant name or address
            </label>
            <div className="input-group">
              <input type="search" className="form-control" id="search" name="search" placeholder="Search restaurants near you" />
              <button type="submit" className="btn btn-success">
                Search
              </button>
            </div>
          </form>

          {/* Placeholder: results come from the Google Places API as the user types */}
          <h4>Search results</h4>
          <div className="list-group">
            <Link className="list-group-item list-group-item-action" to="/restaurant">
              <strong>Rockwell Ice Cream Co.</strong>
              <span className="address">165 N University Ave, Provo UT</span>
            </Link>
            <Link className="list-group-item list-group-item-action" to="/restaurant">
              <strong>Black Sheep Cafe</strong>
              <span className="address">19 N University Ave, Provo UT</span>
            </Link>
            <Link className="list-group-item list-group-item-action" to="/restaurant">
              <strong>Communal Restaurant</strong>
              <span className="address">102 N University Ave, Provo UT</span>
            </Link>
          </div>
          <p className="placeholder-note">Restaurant names and addresses are supplied by the Google Places API.</p>
        </section>

        <section className="gg-card" id="login-card">
          <h3>Login</h3>
          <form method="get" action="/browse">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input type="email" className="form-control" id="email" name="email" placeholder="you@example.com" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input type="password" className="form-control" id="password" name="password" placeholder="password" required />
            </div>
            <div className="button-row">
              <button type="submit" className="btn btn-success">
                Login
              </button>
              <button type="submit" className="btn btn-outline-success">
                Create Account
              </button>
            </div>
          </form>
          <p className="placeholder-note">
            You can also <Link to="/browse">browse reviews</Link> without an account. Login is only required to submit a review.
          </p>
        </section>
      </div>
    </main>
  );
}
