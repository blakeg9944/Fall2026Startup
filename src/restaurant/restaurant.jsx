import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlaceDetails } from '../data/places';
import { getReviewsForRestaurant } from '../data/reviewStore';
import { badgeClass, formatRating, reviewRating } from '../data/stats';
import './restaurant.css';

const answerLabels = { yes: 'Yes', no: 'No', unsure: 'Unsure' };

export function Restaurant() {
  const { id } = useParams();
  // undefined means still loading, null means the id doesn't match any restaurant
  const [place, setPlace] = React.useState(undefined);
  const [reviews, setReviews] = React.useState([]);

  // Runs after the first render and again whenever the id in the URL changes
  React.useEffect(() => {
    setPlace(getPlaceDetails(id));
    setReviews(getReviewsForRestaurant(id));
  }, [id]);

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
          {/* Placeholder: these numbers are aggregated from all reviews in the database */}
          <div className="rating-summary">
            <span className="rating-badge safe">4.2 / 5</span>
            <p>
              Cross-contamination rating from <strong>38 reviews</strong>
            </p>
          </div>
          <ul className="practice-list">
            <li className="practice-yes"><span><span className="practice-icon" aria-hidden="true"></span>Separate fryer</span> <span><strong className="answer-yes">Yes</strong> (34 of 38 agree)</span></li>
            <li className="practice-yes"><span><span className="practice-icon" aria-hidden="true"></span>Separate grill or prep surface</span> <span><strong className="answer-yes">Yes</strong> (30 of 38 agree)</span></li>
            <li className="practice-yes"><span><span className="practice-icon" aria-hidden="true"></span>Dedicated gluten-free menu</span> <span><strong className="answer-yes">Yes</strong></span></li>
            <li className="practice-partial"><span><span className="practice-icon" aria-hidden="true"></span>Staff trained on celiac safety</span> <span><strong className="answer-partial">Usually</strong></span></li>
          </ul>
          <div className="confidence-row">
            <div className="confidence high">
              <span className="confidence-label">Celiac confidence</span>
              <strong>High</strong>
            </div>
            <div className="confidence high">
              <span className="confidence-label">Gluten-sensitive confidence</span>
              <strong>High</strong>
            </div>
          </div>
          <Link className="btn btn-success" to={`/review/${place.id}`}>
            Write a review for this restaurant
          </Link>
        </section>

        <section className="gg-card" id="live-activity">
          <h3>Live activity</h3>
          {/* Placeholder: everything in this section arrives over a WebSocket connection */}
          <p className="viewer-count">
            <strong>7 people</strong> are viewing this restaurant right now.
          </p>
          <ul className="live-feed">
            <li>
              <span>
                celiac_sarah posted a 5 / 5 review
                <time className="feed-time">a moment ago</time>
              </span>
            </li>
            <li>
              <span>
                Average rating updated to 4.2 / 5
                <time className="feed-time">a moment ago</time>
              </span>
            </li>
            <li>
              <span>
                provo_foodie started writing a review
                <time className="feed-time">2 minutes ago</time>
              </span>
            </li>
          </ul>
          <p className="placeholder-note">This feed updates in real time over a WebSocket as other users view and review this restaurant.</p>
        </section>

        <section className="gg-card" id="reviews">
          <h3>Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to write one.</p>
          ) : (
            <div className="table-responsive">
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
