import React from 'react';
import { Link } from 'react-router-dom';
import { getAllPlaces } from '../data/places';
import { getReviews } from '../data/reviewStore';
import { badgeClass, formatRating, summarize } from '../data/stats';
import './browse.css';

export function Browse() {
  const [reviews, setReviews] = React.useState([]);

  // Load the reviews once, when the page opens
  React.useEffect(() => {
    setReviews(getReviews());
  }, []);

  // One row per restaurant that has at least one review, best rated first.
  // Worked out on every render, so a new or deleted review changes the table.
  const rows = getAllPlaces()
    .map((place) => ({ place, summary: summarize(reviews.filter((review) => review.restaurantId === place.id)) }))
    .filter((row) => row.summary.count > 0)
    .sort((a, b) => b.summary.rating - a.summary.rating);

  return (
    <main className="container">
      <div className="page-intro">
        <h2>Browse reviews near you</h2>
        <p>Every pin is a restaurant that GlutenGuard users have reviewed. Pick one to read the full safety profile.</p>
      </div>

      <div className="browse-grid">
        <section className="gg-card" id="map">
          <h3>Map</h3>
          {/* Placeholder: replaced by an interactive map from the Google Maps API */}
          <div className="map-frame">
            <img src="/placeholder.png" alt="Map of reviewed restaurants near Provo, Utah" />
          </div>
          <p className="placeholder-note">This map is rendered by the Google Maps API and pinned using place IDs from the Google Places API.</p>
        </section>

        <section className="gg-card" id="restaurant-list">
          <h3>Reviewed restaurants</h3>
          {rows.length === 0 ? (
            <p>No restaurants have been reviewed yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Restaurant</th>
                    <th>Address</th>
                    <th>Rating</th>
                    <th>Reviews</th>
                    <th>Separate fryer</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ place, summary }) => (
                    <tr key={place.id}>
                      <td>
                        <Link to={`/restaurant/${place.id}`}>{place.name}</Link>
                      </td>
                      <td>{place.address}</td>
                      <td>
                        <span className={`rating-badge ${badgeClass(summary.rating)}`}>{formatRating(summary.rating)}</span>
                      </td>
                      <td>{summary.count}</td>
                      <td className={`answer-${summary.fryer.level === 'unknown' ? 'na' : summary.fryer.level}`}>{summary.fryer.level === 'unknown' ? 'N/A' : summary.fryer.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="placeholder-note">Restaurants and their aggregated ratings are stored in the database.</p>
        </section>

        <section className="gg-card" id="recent-activity">
          <h3>Recent activity</h3>
          {/* Placeholder: pushed over a WebSocket as users post reviews anywhere in the app */}
          <ul className="live-feed">
            <li>
              <span>
                celiac_sarah reviewed Black Sheep Cafe
                <time className="feed-time">a moment ago</time>
              </span>
            </li>
            <li>
              <span>
                provo_foodie reviewed Guru's Cafe
                <time className="feed-time">4 minutes ago</time>
              </span>
            </li>
            <li>
              <span>
                mtn_biker_dave reviewed Communal Restaurant
                <time className="feed-time">11 minutes ago</time>
              </span>
            </li>
          </ul>
          <p className="placeholder-note">New reviews appear here in real time over a WebSocket.</p>
        </section>
      </div>
    </main>
  );
}
