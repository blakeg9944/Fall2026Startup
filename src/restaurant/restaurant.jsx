import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlaceDetails } from '../data/places';
import { getReviewsForRestaurant } from '../data/reviewStore';
import { badgeClass, formatRating, reviewRating, summarize } from '../data/stats';
import { timeAgo } from '../timeAgo';
import './restaurant.css';

const answerLabels = { yes: 'Yes', no: 'No', unsure: 'Unsure' };

// Which summary field goes with each row of the safety profile
const practiceRows = [
  { key: 'fryer', label: 'Separate fryer' },
  { key: 'grill', label: 'Separate grill' },
  { key: 'prep', label: 'Separate prep surface' },
  { key: 'menu', label: 'Dedicated gluten-free menu' },
  { key: 'staff', label: 'Staff trained on celiac safety' },
];

const fakeUsers = ['provo_foodie', 'celiac_sarah', 'glutenfree_mom3', 'mtn_biker_dave', 'user_42', 'byu_student'];

// Stands in for a message arriving over the WebSocket
function fakeEvent() {
  const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
  const rating = 1 + Math.floor(Math.random() * 5);
  const text = Math.random() < 0.5 ? `${user} started writing a review` : `${user} posted a ${rating} / 5 review`;
  return { id: crypto.randomUUID(), text, time: Date.now() };
}

export function Restaurant({ userName }) {
  const { id } = useParams();
  // undefined means still loading, null means the id doesn't match any restaurant
  const [place, setPlace] = React.useState(undefined);
  const [reviews, setReviews] = React.useState([]);
  const [viewers, setViewers] = React.useState(7);
  const [events, setEvents] = React.useState([]);

  // Runs after the first render and again whenever the id in the URL changes
  React.useEffect(() => {
    setPlace(getPlaceDetails(id));
    setReviews(getReviewsForRestaurant(id));
  }, [id]);

  // Mock WebSocket: every few seconds the viewer count drifts and a fake event arrives.
  // The cleanup function stops the timer when the user leaves or the id changes. Without it,
  // every visit would leave another interval running and the feed would speed up.
  React.useEffect(() => {
    setEvents([]);
    const timer = setInterval(() => {
      // The updates take the previous value, because this callback only ever sees the state from the render it was created in
      setViewers((count) => Math.max(1, count + Math.floor(Math.random() * 3) - 1));
      setEvents((previous) => [fakeEvent(), ...previous].slice(0, 5));
    }, 4000);
    return () => clearInterval(timer);
  }, [id]);

  // Worked out from the reviews on every render, so it is always in step with the table
  const summary = summarize(reviews);

  if (place === undefined) {
    return <main className="container" />;
  }

  if (place === null) {
    return (
      <main className="container">
        <section className="gg-card text-center">
          <h2>Restaurant not found</h2>
          <p>We couldn't find a restaurant with that id.</p>
          <Link className="btn btn-success" to="/">
            Search for a restaurant
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="page-intro">
        <h2>{place.name}</h2>
        <p>
          {place.address}. {place.hours}.
        </p>
      </div>

      <div className="restaurant-grid">
        <section className="gg-card" id="safety-profile">
          <h3>Gluten-free safety profile</h3>
          <div className="rating-summary">
            {summary.rating === null ? (
              <p>No reviews yet, so there is no rating.</p>
            ) : (
              <>
                <span className={`rating-badge ${badgeClass(summary.rating)}`}>{formatRating(summary.rating)}</span>
                <p>
                  Cross-contamination rating from{' '}
                  <strong>
                    {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
                  </strong>
                </p>
              </>
            )}
          </div>
          <ul className="practice-list">
            {practiceRows.map(({ key, label }) => {
              const practice = summary[key];
              return (
                <li key={key} className={`practice-${practice.level}`}>
                  <span>
                    <span className="practice-icon" aria-hidden="true"></span>
                    {label}
                  </span>{' '}
                  <span>
                    <strong className={`answer-${practice.level === 'unknown' ? 'unsure' : practice.level}`}>{practice.label}</strong>
                    {practice.total > 0 && ` (${practice.agree} of ${practice.total} agree)`}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="confidence-row">
            <div className={`confidence ${summary.celiac.level}`}>
              <span className="confidence-label">Celiac confidence</span>
              <strong>{summary.celiac.label}</strong>
            </div>
            <div className={`confidence ${summary.sensitive.level}`}>
              <span className="confidence-label">Gluten-sensitive confidence</span>
              <strong>{summary.sensitive.label}</strong>
            </div>
          </div>
          {userName ? (
            <Link className="btn btn-success" to={`/review/${place.id}`}>
              Write a review for this restaurant
            </Link>
          ) : (
            <Link className="btn btn-outline-success" to="/">
              Log in to write a review
            </Link>
          )}
        </section>

        <section className="gg-card" id="live-activity">
          <h3>Live activity</h3>
          {/* Mocked with setInterval until the WebSocket service exists */}
          <p className="viewer-count">
            <strong>{viewers === 1 ? '1 person is' : `${viewers} people are`}</strong> viewing this restaurant right now.
          </p>
          {events.length === 0 ? (
            <p className="feed-empty">Waiting for activity...</p>
          ) : (
            <ul className="live-feed">
              {events.map((event) => (
                <li key={event.id}>
                  <span>
                    {event.text}
                    <time className="feed-time">{timeAgo(event.time)}</time>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="placeholder-note">This feed updates in real time over a WebSocket as other users view and review this restaurant.</p>
        </section>

        <section className="gg-card" id="reviews">
          <h3>Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to write one.</p>
          ) : (
            <div className="table-responsive">
              <p className="scroll-hint">Swipe to see more →</p>
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Separate fryer</th>
                    <th>Review</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td className="reviewer">{review.userName}</td>
                      <td>
                        <span className={`rating-badge ${badgeClass(reviewRating(review))}`}>{formatRating(reviewRating(review))}</span>
                      </td>
                      <td className={`answer-${review.fryer}`}>{answerLabels[review.fryer]}</td>
                      <td className="review-text">{review.comments}</td>
                      <td>{review.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="placeholder-note">Reviews are stored in the database and loaded when this page opens.</p>
        </section>
      </div>
    </main>
  );
}
