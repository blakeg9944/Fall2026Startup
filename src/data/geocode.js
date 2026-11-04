// Turns an address into map coordinates using Nominatim, the free OpenStreetMap geocoding service.
// This is a third party service called straight from the browser. It needs no key and allows CORS.
// Nominatim's usage policy allows about one request per second and no search-as-you-type,
// so each address is looked up once and the answer is remembered until the page is reloaded.

const cache = new Map();

// Returns { lat, lng } or null if the address wasn't found or the lookup failed
export function geocode(address) {
  if (!cache.has(address)) {
    cache.set(address, lookup(address));
  }
  return cache.get(address);
}

async function lookup(address) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`);
    if (!response.ok) {
      throw new Error(`Nominatim answered ${response.status}`);
    }
    const [match] = await response.json();
    // Nominatim sends the coordinates as strings
    return match ? { lat: Number(match.lat), lng: Number(match.lon) } : null;
  } catch {
    // Forget the failure so the next visit tries again
    cache.delete(address);
    return null;
  }
}
