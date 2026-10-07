import React from 'react';
import { Link } from 'react-router-dom';
import './review.css';

export function Review() {
  return (
    <main className="container">
      {/* Placeholder: the restaurant being reviewed comes from the Google Places API */}
      <div className="page-intro">
        <h2>Write a review</h2>
        <p>
          Reviewing <strong>Black Sheep Cafe</strong> &mdash; 19 N University Ave, Provo UT
        </p>
        <p>Answer what you can. Even a partial review helps someone decide whether it is safe to eat here.</p>
      </div>

      <form method="get" action="/restaurant" className="review-form">
        <fieldset className="gg-card">
          <legend>Kitchen practices</legend>
          <div className="question-grid">
            <div>
              <label htmlFor="fryer" className="form-label">
                Does the kitchen use a separate fryer?
              </label>
              <select className="form-select" id="fryer" name="fryer">
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unsure">Unsure</option>
              </select>
            </div>
            <div>
              <label htmlFor="grill" className="form-label">
                Does the kitchen use a separate grill or prep surface?
              </label>
              <select className="form-select" id="grill" name="grill">
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unsure">Unsure</option>
              </select>
            </div>
            <div>
              <label htmlFor="prep" className="form-label">
                Is there a dedicated gluten-free prep area?
              </label>
              <select className="form-select" id="prep" name="prep">
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unsure">Unsure</option>
              </select>
            </div>
            <div>
              <label htmlFor="menu" className="form-label">
                Is there a dedicated gluten-free menu?
              </label>
              <select className="form-select" id="menu" name="menu">
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unsure">Unsure</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="gg-card">
          <legend>Confidence</legend>

          <p className="question">How confident would someone with celiac disease feel eating here?</p>
          <div className="choice-row">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="celiac" id="celiac-5" value="5" />
              <label className="form-check-label" htmlFor="celiac-5">
                Very confident
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="celiac" id="celiac-4" value="4" />
              <label className="form-check-label" htmlFor="celiac-4">
                Mostly confident
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="celiac" id="celiac-3" value="3" />
              <label className="form-check-label" htmlFor="celiac-3">
                Neutral
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="celiac" id="celiac-2" value="2" />
              <label className="form-check-label" htmlFor="celiac-2">
                Uneasy
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="celiac" id="celiac-1" value="1" />
              <label className="form-check-label" htmlFor="celiac-1">
                Would not risk it
              </label>
            </div>
          </div>

          <p className="question">How confident would someone who is gluten-sensitive feel eating here?</p>
          <div className="choice-row">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="sensitive" id="sensitive-5" value="5" />
              <label className="form-check-label" htmlFor="sensitive-5">
                Very confident
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="sensitive" id="sensitive-4" value="4" />
              <label className="form-check-label" htmlFor="sensitive-4">
                Mostly confident
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="sensitive" id="sensitive-3" value="3" />
              <label className="form-check-label" htmlFor="sensitive-3">
                Neutral
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="sensitive" id="sensitive-2" value="2" />
              <label className="form-check-label" htmlFor="sensitive-2">
                Uneasy
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="sensitive" id="sensitive-1" value="1" />
              <label className="form-check-label" htmlFor="sensitive-1">
                Would not risk it
              </label>
            </div>
          </div>

          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="staff" name="staff" />
            <label className="form-check-label" htmlFor="staff">
              Did the staff understand celiac safety?
            </label>
          </div>
        </fieldset>

        <fieldset className="gg-card">
          <legend>Your experience</legend>

          <div className="mb-3">
            <label htmlFor="comments" className="form-label">
              Tell other diners what happened
            </label>
            <textarea className="form-control" id="comments" name="comments" rows={6} placeholder="What did you order? Did you ask about cross-contamination? How did you feel afterward?" />
          </div>

          <label htmlFor="photo" className="form-label">
            Add a photo of the menu or your meal
          </label>
          <input className="form-control" type="file" id="photo" name="photo" accept="image/*" />
        </fieldset>

        <div className="button-row">
          <button type="submit" className="btn btn-success">
            Submit review
          </button>
          <Link className="btn btn-outline-secondary" to="/restaurant">
            Cancel
          </Link>
        </div>
      </form>

      <p className="placeholder-note">Submitted reviews are saved to the database and broadcast to everyone viewing this restaurant.</p>
    </main>
  );
}
