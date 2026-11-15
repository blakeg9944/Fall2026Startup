// Restaurant names, addresses, and locations come from the service's places endpoints, which call the Google Places API.
// A place looks like { id, name, address, location: { lat, lng } }, and details add today's hours.
// The id is the Google place ID, and it is the only part reviews store. Everything else is looked up when it is needed.
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

// Looks up several places at once, e.g. the restaurants that have reviews. Google has no "list every place" call,
// so pages that need a list build it from the place IDs they already have. IDs Google doesn't know are left out.
export async function getPlacesByIds(ids) {
  const places = await Promise.all([...new Set(ids)].map((id) => getPlaceDetails(id)));
  return places.filter(Boolean);
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
