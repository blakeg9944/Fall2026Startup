import React from 'react';
import { Link } from 'react-router-dom';
import { getPlaceDetails } from '../data/places';
import { deleteReview, getReviewsByUser } from '../data/reviewStore';
import { badgeClass, formatRating, reviewRating } from '../data/stats';
import { timeAgo } from '../timeAgo';
import './myReviews.css';

// Stands in for a notification arriving over the WebSocket, about one of the user's own reviews
function fakeNotification(review) {
  const place = getPlaceDetails(review.restaurantId);
  const name = place ? place.name : 'a restaurant';
  const people = 1 + Math.floor(Math.random() * 4);
  const text = Math.random() < 0.5 ? `${people} ${people === 1 ? 'person' : 'people'} marked your ${name} review helpful` : `Someone replied to your ${name} review`;
  return { id: crypto.randomUUID(), text, time: Date.now() };
}

export function MyReviews({ userName, onLogout }) {
  const [reviews, setReviews] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);

  // Load this user's reviews on mount, and again if someone else logs in
  React.useEffect(() => {
    setReviews(userName ? getReviewsByUser(userName) : []);
  }, [userName]);

  // Mock WebSocket: every few seconds a notification arrives about one of the user's reviews.
  // It restarts when the list changes, so deleted reviews stop getting notifications.
  // The cleanup stops the timer when the user leaves the page.
  React.useEffect(() => {
    if (reviews.length === 0) {
      return;
    }
    const timer = setInterval(() => {
      const review = reviews[Math.floor(Math.random() * reviews.length)];
      setNotifications((previous) => [fakeNotification(review), ...previous].slice(0, 5));
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews]);

  function remove(review, placeName) {
    if (!window.confirm(`Delete your review of ${placeName}? This can't be undone.`)) {
      return;
    }
    deleteReview(review.id);
    // Drop it from state too, so the list and the count update without reloading
    setReviews((previous) => previous.filter((item) => item.id !== review.id));
  }

  if (!userName) {
    return (
      <main className="container">
        <section className="gg-card text-center">
          <h2>Log in to see your reviews</h2>
          <p>Your reviews are tied to your account.</p>
          <Link className="btn btn-success" to="/">
            Log in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="page-intro">
        <h2>My reviews</h2>
      </div>

      <div className="my-reviews-grid">
        <section className="gg-card" id="user-summary">
          <div className="avatar" aria-hidden="true">
            {userName[0].toUpperCase()}
          </div>
          <div className="summary-text">
            <p className="signed-in">
              Signed in as <strong>{userName}</strong>
            </p>
            <p className="review-count">
              <strong>{reviews.length}</strong> {reviews.length === 1 ? 'review' : 'reviews'} written. Thanks for helping other people eat safely.
            </p>
          </div>
          <Link className="btn btn-outline-secondary" to="/" onClick={onLogout}>
            Logout
          </Link>
        </section>

        <section className="gg-card" id="replies">
          <h3>Replies to your reviews</h3>
          {/* Mocked with setInterval until the WebSocket service exists */}
          {notifications.length === 0 ? (
            <p className="feed-empty">No notifications yet.</p>
          ) : (
            <ul className="live-feed">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <span>
                    {notification.text}
                    <time className="feed-time">{timeAgo(notification.time)}</time>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="placeholder-note">These notifications arrive in real time over a WebSocket.</p>
        </section>

        <section className="gg-card" id="review-history">
          <h3>Review history</h3>
          {reviews.length === 0 ? (
            <p>
              You haven't written any reviews yet. <Link to="/">Search for a restaurant</Link> to write your first one.
            </p>
          ) : (
            <ul className="review-list">
              {reviews.map((review) => {
                const place = getPlaceDetails(review.restaurantId);
                const rating = reviewRating(review);
                return (
                  <li className="review-item" key={review.id}>
                    <div className="review-head">
                      <div className="review-title">
                        <Link className="restaurant-link" to={`/restaurant/${review.restaurantId}`}>
                          {place ? place.name : review.restaurantId}
                        </Link>
                        <time className="review-date" dateTime={review.date}>
                          {review.date}
                        </time>
                      </div>
                      <span className={`rating-badge ${badgeClass(rating)}`}>{formatRating(rating)}</span>
                    </div>
                    <p className="review-text">{review.comments}</p>
                    {review.photos.length > 0 && (
                      <div className="photo-row">
                        {review.photos.map((photo, i) => (
                          <img key={i} src={photo.src} alt={photo.alt} />
                        ))}
                      </div>
                    )}
                    <div className="action-buttons">
                      <Link className="btn btn-sm btn-outline-success" to={`/review/${review.restaurantId}?edit=${review.id}`}>
                        Edit
                      </Link>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(review, place ? place.name : 'this restaurant')}>
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="placeholder-note">Your reviews are stored in the database and can be edited or deleted at any time.</p>
        </section>
      </div>
    </main>
  );
}
