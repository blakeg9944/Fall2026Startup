import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Leaflet looks up its marker images by guessing file paths, which breaks once Vite bundles the app.
// Importing the images gives Vite the real URLs to hand to Leaflet.
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const pin = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

// An OpenStreetMap map centered on one restaurant, with a pin on it.
// Leaflet draws into a plain DOM element on its own, so React only gives it a div and cleans it up afterward.
export function LocationMap({ lat, lng, name }) {
  const mapElement = React.useRef(null);

  React.useEffect(() => {
    const map = L.map(mapElement.current).setView([lat, lng], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.marker([lat, lng], { icon: pin, title: name }).addTo(map);

    // Without this, the map stays alive after the user leaves, and drawing into the same div again throws an error
    return () => map.remove();
  }, [lat, lng, name]);

  return <div ref={mapElement} className="location-map" role="img" aria-label={`Map showing the location of ${name}`}></div>;
}
