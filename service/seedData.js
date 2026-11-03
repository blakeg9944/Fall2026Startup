// Seed data for the service until the database exists.
// Restaurants stand in for Google Places results.

const restaurants = [
  {
    id: 'black-sheep-cafe',
    name: 'Black Sheep Cafe',
    address: '19 N University Ave, Provo UT',
    hours: 'Open until 9:00 PM',
  },
  {
    id: 'communal-restaurant',
    name: 'Communal Restaurant',
    address: '102 N University Ave, Provo UT',
    hours: 'Open until 10:00 PM',
  },
  {
    id: 'rockwell-ice-cream',
    name: 'Rockwell Ice Cream Co.',
    address: '165 N University Ave, Provo UT',
    hours: 'Open until 11:00 PM',
  },
  {
    id: 'gurus-cafe',
    name: "Guru's Cafe",
    address: '45 E Center St, Provo UT',
    hours: 'Open until 9:00 PM',
  },
  {
    id: 'backdoor-burger',
    name: 'Backdoor Burger',
    address: '1240 N University Ave, Provo UT',
    hours: 'Open until 10:00 PM',
  },
];

module.exports = { restaurants };
