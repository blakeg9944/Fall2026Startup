import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadGoogleMaps } from '../data/googleMaps';

// Provo, used until there are pins to fit the view around
const defaultCenter = { lat: 40.2338, lng: -111.6585 };

// An interactive Google map with one pin for each place. Clicking a pin opens its name and a link to the restaurant page.
export function ReviewMap({ places }) {
  const navigate = useNavigate();
  const container = React.useRef(null);
  const mapRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  // Create the map once, after the script loads
  React.useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(async (maps) => {
        const { Map } = await maps.importLibrary('maps');
        if (cancelled) return;
        // A mapId is required for the advanced markers. DEMO_MAP_ID is Google's id for development and small projects.
        mapRef.current = new Map(container.current, { center: defaultCenter, zoom: 12, mapId: 'DEMO_MAP_ID' });
        setReady(true);
      })
      .catch((error) => {
        console.error('Map failed to load:', error);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Draw the pins whenever the places change, and remove the old ones first
  React.useEffect(() => {
    if (!ready) {
      return;
    }
    let cancelled = false;
    const markers = [];
    (async () => {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');
      if (cancelled) return;
      const info = new window.google.maps.InfoWindow();
      const bounds = new window.google.maps.LatLngBounds();

      for (const place of places) {
        if (!place.location || place.location.lat == null) continue;
        const marker = new AdvancedMarkerElement({ map: mapRef.current, position: place.location, title: place.name, gmpClickable: true });
        marker.addEventListener('gmp-click', () => {
          // Built from DOM nodes with textContent, so a restaurant name can never be read as HTML
          const box = document.createElement('div');
          const name = document.createElement('strong');
          name.textContent = place.name;
          const link = document.createElement('button');
          link.type = 'button';
          link.className = 'btn btn-sm btn-success d-block mt-2';
          link.textContent = 'View reviews';
          link.addEventListener('click', () => navigate(`/restaurant/${place.id}`));
          box.append(name, link);
          info.setContent(box);
          info.open({ map: mapRef.current, anchor: marker });
        });
        markers.push(marker);
        bounds.extend(place.location);
      }

      if (markers.length === 1) {
        mapRef.current.setCenter(places[0].location);
        mapRef.current.setZoom(15);
      } else if (markers.length > 1) {
        mapRef.current.fitBounds(bounds, 40);
      }
    })();
    return () => {
      cancelled = true;
      markers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [ready, places, navigate]);

  if (failed) {
    return (
      <p className="text-danger" role="alert">
        Couldn't load the map. The restaurant list still works.
      </p>
    );
  }
  return <div ref={container} className="map-canvas" role="region" aria-label="Map of reviewed restaurants" />;
}
