import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPlaceDetails } from '../data/places';
import { addReview } from '../data/reviewStore';
import './review.css';

const practiceQuestions = [
  { field: 'fryer', label: 'Does the kitchen use a separate fryer?' },
  { field: 'grill', label: 'Does the kitchen use a separate grill or prep surface?' },
  { field: 'prep', label: 'Is there a dedicated gluten-free prep area?' },
  { field: 'menu', label: 'Is there a dedicated gluten-free menu?' },
];

const confidenceOptions = [
  { value: 5, label: 'Very confident' },
  { value: 4, label: 'Mostly confident' },
  { value: 3, label: 'Neutral' },
  { value: 2, label: 'Uneasy' },
  { value: 1, label: 'Would not risk it' },
];

// A group of radio buttons whose checked state comes from the form instead of the browser
function ConfidenceQuestion({ field, question, value, onChange }) {
  return (
    <>
      <p className="question">{question}</p>
      <div className="choice-row">
        {confidenceOptions.map((option) => (
          <div className="form-check" key={option.value}>
            <input className="form-check-input" type="radio" name={field} id={`${field}-${option.value}`} value={option.value} checked={value === option.value} onChange={() => onChange(field, option.value)} />
            <label className="form-check-label" htmlFor={`${field}-${option.value}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

export function Review({ userName }) {
  const { id } = useParams();
  const navigate = useNavigate();
  // Looked up during render, since the mock lookup is synchronous
  const place = getPlaceDetails(id);

  // One object holds every field, so the whole form can be saved as a review later.
  // Kitchen answers start on "unsure" so a review never claims something the user didn't pick.
  const [form, setForm] = React.useState({
    fryer: 'unsure',
    grill: 'unsure',
    prep: 'unsure',
    menu: 'unsure',
    celiac: null,
    sensitive: null,
    staff: false,
    comments: '',
  });

  // Copies the old form and replaces one field. React needs a new object to notice the change.
  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    // The store adds the review's id and date. Photos are not saved yet.
    addReview({ restaurantId: place.id, userName, ...form, photos: [] });
    navigate(`/restaurant/${place.id}`);
  }

  if (!place) {
    return (
      <main className="container">
        <section className="gg-card text-center">
          <h2>Restaurant not found</h2>
          <p>We couldn't find a restaurant to review.</p>
          <Link className="btn btn-success" to="/">
            Search for a restaurant
          </Link>
        </section>
      </main>
    );
  }

  if (!userName) {
    return (
      <main className="container">
        <section className="gg-card text-center">
          <h2>Log in to write a review</h2>
          <p>You need an account to review {place.name}. Reading reviews doesn't require one.</p>
          <div className="button-row">
            <Link className="btn btn-success" to="/">
              Log in
            </Link>
            <Link className="btn btn-outline-secondary" to={`/restaurant/${place.id}`}>
              Back to {place.name}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="page-intro">
        <h2>Write a review</h2>
        <p>
          Reviewing <strong>{place.name}</strong> at {place.address}
        </p>
        <p>Answer what you can. Even a partial review helps someone decide whether it is safe to eat here.</p>
      </div>

      <form onSubmit={submit} className="review-form">
        <fieldset className="gg-card">
          <legend>Kitchen practices</legend>
          <div className="question-grid">
            {practiceQuestions.map(({ field, label }) => (
              <div key={field}>
                <label htmlFor={field} className="form-label">
                  {label}
                </label>
                <select className="form-select" id={field} name={field} value={form[field]} onChange={(e) => update(field, e.target.value)}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unsure">Unsure</option>
                </select>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="gg-card">
          <legend>Confidence</legend>

          <ConfidenceQuestion field="celiac" question="How confident would someone with celiac disease feel eating here?" value={form.celiac} onChange={update} />
          <ConfidenceQuestion field="sensitive" question="How confident would someone who is gluten-sensitive feel eating here?" value={form.sensitive} onChange={update} />

          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="staff" name="staff" checked={form.staff} onChange={(e) => update('staff', e.target.checked)} />
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
            <textarea className="form-control" id="comments" name="comments" rows={6} value={form.comments} onChange={(e) => update('comments', e.target.value)} placeholder="What did you order? Did you ask about cross-contamination? How did you feel afterward?" />
          </div>

          <label htmlFor="photo" className="form-label">
            Add a photo of the menu or your meal
          </label>
          <input className="form-control" type="file" id="photo" name="photo" accept="image/*" />
        </fieldset>

        <div className="button-row">
          <button type="submit" className="btn btn-success" disabled={!form.celiac || !form.sensitive}>
            Submit review
          </button>
          <Link className="btn btn-outline-secondary" to={`/restaurant/${place.id}`}>
            Cancel
          </Link>
        </div>
      </form>

      <p className="placeholder-note">Submitted reviews are saved to the database and broadcast to everyone viewing this restaurant.</p>
    </main>
  );
}
