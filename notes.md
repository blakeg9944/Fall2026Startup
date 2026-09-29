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

I love web programming