// Restaurant names and addresses come from the service's places endpoints.
// For now the service answers with mock data shaped like the Google Places API: { id, name, address, hours }.
// A failed request (network down or a server error) throws, so the page can tell the user something went wrong
// instead of showing "no results". The only quiet outcome is getPlaceDetails returning null for an unknown id.

export async function searchPlaces(query) {
  const text = query.trim();
  if (!text) {
    return [];
  }
  return readJson(`/api/places?q=${encodeURIComponent(text)}`);
}

// Returns null when the id doesn't match a restaurant
export async function getPlaceDetails(id) {
  return readJson(`/api/places/${encodeURIComponent(id)}`, true);
}

export async function getAllPlaces() {
  return readJson('/api/places');
}

// Throws if the request fails or the service answers with an error.
// With allowNotFound, a 404 returns null instead because it is an expected answer.
async function readJson(url, allowNotFound = false) {
  const response = await fetch(url);
  if (allowNotFound && response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}
