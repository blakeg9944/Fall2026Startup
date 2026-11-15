const googleConfig = require('./googleConfig.json');

// Calls to the Google Places API (New) happen here so the key never leaves the server.
// The field mask tells Google which fields to send back. Asking only for the basic ones keeps each call in the cheapest billing tier.
const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
const searchFields = 'places.id,places.displayName,places.formattedAddress,places.location';

const detailsUrl = 'https://places.googleapis.com/v1/places/';
const detailsFields = 'id,displayName,formattedAddress,location,regularOpeningHours,utcOffsetMinutes';

// Google's terms only allow keeping place details for a short time (only the place ID may be stored for good),
// so details are cached in memory for an hour. That saves repeat calls when several pages ask about the same
// restaurant, and nothing is kept after a restart. Reviews store the place ID only and look the rest up here.
const cacheMilliseconds = 60 * 60 * 1000;
const detailsCache = new Map();

// Turns one Google place into the shape the frontend already uses: { id, name, address, location }
function toPlace(googlePlace) {
  return {
    id: googlePlace.id,
    name: googlePlace.displayName?.text ?? '',
    address: googlePlace.formattedAddress ?? '',
    location: { lat: googlePlace.location?.latitude, lng: googlePlace.location?.longitude },
  };
}

// Text search for restaurants. Resolves to an array of places, or throws if Google rejects the request.
async function searchPlaces(text) {
  const response = await fetch(searchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': googleConfig.apiKey,
      'X-Goog-FieldMask': searchFields,
    },
    body: JSON.stringify({ textQuery: text, includedType: 'restaurant', pageSize: 10 }),
  });

  if (!response.ok) {
    throw new Error(`Google Places search failed with status ${response.status}: ${await response.text()}`);
  }

  // Google leaves out the places field entirely when nothing matches
  const body = await response.json();
  return (body.places ?? []).map(toPlace);
}

// Hours for the restaurant's current day, e.g. "Monday: 11:00 AM – 9:00 PM".
// Google lists the days Monday first and gives the restaurant's UTC offset, so "today" is the restaurant's today, not the server's.
function todaysHours(googlePlace) {
  const days = googlePlace.regularOpeningHours?.weekdayDescriptions;
  if (!days || days.length !== 7) {
    return 'Hours not listed';
  }
  const local = new Date(Date.now() + (googlePlace.utcOffsetMinutes ?? 0) * 60 * 1000);
  return days[(local.getUTCDay() + 6) % 7];
}

// Looks up one place by its Google place ID. Resolves to null if Google doesn't know the ID,
// and throws if the request itself fails.
async function getPlaceDetails(id) {
  const cached = detailsCache.get(id);
  if (cached && cached.expires > Date.now()) {
    return { ...cached.place, hours: todaysHours(cached.google) };
  }

  const response = await fetch(`${detailsUrl}${encodeURIComponent(id)}`, {
    headers: { 'X-Goog-Api-Key': googleConfig.apiKey, 'X-Goog-FieldMask': detailsFields },
  });
  // Google answers 404 for a well formed ID it doesn't have and 400 for a malformed one
  if (response.status === 404 || response.status === 400) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Google Places details failed with status ${response.status}: ${await response.text()}`);
  }

  const google = await response.json();
  const place = toPlace(google);
  detailsCache.set(id, { place, google, expires: Date.now() + cacheMilliseconds });
  return { ...place, hours: todaysHours(google) };
}

module.exports = { searchPlaces, getPlaceDetails };
