import React from 'react';
import { Link } from 'react-router-dom';
import { login, createAccount } from '../data/userStore';
import './home.css';

export function Home({ userName, onLogin, onLogout }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  // Login and Create Account share the same steps. Only the store function they call is different.
  function submitAccount(action) {
    const result = action(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setError('');
      setPassword('');
      onLogin(result.userName);
    }
  }

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
          {userName ? (
            <>
              <h3>Welcome back, {userName}</h3>
              <p>You are logged in. You can write reviews and manage them from My Reviews.</p>
              <div className="button-row">
                <Link className="btn btn-success" to="/my-reviews">
                  My Reviews
                </Link>
                <button type="button" className="btn btn-outline-success" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <h3>Login</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitAccount(login);
                }}
              >
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input type="email" className="form-control" id="email" name="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input type="password" className="form-control" id="password" name="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && (
                  <p className="text-danger" role="alert">
                    {error}
                  </p>
                )}
                <div className="button-row">
                  <button type="submit" className="btn btn-success" disabled={!email || !password}>
                    Login
                  </button>
                  <button type="button" className="btn btn-outline-success" disabled={!email || !password} onClick={() => submitAccount(createAccount)}>
                    Create Account
                  </button>
                </div>
              </form>
              <p className="placeholder-note">
                You can also <Link to="/browse">browse reviews</Link> without an account. Login is only required to submit a review.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
