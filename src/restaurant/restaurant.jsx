import React from 'react';
import { Link } from 'react-router-dom';
import './restaurant.css';

export function Restaurant() {
  return (
    <main className="container">
      {/* Placeholder: name, address, and hours come from the Google Places API */}
      <div className="page-intro">
        <h2>Black Sheep Cafe</h2>
        <p>19 N University Ave, Provo UT &mdash; Open until 9:00 PM</p>
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
          <Link className="btn btn-success" to="/review">
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
            <li>celiac_sarah just posted a 5 / 5 review &mdash; a moment ago</li>
            <li>Average rating updated to 4.2 / 5 &mdash; a moment ago</li>
            <li>provo_foodie is writing a review &mdash; 2 minutes ago</li>
          </ul>
          <p className="placeholder-note">This feed updates in real time over a WebSocket as other users view and review this restaurant.</p>
        </section>

        <section className="gg-card" id="reviews">
          <h3>Reviews</h3>
          {/* Placeholder: every review below is stored in and loaded from the database */}
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
                <tr>
                  <td className="reviewer">celiac_sarah</td>
                  <td>
                    <span className="rating-badge safe">5 / 5</span>
                  </td>
                  <td className="answer-yes">Yes</td>
                  <td className="review-text">Server knew exactly what celiac means and flagged the order to the kitchen. No reaction at all.</td>
                  <td>2026-09-14</td>
                </tr>
                <tr>
                  <td className="reviewer">mtn_biker_dave</td>
                  <td>
                    <span className="rating-badge safe">4 / 5</span>
                  </td>
                  <td className="answer-yes">Yes</td>
                  <td className="review-text">Dedicated GF fryer for the fries. Buns are stored on a separate shelf, but prep counter is shared.</td>
                  <td>2026-09-09</td>
                </tr>
                <tr>
                  <td className="reviewer">glutenfree_mom3</td>
                  <td>
                    <span className="rating-badge caution">3 / 5</span>
                  </td>
                  <td className="answer-unsure">Unsure</td>
                  <td className="review-text">Food was good and I felt fine, but nobody could answer my question about the grill.</td>
                  <td>2026-08-28</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="placeholder-note">Reviews are stored in the database and loaded when this page opens.</p>
        </section>
      </div>
    </main>
  );
}
