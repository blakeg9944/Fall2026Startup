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

## React

Interesting things I have learned about React

I love web programming