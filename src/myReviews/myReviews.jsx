import React from 'react';
import { Link } from 'react-router-dom';
import './myReviews.css';

export function MyReviews() {
  return (
    <main className="container">
      <div className="page-intro">
        <h2>My reviews</h2>
      </div>

      <div className="my-reviews-grid">
        <section className="gg-card" id="user-summary">
          {/* Placeholder: the logged in user's name comes from the authenticated session */}
          <div className="avatar" aria-hidden="true">
            C
          </div>
          <div className="summary-text">
            <p className="signed-in">
              Signed in as <strong>celiac_sarah</strong>
            </p>
            <p className="review-count">
              <strong>4</strong> reviews written. Thanks for helping other people eat safely.
            </p>
          </div>
          <Link className="btn btn-outline-secondary" to="/">
            Logout
          </Link>
        </section>

        <section className="gg-card" id="replies">
          <h3>Replies to your reviews</h3>
          {/* Placeholder: pushed over a WebSocket when someone interacts with this user's reviews */}
          <ul className="live-feed">
            <li>2 people marked your Black Sheep Cafe review helpful &mdash; a moment ago</li>
            <li>Black Sheep Cafe average rating changed to 4.2 / 5 &mdash; 6 minutes ago</li>
          </ul>
          <p className="placeholder-note">These notifications arrive in real time over a WebSocket.</p>
        </section>

        <section className="gg-card" id="review-history">
          <h3>Review history</h3>
          {/* Placeholder: these reviews are read from the database and filtered to this user */}
          <ul className="review-list">
            <li className="review-item">
              <div className="review-head">
                <div className="review-title">
                  <Link className="restaurant-link" to="/restaurant">
                    Backdoor Burger
                  </Link>
                  <time className="review-date" dateTime="2026-09-20">
                    2026-09-20
                  </time>
                </div>
                <span className="rating-badge safe">4 / 5</span>
              </div>
              <p className="review-text">Burger came on a gluten-free bun and the waffle fries and sweet potato fries were both safe. Staff confirmed the fries go in a dedicated fryer.</p>
              <div className="photo-row">
                <img src="/images/backdoor-burger-fries.jpg" alt="Basket of waffle fries with two cups of cheese sauce" />
                <img src="/images/backdoor-burger-burger.jpg" alt="Burger on a gluten-free bun with sweet potato waffle fries and dipping sauce" />
              </div>
              <div className="action-buttons">
                <Link className="btn btn-sm btn-outline-success" to="/review">
                  Edit
                </Link>
                <Link className="btn btn-sm btn-outline-danger" to="/my-reviews">
                  Delete
                </Link>
              </div>
            </li>
            <li className="review-item">
              <div className="review-head">
                <div className="review-title">
                  <Link className="restaurant-link" to="/restaurant">
                    Black Sheep Cafe
                  </Link>
                  <time className="review-date" dateTime="2026-09-14">
                    2026-09-14
                  </time>
                </div>
                <span className="rating-badge safe">5 / 5</span>
              </div>
              <p className="review-text">Server knew exactly what celiac means and flagged the order to the kitchen. No reaction at all.</p>
              <div className="action-buttons">
                <Link className="btn btn-sm btn-outline-success" to="/review">
                  Edit
                </Link>
                <Link className="btn btn-sm btn-outline-danger" to="/my-reviews">
                  Delete
                </Link>
              </div>
            </li>
            <li className="review-item">
              <div className="review-head">
                <div className="review-title">
                  <Link className="restaurant-link" to="/restaurant">
                    Communal Restaurant
                  </Link>
                  <time className="review-date" dateTime="2026-08-30">
                    2026-08-30
                  </time>
                </div>
                <span className="rating-badge safe">5 / 5</span>
              </div>
              <p className="review-text">They keep a dedicated GF prep station and the chef came out to talk through the menu with me.</p>
              <div className="action-buttons">
                <Link className="btn btn-sm btn-outline-success" to="/review">
                  Edit
                </Link>
                <Link className="btn btn-sm btn-outline-danger" to="/my-reviews">
                  Delete
                </Link>
              </div>
            </li>
            <li className="review-item">
              <div className="review-head">
                <div className="review-title">
                  <Link className="restaurant-link" to="/restaurant">
                    Guru's Cafe
                  </Link>
                  <time className="review-date" dateTime="2026-08-12">
                    2026-08-12
                  </time>
                </div>
                <span className="rating-badge risk">2 / 5</span>
              </div>
              <p className="review-text">Shared fryer for everything. Staff were kind but could not answer basic cross-contamination questions.</p>
              <div className="action-buttons">
                <Link className="btn btn-sm btn-outline-success" to="/review">
                  Edit
                </Link>
                <Link className="btn btn-sm btn-outline-danger" to="/my-reviews">
                  Delete
                </Link>
              </div>
            </li>
          </ul>
          <p className="placeholder-note">Your reviews are stored in the database and can be edited or deleted at any time.</p>
        </section>
      </div>
    </main>
  );
}
