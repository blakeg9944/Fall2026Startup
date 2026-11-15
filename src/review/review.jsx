import React from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getPlaceDetails } from '../data/places';
import { addReview, getReview, updateReview } from '../data/reviewStore';
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

// The reviewer's own overall score, shown with the same radio buttons as the confidence questions
const ratingOptions = [
  { value: 5, label: '5 - Excellent' },
  { value: 4, label: '4 - Good' },
  { value: 3, label: '3 - Okay' },
  { value: 2, label: '2 - Poor' },
  { value: 1, label: '1 - Not safe' },
];

// A group of radio buttons whose checked state comes from the form instead of the browser
function ConfidenceQuestion({ field, question, value, onChange, options = confidenceOptions }) {
  return (
    <>
      <p className="question">{question}</p>
      <div className="choice-row">
        {options.map((option) => (
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
  // /review/:id?edit=<reviewId> edits an existing review instead of writing a new one
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  // undefined means still loading, null means the id doesn't match any restaurant
  const [place, setPlace] = React.useState(undefined);
  // True when the service couldn't be reached, which is different from the id not matching a restaurant
  const [loadFailed, setLoadFailed] = React.useState(false);

  React.useEffect(() => {
    let ignore = false;
    setPlace(undefined);
    setLoadFailed(false);
    getPlaceDetails(id)
      .then((found) => {
        if (!ignore) setPlace(found);
      })
      .catch(() => {
        if (!ignore) setLoadFailed(true);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  // One object holds every field, so the whole form can be saved as a review later.
  // Kitchen answers start on "unsure" so a review never claims something the user didn't pick.
  const [form, setForm] = React.useState({
    fryer: 'unsure',
    grill: 'unsure',
    prep: 'unsure',
    menu: 'unsure',
    rating: null,
    celiac: null,
    sensitive: null,
    staff: false,
    comments: '',
  });

  // Copies the old form and replaces one field. React needs a new object to notice the change.
  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  // The review being edited: undefined while it loads, null if there isn't one
  const [existing, setExisting] = React.useState(undefined);
  const [saveError, setSaveError] = React.useState('');

  // Load the saved review and fill the form with it, and again if the review being edited changes
  React.useEffect(() => {
    let ignore = false;
    if (!editId) {
      setExisting(null);
      return;
    }
    setExisting(undefined);
    getReview(editId).then((saved) => {
      if (ignore) return;
      setExisting(saved);
      if (saved) {
        const { fryer, grill, prep, menu, celiac, sensitive, staff, comments } = saved;
        // Reviews saved before ratings existed get the average of their two confidence answers as a starting point
        const rating = saved.rating ?? Math.round((celiac + sensitive) / 2);
        setForm({ rating, fryer, grill, prep, menu, celiac, sensitive, staff, comments });
      }
    });
    return () => {
      ignore = true;
    };
  }, [editId]);

  // Only the author can edit a review, and only from its own restaurant's URL
  const canEdit = existing && place && existing.userName === userName && existing.restaurantId === place.id;

  async function submit(e) {
    e.preventDefault();
    setSaveError('');
    try {
      if (editId) {
        // The service keeps the review's id, author, date, and photos as they were
        await updateReview(editId, form);
        navigate('/my-reviews');
      } else {
        // The service adds the review's id, author, and date. Photos are not saved yet.
        await addReview({ restaurantId: place.id, ...form });
        navigate(`/restaurant/${place.id}`);
      }
    } catch (err) {
      setSaveError(err.message);
    }
  }

  if (loadFailed) {
    return (
      <main className="container">
        <section className="gg-card text-center">
          <h2>Couldn't load this restaurant</h2>
          <p>The service didn't respond. Please try again in a moment.</p>
        </section>
      </main>
    );
  }

  if (place === undefined) {
    return <main className="container" />;
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

  // Wait for the saved review before deciding whether it can be edited
  if (editId && existing === undefined) {
    return <main className="container" />;
  }

  if (editId && !canEdit) {
    return (
      <main className="container">
        <section className="gg-card text-center">
          <h2>Review not found</h2>
          <p>That review doesn't exist, or it belongs to someone else.</p>
          <Link className="btn btn-success" to="/my-reviews">
            Back to My Reviews
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="page-intro">
        <h2>{editId ? 'Edit your review' : 'Write a review'}</h2>
        <p>
          {editId ? 'Editing your review of' : 'Reviewing'} <strong>{place.name}</strong> at {place.address}
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
          <legend>Overall rating</legend>

          <ConfidenceQuestion field="rating" question="How would you rate this restaurant for gluten-free dining?" value={form.rating} onChange={update} options={ratingOptions} />
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
            <textarea className="form-control" id="comments" name="comments" rows={6} maxLength={2000} value={form.comments} onChange={(e) => update('comments', e.target.value)} placeholder="What did you order? Did you ask about cross-contamination? How did you feel afterward?" />
          </div>

          <label htmlFor="photo" className="form-label">
            Add a photo of the menu or your meal
          </label>
          <input className="form-control" type="file" id="photo" name="photo" accept="image/*" />
        </fieldset>

        {saveError && (
          <p className="text-danger" role="alert">
            {saveError}
          </p>
        )}
        <div className="button-row">
          <button type="submit" className="btn btn-success" disabled={!form.rating || !form.celiac || !form.sensitive}>
            {editId ? 'Save changes' : 'Submit review'}
          </button>
          <Link className="btn btn-outline-secondary" to={editId ? '/my-reviews' : `/restaurant/${place.id}`}>
            Cancel
          </Link>
        </div>
      </form>

      <p className="placeholder-note">Submitted reviews are saved by the GlutenGuard service. Broadcasting them to everyone viewing this restaurant will come with WebSockets.</p>
    </main>
  );
}
