const googleConfig = require('./googleConfig.json');

// Calls to the Google Places API (New) happen here so the key never leaves the server.
// The field mask tells Google which fields to send back. Asking only for the basic ones keeps each call in the cheapest billing tier.
const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
const searchFields = 'places.id,places.displayName,places.formattedAddress,places.location';

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

module.exports = { searchPlaces };
