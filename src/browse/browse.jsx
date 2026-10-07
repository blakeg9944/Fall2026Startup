import React from 'react';
import { Link } from 'react-router-dom';
import './browse.css';

export function Browse() {
  return (
    <main className="container">
      <div className="page-intro">
        <h2>Browse reviews near you</h2>
        <p>Every pin is a restaurant that GlutenGuard users have reviewed. Pick one to read the full safety profile.</p>
      </div>

      <div className="browse-grid">
        <section className="gg-card" id="map">
          <h3>Map</h3>
          {/* Placeholder: replaced by an interactive map from the Google Maps API */}
          <div className="map-frame">
            <img src="/placeholder.png" alt="Map of reviewed restaurants near Provo, Utah" />
          </div>
          <p className="placeholder-note">This map is rendered by the Google Maps API and pinned using place IDs from the Google Places API.</p>
        </section>

        <section className="gg-card" id="restaurant-list">
          <h3>Reviewed restaurants</h3>
          {/* Placeholder: this list is loaded from the database */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Address</th>
                  <th>Rating</th>
                  <th>Reviews</th>
                  <th>Separate fryer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Link to="/restaurant">Black Sheep Cafe</Link>
                  </td>
                  <td>19 N University Ave, Provo UT</td>
                  <td>
                    <span className="rating-badge safe">4.2 / 5</span>
                  </td>
                  <td>38</td>
                  <td className="answer-yes">Yes</td>
                </tr>
                <tr>
                  <td>
                    <Link to="/restaurant">Communal Restaurant</Link>
                  </td>
                  <td>102 N University Ave, Provo UT</td>
                  <td>
                    <span className="rating-badge safe">4.8 / 5</span>
                  </td>
                  <td>21</td>
                  <td className="answer-yes">Yes</td>
                </tr>
                <tr>
                  <td>
                    <Link to="/restaurant">Rockwell Ice Cream Co.</Link>
                  </td>
                  <td>165 N University Ave, Provo UT</td>
                  <td>
                    <span className="rating-badge caution">3.6 / 5</span>
                  </td>
                  <td>12</td>
                  <td className="answer-na">N/A</td>
                </tr>
                <tr>
                  <td>
                    <Link to="/restaurant">Guru's Cafe</Link>
                  </td>
                  <td>45 E Center St, Provo UT</td>
                  <td>
                    <span className="rating-badge risk">2.9 / 5</span>
                  </td>
                  <td>17</td>
                  <td className="answer-no">No</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="placeholder-note">Restaurants and their aggregated ratings are stored in the database.</p>
        </section>

        <section className="gg-card" id="recent-activity">
          <h3>Recent activity</h3>
          {/* Placeholder: pushed over a WebSocket as users post reviews anywhere in the app */}
          <ul className="live-feed">
            <li>celiac_sarah reviewed Black Sheep Cafe &mdash; a moment ago</li>
            <li>provo_foodie reviewed Guru's Cafe &mdash; 4 minutes ago</li>
            <li>mtn_biker_dave reviewed Communal Restaurant &mdash; 11 minutes ago</li>
          </ul>
          <p className="placeholder-note">New reviews appear here in real time over a WebSocket.</p>
        </section>
      </div>
    </main>
  );
}
