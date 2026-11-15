// Loads the Google Maps JavaScript API once and gives back the google.maps object.
// The key is read from VITE_GOOGLE_MAPS_KEY in .env. Unlike the service's key it is visible in the browser,
// so it is restricted in Google Cloud to this site's addresses and to the Maps JavaScript API only.

let loading = null;

export function loadGoogleMaps() {
  if (loading) {
    return loading;
  }

  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  loading = new Promise((resolve, reject) => {
    if (!key) {
      reject(new Error('VITE_GOOGLE_MAPS_KEY is not set'));
      return;
    }
    // Google calls this when the key is rejected, e.g. a referrer that isn't on the key's list
    window.gm_authFailure = () => reject(new Error('Google rejected the Maps key'));
    // With loading=async the script's onload fires before the API is ready (importLibrary doesn't exist yet),
    // so wait for Google to call this callback instead.
    window.onGoogleMapsReady = () => resolve(window.google.maps);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&libraries=marker&callback=onGoogleMapsReady`;
    script.async = true;
    script.onerror = () => reject(new Error('The Google Maps script failed to load'));
    document.head.appendChild(script);
  });
  // A failed load can be tried again the next time the page opens
  loading.catch(() => {
    loading = null;
  });
  return loading;
}
