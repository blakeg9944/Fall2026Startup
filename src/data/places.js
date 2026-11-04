// Restaurant names and addresses come from the service's places endpoints.
// For now the service answers with mock data shaped like the Google Places API: { id, name, address, hours }.
// A failed request gives an empty list (or null), so a page shows "no results" instead of crashing.

export async function searchPlaces(query) {
  const text = query.trim();
  if (!text) {
    return [];
  }
  return (await readJson(`/api/places?q=${encodeURIComponent(text)}`)) ?? [];
}

// Returns null when the id doesn't match a restaurant
export async function getPlaceDetails(id) {
  return readJson(`/api/places/${encodeURIComponent(id)}`);
}

export async function getAllPlaces() {
  return (await readJson('/api/places')) ?? [];
}

async function readJson(url) {
  try {
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}
