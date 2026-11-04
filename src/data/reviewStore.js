// Reviews are kept by the service. These functions call its review endpoints with fetch.
// Reading never throws: a failed request gives an empty list (or null), so a page just shows no reviews.
// Writing throws an Error with the service's message, so the page can show it to the user.
// The service adds each review's id, author, and date, and checks that only the author edits or deletes it.

export async function getReviews() {
  return (await readJson('/api/reviews')) ?? [];
}

export async function getReviewsForRestaurant(restaurantId) {
  return newestFirst((await readJson(`/api/reviews?restaurantId=${encodeURIComponent(restaurantId)}`)) ?? []);
}

export async function getReviewsByUser(userName) {
  return newestFirst((await readJson(`/api/reviews?userName=${encodeURIComponent(userName)}`)) ?? []);
}

export async function getReview(id) {
  return readJson(`/api/reviews/${encodeURIComponent(id)}`);
}

export async function addReview(review) {
  return writeJson('/api/reviews', 'POST', review);
}

export async function updateReview(id, changes) {
  return writeJson(`/api/reviews/${encodeURIComponent(id)}`, 'PUT', changes);
}

export async function deleteReview(id) {
  await writeJson(`/api/reviews/${encodeURIComponent(id)}`, 'DELETE');
}

async function readJson(url) {
  try {
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

async function writeJson(url, method, body) {
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body),
    });
  } catch {
    throw new Error('Could not reach the server. Please try again.');
  }
  // DELETE answers 204 with no body
  const result = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    throw new Error(result?.msg ?? 'Something went wrong. Please try again.');
  }
  return result;
}

function newestFirst(reviews) {
  return [...reviews].sort((a, b) => b.date.localeCompare(a.date));
}
