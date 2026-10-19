import React from 'react';
import { Link } from 'react-router-dom';
import { login, createAccount } from '../data/userStore';
import { searchPlaces } from '../data/places';
import './home.css';

export function Home({ userName, onLogin, onLogout }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [query, setQuery] = React.useState('');

  // The results are worked out from query on every render, so they never get out of step with the input.
  // That needs no useEffect while the search is a synchronous mock. The real Google Places call will be async.
  const results = searchPlaces(query);

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
          {/* Results update on every keystroke, so submitting only needs to stop the page from reloading */}
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search" className="form-label">
              Restaurant name or address
            </label>
            <div className="input-group">
              <input type="search" className="form-control" id="search" name="search" placeholder="Search restaurants near you" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button type="submit" className="btn btn-success">
                Search
              </button>
            </div>
          </form>

          <h4>Search results</h4>
          {!query.trim() && <p className="search-hint">Start typing a restaurant name or address.</p>}
          {query.trim() && results.length === 0 && <p className="search-hint">No restaurants match "{query.trim()}".</p>}
          {results.length > 0 && (
            <div className="list-group">
              {results.map((place) => (
                <Link key={place.id} className="list-group-item list-group-item-action" to={`/restaurant/${place.id}`}>
                  <strong>{place.name}</strong>
                  <span className="address">{place.address}</span>
                </Link>
              ))}
            </div>
          )}
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
