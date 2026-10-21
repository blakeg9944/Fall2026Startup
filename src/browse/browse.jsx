import React from 'react';
import { Link } from 'react-router-dom';
import { getAllPlaces } from '../data/places';
import { getReviews } from '../data/reviewStore';
import { badgeClass, formatRating, summarize } from '../data/stats';
import { timeAgo } from '../timeAgo';
import './browse.css';

const fakeUsers = ['user_42', 'provo_foodie', 'celiac_sarah', 'glutenfree_mom3', 'mtn_biker_dave', 'byu_student'];

// Stands in for a message arriving over the WebSocket when anyone posts a review
function fakeReviewEvent() {
  const places = getAllPlaces();
  const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
  const place = places[Math.floor(Math.random() * places.length)];
  return { id: crypto.randomUUID(), text: `${user} reviewed ${place.name}`, time: Date.now() };
}

export function Browse() {
  const [reviews, setReviews] = React.useState([]);
  const [activity, setActivity] = React.useState([]);

  // Load the reviews once, when the page opens
  React.useEffect(() => {
    setReviews(getReviews());
  }, []);

  // Mock WebSocket: a fake review event arrives every 5 seconds, and the feed keeps the newest 5.
  // The cleanup stops the timer when the user leaves the page.
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActivity((previous) => [fakeReviewEvent(), ...previous].slice(0, 5));
    }, 5000);
    return () => clearInterval(timer);
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
          {/* Mocked with setInterval until the WebSocket service exists */}
          {activity.length === 0 ? (
            <p className="feed-empty">Waiting for activity...</p>
          ) : (
            <ul className="live-feed">
              {activity.map((event) => (
                <li key={event.id}>
                  <span>
                    {event.text}
                    <time className="feed-time">{timeAgo(event.time)}</time>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="placeholder-note">New reviews appear here in real time over a WebSocket.</p>
        </section>
      </div>
    </main>
  );
}
