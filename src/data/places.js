import { restaurants } from './mockData';

// Mock Google Places API. Each function returns the same shape the service endpoint will
// return once it calls Google Places for real: { id, name, address, hours }.

export function searchPlaces(query) {
  // This will be replaced with a Google Places text search
  const text = query.trim().toLowerCase();
  if (!text) {
    return [];
  }
  return restaurants.filter((place) => place.name.toLowerCase().includes(text) || place.address.toLowerCase().includes(text));
}

export function getPlaceDetails(id) {
  // This will be replaced with a Google Places details request
  return restaurants.find((place) => place.id === id) ?? null;
}

export function getAllPlaces() {
  // This will be replaced with the list of reviewed restaurants from the database
  return restaurants;
}
