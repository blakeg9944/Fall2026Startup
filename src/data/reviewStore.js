import { seedReviews } from './mockData';

// Reviews are kept in localStorage until the database exists.
// Every function here will be replaced with a call to the review service endpoints.

const STORAGE_KEY = 'reviews';

export function getReviews() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through and reseed if the stored value was corrupted
    }
  }
  saveReviews(seedReviews);
  return [...seedReviews];
}

export function getReviewsForRestaurant(restaurantId) {
  return newestFirst(getReviews().filter((review) => review.restaurantId === restaurantId));
}

export function getReviewsByUser(userName) {
  return newestFirst(getReviews().filter((review) => review.userName === userName));
}

export function getReview(id) {
  return getReviews().find((review) => review.id === id);
}

export function addReview(review) {
  const newReview = { ...review, id: crypto.randomUUID(), date: today() };
  saveReviews([...getReviews(), newReview]);
  return newReview;
}

export function updateReview(id, changes) {
  const reviews = getReviews().map((review) => (review.id === id ? { ...review, ...changes, id } : review));
  saveReviews(reviews);
}

export function deleteReview(id) {
  saveReviews(getReviews().filter((review) => review.id !== id));
}

function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function newestFirst(reviews) {
  return [...reviews].sort((a, b) => b.date.localeCompare(a.date));
}

// YYYY-MM-DD in the user's own time zone (toISOString would use UTC and can be a day ahead at night)
function today() {
  return new Date().toLocaleDateString('en-CA');
}
