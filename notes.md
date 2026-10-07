# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.glutenguard.click)
- [My simon](https://simon.glutenguard.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

Interesting things I have learned about AWS

- Created an EC2 instance in us-east-1 (N. Virginia) using the class AMI (ami-094c4a0be0b642a24), instance type t3.micro.
- Server public IP (Elastic IP, won't change): `100.52.68.14`
- Public DNS: `ec2-100-52-68-14.compute-1.amazonaws.com`
- SSH into the server with: `ssh -i [path to key pair file] ubuntu@100.52.68.14`
  - If you get a permissions warning on the key file, fix it with `chmod 600 [key pair file]`
- Assigned an Elastic IP so the public IP stays the same even after stopping/restarting the instance. Remember to release it later if it's no longer needed, since it costs money while unattached to a running instance.
- Security group (`launch-wizard-1`) needs inbound rules for SSH (22), HTTP (80), and HTTPS (443), all open to 0.0.0.0/0 — by default only SSH may get added if you click through the wizard too fast, and the page won't load until HTTP/HTTPS are added too.
- Test the server by visiting `http://100.52.68.14` in the browser — use plain http, not https, until Caddy/TLS is configured.

## HTML

Interesting things I have learned about HTML

- Every page starts with `<!DOCTYPE html>` and `<html lang="en">`, and the `<head>` needs `<meta charset="utf-8">`, the viewport meta tag (`width=device-width, initial-scale=1`) so it works on phones, and a `<title>` for the browser tab.
- Structure each page with semantic elements instead of a pile of `<div>`s: `header` (title and `nav`), `main` (the page content broken into `section`s), and `footer` (my name and the GitHub link). This matters for screen readers and makes CSS easier later.
- Headings go in order (`h1` for the app name, `h2` for the page, `h3` for each section) — don't skip levels just to get a smaller font; that's CSS's job.
- Links between my own pages are relative (`href="browse.html"`), so they work both locally and on the server. External links like GitHub use the full URL.
- Forms:
  - Every input should have a `<label for="id">` matching the input's `id`, so clicking the label focuses the input.
  - Useful input types: `search`, `email`, `password`, `checkbox`, `radio`, and `file` (with `accept="image/*"` to only allow images). The browser gives some validation for free with `type="email"` and `required`.
  - Radio buttons are grouped by giving them the same `name` — only one in the group can be picked.
  - `select`/`option` for dropdowns, `textarea` for long text, and `fieldset` + `legend` to group related questions.
  - The `action` attribute says where the form goes on submit. For now I point it at another page since there's no backend yet.
- Tables: `table` > `thead`/`tbody` > `tr` > `th`/`td`. Only use tables for actual tabular data (like a list of reviews), not for page layout.
- Images need an `alt` attribute describing the image. I put my images in an `images/` folder and set `width` so big photos don't blow up the page before CSS exists.
- HTML entities for special characters: `&mdash;` for —, `&amp;` for &.
- Placeholders for future tech: I used HTML comments (`<!-- ... -->`) plus a short italic note on the page to show where the Google Places/Maps API, the database, login, and WebSocket data will go once those parts are built.
- The `<span id="username">` in each header is there so JavaScript can swap in the logged-in user's name later.
- Deploying: `./deployFiles.sh -k <pem key file> -h glutenguard.click -s startup` copies the files to the server (use `-s simon` for Simon). Check the live site afterward — if it still shows the default "Web Programming 260" page, the deploy didn't happen.

## CSS

Interesting things I have learned about CSS

- Load Bootstrap from the CDN first and my own `main.css` after it. When two rules are equally specific, the one that loads later wins, so my styles override Bootstrap's.
- Put colors in CSS variables on `:root` (`--gg-green: #2f7d4f;`) and use them with `var(--gg-green)`. Changing the palette then means editing one line.
- Build tints and shades from the base variables with `color-mix(in srgb, var(--gg-green) 20%, transparent)` instead of hardcoding `rgba(47, 125, 79, 0.2)`. Otherwise changing the base color leaves stale borders and focus rings behind.
- `clamp(min, preferred, max)` scales a font size smoothly with the screen instead of jumping at media query breakpoints. Put a `rem` in the preferred value (`1.1rem + 2vw`) so browser zoom still works.
- Don't put meaningful icons in CSS `content`, because screen readers may read or skip them unpredictably. Use an inline SVG or a span with `aria-hidden="true"` when the text next to it already says the same thing.
- Bootstrap 5 components are built on their own CSS variables. To recolor a button I set `--bs-btn-bg`, `--bs-btn-hover-bg`, and so on inside `.btn-success` instead of fighting its rules. Remember the active and border variables too, or the button flashes blue or gray when clicked.
- The collapsing navbar needs the Bootstrap JS bundle (`bootstrap.bundle.min.js`) at the bottom of the page, or the hamburger button does nothing.
- Google Fonts: add the `<link>` tags to the `<head>`, then use the font in `font-family` with a fallback, e.g. `'Inter', system-ui, sans-serif`.
- Grid vs. flex:
  - **Grid** is for two-dimensional page layout (rows *and* columns). `grid-template-areas` is really readable: name each area (`'map feed' 'list list'`) and then change just that property inside a `@media` query to rearrange everything on mobile.
  - **Flex** is for one row or column of things: the navbar, footer, buttons, a list of chips. `flex-wrap: wrap` plus `gap` handles most responsive wrapping without media queries.
- Write styles mobile first: the default is one column, and `@media (min-width: 768px)` adds more columns on bigger screens.
- **Grid blowout bug:** a wide table inside a `1fr` grid column stretched the whole page on phones, even inside `.table-responsive`. Grid items default to `min-width: auto`, so they refuse to shrink below their content. Setting `min-width: 0` on the grid children fixed it.
- `img { max-width: 100%; height: auto; }` keeps images from overflowing. `object-fit: cover` crops photos to the same size without stretching them.
- Remove fixed `width` attributes from HTML images once CSS handles sizing. A `width="600"` image is wider than a phone.
- Pseudo selectors I used:
  - **Pseudo-classes:** `:hover`, `:focus-visible` (outlines only for keyboard users), `:checked + label` (style the label next to a selected radio), `:nth-child(even)` (zebra stripes), `:nth-of-type()`, `:not(:first-child)`.
  - **Pseudo-elements:** `::before` with `content` (icons and dots), `::placeholder`, `::file-selector-button`, `::selection`.
- To make radio buttons look like chips, hide the input visually (`opacity: 0; position: absolute`) instead of `display: none`, so keyboard and screen reader users can still select them.
- `@keyframes` plus `animation` makes the pulsing live dot. Wrap it in `@media (prefers-reduced-motion: reduce)` to turn the animation off for people who ask for less motion.
- Test responsiveness with the device toolbar in Chrome DevTools at phone (~360px), tablet (768px), and desktop widths, and check that the page never scrolls sideways.

## React

Interesting things I have learned about React

- Setup: `npm init -y`, then `npm install vite@latest -D` (dev only, it builds and serves) and `npm install react react-dom react-router-dom bootstrap`. Scripts: `dev` runs the hot-reloading server at `localhost:5173`, `build` bundles everything into `dist/`, and `preview` serves that bundle so I can test the real build before deploying.
- How Vite expects the project to look:
  - `index.html` at the root is just a shell: the head (title, Google Fonts) and one `<div id="root">` plus `<script type="module" src="/index.jsx">`.
  - `index.jsx` finds that div and mounts the app: `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`.
  - `src/` holds the components and CSS. Vite bundles all of it.
  - `public/` holds static files like images. They get copied as-is, so `public/images/x.jpg` is served at `/images/x.jpg`.
- Bootstrap comes from npm now instead of the CDN: `import 'bootstrap/dist/css/bootstrap.min.css'` before `import './app.css'` (order still matters so my styles win), and `import 'bootstrap/dist/js/bootstrap.bundle.min.js'` so the hamburger menu still works.
- `export default function App` is imported without braces (`import App from './src/app'`). Named exports like `export function Home` need braces (`import { Home } from './home/home'`).
- Routing:
  - `<BrowserRouter>` wraps the whole app. The header and footer sit outside `<Routes>`, so they stay on screen and only the middle swaps when the URL changes. No page reload.
  - `<Route path="/browse" element={<Browse />} />` maps a URL to a component. `path="*"` goes last and catches anything else for a 404 page.
  - `<NavLink>` adds the `active` class and `aria-current` by itself based on the URL, so I deleted the hardcoded `active` from the Home link. Use `<Link>` when I don't want highlighting (the logo, links inside a page).
  - `NavLink` and `Link` crash if they're outside `<BrowserRouter>`.
  - Links to outside sites (GitHub) stay plain `<a href>`.
- Converting HTML to JSX:
  - `class` becomes `className` and `for` becomes `htmlFor`, because both are reserved words in JavaScript.
  - Comments are `{/* ... */}`. HTML comments don't work in JSX.
  - Every tag has to close, so an empty `<textarea></textarea>` becomes `<textarea />`.
  - Numbers can go in braces (`rows={6}`) instead of quotes.
  - `data-bs-*` and `aria-*` attributes stay hyphenated, and entities like `&mdash;` still work.
  - A component returns one outer element. Wrap multi-line JSX in `return ( ... );`.
  - JSX drops the whitespace at a line break. Two `<span>`s on separate lines end up touching. Keep them on one line or add `{' '}`.
  - Later (P2), form values will need `defaultValue` / `defaultChecked` instead of `selected` / `checked`.
- Image paths need a leading slash (`/placeholder.png`). Without it the path is relative to the current URL and breaks on nested routes.
- My sticky-footer layout was on `body { display: flex }`, but React puts everything inside `<div id="root">`, so `main` and `footer` weren't body's children anymore. Moved the rule onto a `.app` wrapper div inside `App` (Simon does the same with `.body`).
- CSS per component: each page has its own CSS file next to its JSX (`home/home.css`) and imports it. Vite still bundles all CSS into one file, so the rules aren't actually scoped to that page. It's just organization. Rules more than one page uses (`.page-intro`, `.table`, `.live-feed`, rating badges) stay in `app.css`.
- `npm run build` prints `"use client"` warnings from React Router. Those are for server rendering frameworks and are safe to ignore.
- The production server already sends `index.html` for unknown paths, so refreshing on `/browse` still loads the app instead of a 404.