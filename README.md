#GlutenGuard

[My Notes](notes.md)

Gluten Guard is a mobile/web app designed for users to share their experiences about how manageable different restaurants are about allergies and sensitivity to glutenous items. Users will be able to login/register and then search for the desired restaurant and fill out a review. The website will be integrated with google places/maps API to tie user review data to address/location so other users can view reviews. 

> [!NOTE]
> This is a template for your startup application. You must modify this `README.md` file for each phase of your development. You only need to fill in the section for each deliverable when that deliverable is submitted in Canvas. Without completing the section for a deliverable, the TA will not know what to look for when grading your submission. Feel free to add additional information to each deliverable description, but make sure you at least have the list of rubric items and a description of what you did for each item.

> [!NOTE]
> If you are not familiar with Markdown then you should review the [documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) before continuing.

### Elevator pitch

Ever been out to eat with someone with a bad allergy? Growing up my mother and only sibling suffered from severe gluten allergies. I can still remember how painful it was to eat a restaurant where gluten was accidentally snuck into the food. A nice evening out suddenly turned into a day of painful sickness. GlutenGuard is a mobile/web service that helps people with celiac disease or gluten sensitivity find restaurants they can actually trust. Not just dining locations with a gluten-free item on the menu, but ones with practices that prevent cross-contamination. Users search for a restaurant and see or submit reviews answering questions a typical review site never asks. For example, does the kitchen use a separate fryer or grill? Is there a dedicated gluten-free prep area? How confident would someone with celiac disease feel eating here versus someone who's just gluten-sensitive? After answering these questions: other people who struggle with the same troubles of finding reliable gluten free vendors will be able to view and share their own reviews. All this goes to helping and protecting the ones we love most while still maintaining the magic of a going out to eat a meal.

### Design

![Design image](design_pic.png)

Diagram highlights the search bar with google maps/google places API integrated. Users use the already large library to ping their reviews to the address associated with the restaurant. Easy to use homepage with header that includes a way to login/logout. Only two other links that let users browse different reviews from a map or view their previous reviews from other dining locations.


### Key features

- **Gluten-free safety search**: Search any restaurant via the Google Places API and see a GF safety profile. This includes whether they use a separate grill/fryer, have a dedicated GF menu, and an aggregated cross-contamination rating.
- **Structured community reviews**: Logged-in users submit detailed GF reviews (not just star ratings) covering kitchen practices, and can browse, edit, or delete their own review history.
- **Real-time activity feed**: WebSocket-powered live updates show how many people are currently viewing a restaurant and push new reviews to everyone on that page instantly, without a refresh.

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Mobile friendly homepage, a restaurant search page, a restaurant detail/review page, a review submission form, and a login/register page that prompts upon opening the site (can be skipped if just wanting to browse). Explicitly mobile friendly.
- **CSS** - User friendly styling that is designed to work with both mobile and desktop views. Consistent styling for review indicators (color-coded cross-contamination ratings).
- **React** - Components for restaurant search-as-you-type, restaurant detail view with aggregated gluten free stats, a review submission form, and a live viewer/review feed that updates via WebSocket without a page reload.
- **Service** - A backend with endpoints for authentication (register/login/logout/session check). Includes app-specific functionality like utilizing Google Places API (LINK TO API: https://developers.google.com/maps/documentation/places/web-service/overview) to search for specific locations, fetching/caching restaurant data, and creating/editing/deleting gluten-free reviews. 
- **DB/Login** - Three main categories: users, review, and restaurants. Login is required to submit a review but any user can browse. Users table includes a secure way to do auths and store username and passwords.
- **WebSocket** - Real-time broadcast of new reviews (and updated average rating) to everyone viewing that restaurant's page.

## 🚀 Specification Deliverable

> [!NOTE]
> Fill in this sections as the submission artifact for this deliverable. You can refer to this [example](https://github.com/webprogramming260/startup-example/blob/main/README.md) for inspiration.

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] I completed the prerequisites for this deliverable (Git commit requirement)
- [X] Proper use of Markdown
- [X] A concise and compelling elevator pitch
- [X] Description of key features
- [X] Description of how you will use each technology including your 3rd party API and use of WebSocket
- [X] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Rented EC2 server** - I completed this part of the deliverable.
- [X] **Leased domain name** - I completed this part of the deliverable.
- [X] **Server accessible** from my domain: [https://glutenguard.click/](https://glutenguard.click/) - I completed this part of the deliverable.

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits). Simon is deployed to [simon.glutenguard.click](https://simon.glutenguard.click), every page footer links to this GitHub repository, and the work is spread across multiple commits.
- [X] **HTML pages** - Five pages: `index.html` (home, search, and login), `browse.html` (map and reviewed restaurants), `restaurant.html` (a restaurant's gluten-free safety profile and reviews), `review.html` (review form), and `my-reviews.html` (the logged-in user's review history).
- [X] **Proper HTML element usage** - Every page uses `header`, `nav`, `main`, `section`, and `footer`. Forms use `label`, `fieldset`, `legend`, `select`, radio buttons, a checkbox, `textarea`, and a file input. Tabular data is in `table` elements with `thead` and `tbody`.
- [X] **Links** - Every page has nav links to Home, Browse Reviews, and My Reviews. Restaurant names link to the restaurant page, the restaurant page links to the review form, and My Reviews has Edit and Delete links.
- [X] **Text** - Each page explains its purpose. The restaurant page summarizes kitchen practices (separate fryer, separate grill, GF menu, staff training) and shows written reviews.
- [X] **3rd party API placeholder** - The home page search results, the browse page map, and the restaurant name, address, and hours are marked as coming from the Google Places and Google Maps APIs.
- [X] **Images** - The browse page has a placeholder map image, and My Reviews shows two meal photos with the Backdoor Burger review.
- [X] **Login placeholder** - The home page has an email and password form with Login and Create Account buttons. Each page header shows the current username, and My Reviews shows the signed-in user with a Logout link.
- [X] **DB data placeholder** - The reviewed restaurants table, the restaurant reviews and aggregated ratings, and the My Reviews history are all marked as data stored in and loaded from the database.
- [X] **WebSocket placeholder** - The restaurant page's Live activity section (viewer count and new reviews), the browse page's Recent activity feed, and the My Reviews notifications are marked as real-time WebSocket updates.

## 🚀 CSS deliverable

For this deliverable I styled the application with Bootstrap and my own `main.css`, which every page loads after Bootstrap so my rules take priority.

- [X] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits). Simon CSS is deployed to [simon.glutenguard.click](https://simon.glutenguard.click), every page footer links to this GitHub repository, and the styling is spread across multiple commits (base styles, header/footer, home layout, home colors, browse layout, rating badges, restaurant layout, restaurant colors, review form layout, review form colors, My Reviews, and a final polish and overflow fix).
- [X] **Visually appealing colors and layout. No overflowing elements.** - A green and cream palette is defined once as CSS variables in `:root` and used everywhere. The home page has a gradient hero banner and white cards with a thin border and a soft shadow. Cross-contamination ratings are color-coded pill badges: green for safe, amber for caution, and red for risk. Yes/No answers are colored the same way. On the restaurant page, each kitchen practice in the safety profile gets a colored ✓ (yes), ~ (usually), or ✗ (no) mark. The celiac and gluten-sensitive confidence levels are shown as tiles with a tinted background (green when confidence is high). The live viewer count is a green pill. On the review form, each section is its own card. The confidence radio buttons are shown as rounded chips that turn green when selected. The file upload button is styled to match the palette. To prevent overflow, images are capped at `max-width: 100%`, the browse and restaurant tables are wrapped in `.table-responsive` so they scroll inside their card on phones, and list items, the footer, and the confidence tiles wrap with `flex-wrap`. I found that wide tables were still stretching the page on phones because grid items default to `min-width: auto`, so I set `min-width: 0` on every grid child. I checked every page at 360px, 768px, and 1280px wide with no horizontal scrolling.
- [X] **Use of a CSS framework** - Bootstrap 5.3.3 is loaded from a CDN on every page. I used its navbar with a collapsing hamburger menu for small screens, plus its `container`, `list-group`, `table`, `input-group`, `form-control`, `form-select`, `form-check`, and button classes. It also provides the `form-switch` toggle on the review form. I restyled Bootstrap's `.btn-success` and `.btn-outline-success` by overriding its `--bs-btn-*` variables so the buttons match my palette.
- [X] **All visual elements styled using CSS** - Nothing on any page is left with default browser styling:
  - **Header and footer:** a dark green navbar with hover and active link states, the current user shown as a pill (`#username`), and a matching green footer.
  - **Forms:** every input, select, radio, checkbox, textarea, file input, and button uses Bootstrap form classes plus my own colors and green focus glows.
  - **Tables:** themed headers with a green underline, zebra striping, hover rows, rating badges, and colored Yes/No/Unsure answers.
  - **Live feeds:** the recent activity, live activity, and replies feeds have a pulsing green dot on the newest item (a `@keyframes` animation) and gray dots on older items.
  - **My Reviews:** a summary card with a round gradient avatar, and the review history as a list of bordered cards (not a table, since each review is a paragraph with photos). Each card shows the restaurant name and date on the left with the rating badge on the right, then the review text, the photos as rounded, cropped thumbnails in a flex row that zoom slightly on hover, and small outline Edit/Delete buttons. The card border turns green on hover.
  - **Small details:** the placeholder notes about future API, database, and WebSocket data are small, gray, and italic. Text selection is highlighted green. Cards lift slightly on hover.
- [X] **Responsive to window resizing using flexbox and/or grid display** - The `body` is a flex column so the footer stays at the bottom, and the header and footer use flexbox. The navbar collapses into a toggle menu below 768px. Every page with a layout stacks into one column on phones and spreads out on wider screens:
  - **Home:** a CSS grid puts search and login side by side (`3fr 2fr`) at 768px.
  - **Browse:** `grid-template-areas` puts the map and recent activity side by side at 992px, with the restaurant table spanning the full width below.
  - **Restaurant:** `grid-template-areas` puts the safety profile and live activity side by side at 992px, with the reviews table below.
  - **Review form:** the form is a flex column, and the four kitchen questions are a grid that becomes two columns at 768px. The confidence chips and the kitchen practice rows wrap with `flex-wrap`.
  - **My Reviews:** `grid-template-areas` puts the user summary and replies side by side at 992px, with the review history below. The review cards are flex columns, so the text, photos, and buttons stack at every width with no sideways scrolling, and the photo row wraps with `flex-wrap`. The summary card is a flex row that wraps the Logout button underneath on phones.
  - **Small phones:** below 576px, card padding and heading sizes shrink.
- [X] **Use of a imported font** - I import two Google Fonts with a `<link>` in every page's `<head>`. **Atkinson Hyperlegible Next** is the body font, set on `body`. It was designed by the Braille Institute to stay readable for low-vision readers, which fits an app about safety information. **Poppins** is used for headings, the GlutenGuard logo, table headers, form section titles, and the confidence levels.
- [X] **Use of different types of selectors including element, class, ID, and pseudo selectors** - All in `main.css`:
  - **Element:** `body`, `main`, `h1`–`h4`, `a`, `img`, `header`, `footer`.
  - **Class:** `.gg-card`, `.hero`, `.rating-badge`, `.safe`, `.caution`, `.risk`, `.live-feed`, `.practice-list`, `.confidence`, `.placeholder-note`, `.photo-row`.
  - **ID:** `#username`, `#map`, `#search-card`, `#safety-profile`, `#live-activity`, `#user-summary`, and the other section ids that place each card in its grid area.
  - **Pseudo-classes:** `:hover`, `:focus-visible`, `:checked` (with `+` to style the label next to a selected radio), `:nth-child(even)` for table stripes, `:first-child`, `:last-child`, and `:not()`.
  - **Pseudo-elements:** `::before` for the ✓/~/✗ practice marks (on an `aria-hidden` `.practice-icon` span, since the row's Yes/Usually/No text already says it) and the live dot; `::placeholder`, `::file-selector-button`, and `::selection`.
  - **Combined selectors:** descendant (`header .nav-link`), child (`.home-grid > *`), and attribute (`input[type='file']`).

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits). Simon React P1 is deployed to [simon.glutenguard.click](https://simon.glutenguard.click). The startup React version is deployed to [startup.glutenguard.click](https://startup.glutenguard.click) with `deployReact.sh`. The home page has a "View the GitHub repository" button in the hero, and every page's footer has my name and a GitHub Repository link. A commit for each step: setup, restructure, layout, routes, each page's conversion, each page's CSS, notes, the deploy script, and this README. What I learned is in the React section of [notes.md](notes.md).
- [X] **Bundled using Vite** - I installed Vite, React, React DOM, React Router, and Bootstrap with npm, and added `dev`, `build`, and `preview` scripts to `package.json`. I reorganized the project the way Vite expects:
  - **`index.html`** is now a shell with the Google Fonts links and a single `<div id="root">`.
  - **`index.jsx`** mounts the `App` component into that div.
  - **`src/`** holds all the components and CSS.
  - **`public/`** holds the map placeholder and the meal photos.
  - Bootstrap's CSS and JS are imported from npm instead of the CDN.
  - `deployReact.sh` runs `npm run build` and uploads only the `dist/` bundle to the server.
- [X] **Components** - Each of my five HTML pages is now its own React component in its own folder, with its own CSS file:
  - **`Home`** (`src/home/`): hero banner with the GitHub link, restaurant search with Google Places results, and the login form.
  - **`Browse`** (`src/browse/`): map placeholder, reviewed restaurants table, and recent activity feed.
  - **`Restaurant`** (`src/restaurant/`): safety profile with rating badge, ✓/~/✗ kitchen practices, confidence tiles, live activity, and the reviews table.
  - **`Review`** (`src/review/`): the full review form with selects, radio chips, the staff switch, textarea, and photo upload.
  - **`MyReviews`** (`src/myReviews/`): user summary, replies feed, and review history cards with photos and Edit/Delete buttons.
  - **Shared layout:** the header, navbar, and footer live in `App` (`src/app.jsx`), so they are written once instead of copied into every page.
  - **Converting the HTML:** I turned it into JSX (`className`, `htmlFor`, `dateTime`, `{/* */}` comments, self-closing tags). All the placeholders for the Google APIs, database, login, and WebSocket data are still there.
  - **CSS:** I split the old `main.css`. Rules used on more than one page (colors, header, footer, cards, buttons, form theming, tables, rating badges, live feeds) stay in `src/app.css`. Each page's own layout and details moved into its component's CSS file, which the component imports.
  - **Visual check:** I compared screenshots of every page against the old HTML version at desktop and phone widths, and they look the same.
- [X] **Router** - `App` wraps everything in a `BrowserRouter`. A `Routes` block maps each URL to a component:
  - **Routes:** `/` → `Home`, `/browse` → `Browse`, `/restaurant` → `Restaurant`, `/review` → `Review`, and `/my-reviews` → `MyReviews`. A catch-all `*` route shows a `NotFound` 404 card with a link back home.
  - **Navigation:** the navbar uses `NavLink`, so the current page's link is highlighted automatically. The logo and the links inside pages use `Link`: restaurant names, "Write a review", Cancel, Edit, Delete, and Logout. Moving between pages swaps the component without reloading the page. The header and footer stay in place.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits). Simon React P2 is deployed to [simon.glutenguard.click](https://simon.glutenguard.click). The GitHub link is in the home page hero and every page's footer. I made 30 commits over four days (Oct 18 to 21), one feature per commit. What I learned is in the React P2 sections of [notes.md](notes.md).
- [X] **All functionality implemented or mocked out** - Every page works without a backend. Anything that will need the service later is mocked in the browser, in functions shaped like the real calls:
  - **Data layer** (`src/data/`): `mockData.js` has the seed restaurants and reviews. `reviewStore.js` keeps reviews in `localStorage` (`getReviews`, `addReview`, `updateReview`, `deleteReview`), which stands in for the database. `places.js` has hardcoded `searchPlaces`, `getPlaceDetails`, and `getAllPlaces` functions shaped like Google Places responses. `userStore.js` keeps accounts in `localStorage`. `stats.js` has `summarize()`, which computes the average rating, the majority answer for each kitchen practice, and the confidence levels.
  - **Header (`App`)**: shows `Welcome, <name>` or `guest`, with a Logout link when logged in. The logged in user is passed to the pages as props.
  - **Home**: Create Account and Login check the accounts stored in `localStorage` and show an error for a wrong password or an existing account. When logged in, the form is replaced by a welcome card with a Logout button. The restaurant search filters as you type and shows a "no restaurants match" message when empty. Each result links to `/restaurant/:id`.
  - **Restaurant** (`/restaurant/:id`): loads the place details and its reviews, then computes the rating badge, the ✓/~/✗ kitchen practices, and the confidence tiles from the real reviews. The reviews table is newest first. An unknown id shows a "not found" card. Logged in users see "Write a review", and everyone else sees a link to log in. The Live activity viewer count and feed are mocked WebSocket updates (`setInterval`).
  - **Review** (`/review/:id`): a controlled form. The submit button stays disabled until both confidence questions are answered. Submitting saves the review under the logged in user's name and today's date, then returns to the restaurant page. Logged out users see a login prompt instead of the form. With `?edit=<reviewId>`, the form is filled with the saved review, the heading and button change to "Edit your review" and "Save changes", and only the review's author can edit it.
  - **My Reviews**: shows only the logged in user's reviews, with the count and avatar initial from that data. Delete asks for confirmation and removes the review from storage and the screen. Edit links to the review form. There is an empty state and a logged out state. The replies feed is a mocked WebSocket notification feed (`setInterval`).
  - **Browse**: the reviewed restaurants table is built from the reviews with live averages, so a new review shows up in it. The Recent activity feed is a mocked WebSocket feed (`setInterval`). The map is still an image placeholder for Google Maps.
- [X] **Hooks** - `useState` and `useEffect` are used across the app:
  - **`useState`**: the logged in user in `App`. Email, password, error, and search query in `Home`. The `place`, `reviews`, `viewers`, and `events` in `Restaurant`. One form object in `Review`. Reviews and notifications in `MyReviews`. Reviews and activity in `Browse`.
  - **`useEffect` to load data**: `Restaurant` loads the place and its reviews and reloads when the route id changes (`[id]`). `Browse` and `MyReviews` load the reviews on mount, and `MyReviews` reloads when the user changes (`[userName]`).
  - **`useEffect` with cleanup**: the three mock WebSocket feeds each start a `setInterval` and return `() => clearInterval(timer)`, so leaving the page stops the timer and the feed doesn't speed up when I come back.
  - **`useEffect` for edit prefill**: `Review` fills the form from the saved review when `?edit=` is present.
  - **Other React features**: `useParams`, `useSearchParams`, and `useNavigate` from React Router, props for passing `userName` and the login/logout handlers down, and conditional rendering for logged in vs. logged out views, empty states, and not-found states.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.
- [ ] **Uses BCrypt to hash passwords** - I did not complete this part of the deliverable.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
