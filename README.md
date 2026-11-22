# Laundry Caddie website

A single-page site for **Laundry Caddie**, the wash-and-fold pickup and delivery service run by [The Arc Jacksonville](https://arcjacksonville.org/). It uses plain HTML, CSS and a little vanilla JavaScript, with no build step and no frameworks.

Live site: https://tomrossi7.github.io/laundry-caddie/

## Files

| File | What it holds |
| --- | --- |
| `index.html` | All page content, SEO tags and the schema.org JSON-LD |
| `styles.css` | All styling. Colors are variables at the top (`:root`) |
| `script.js` | Mobile menu, form validation and form sending |
| `assets/` | Favicon, Apple touch icon and the social share image (`og-image.png`, built from `og-image.svg`) |

## Editing on GitHub

1. Open the file on github.com and click the pencil icon (**Edit this file**).
2. Make the change, then click **Commit changes**.
3. GitHub Pages republishes in about a minute.

Search the file (Ctrl/Cmd+F) for the text you want to change. Every placeholder is marked `TODO`.

## Changing prices

Prices appear in **three places** in `index.html`. Update all three so they match:

1. **Pricing cards**: search for `<!-- 3. PRICING`. Each card has an `amount` (e.g. `$155`), a `price-note` (the effective $/lb) and a feature list.
2. **FAQ**: search for `How much does it cost?`
3. **Structured data** in `<head>`: the `makesOffer` list inside `<script type="application/ld+json">`. Use plain numbers, e.g. `"price": "155"`.

The "Best Value" badge sits on the Large Bag card (`class="price-card featured"`, with `<p class="badge">`). To move it, move both the `featured` class and the badge paragraph to another card.

## Changing contact info

Search `index.html` for the old value and replace each match:

- **Phone** `904-779-3136`: appears as visible text and in `tel:+19047793136` links, and as `"telephone"` in the JSON-LD. `script.js` also uses it in the form's error message.
- **Email** `laundrycaddie@arcjacksonville.org`: in `mailto:` links, the form's `data-mailto` attribute and `"email"` in the JSON-LD.
- **Hours**: in the contact list, and `openingHoursSpecification` in the JSON-LD.
- **Address**: in the contact list, and `address` in the JSON-LD.
- **Service area**: the FAQ answer "Where do you pick up?", the form's Neighborhood dropdown and `areaServed` in the JSON-LD.

## The booking form

By default the form opens the visitor's email app with their request filled in, addressed to the `data-mailto` email. To receive submissions without relying on the visitor's email app, use [Formspree](https://formspree.io/):

1. Create a free Formspree form and copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `index.html`, find `<form class="booking-form"` and set `data-endpoint="https://formspree.io/f/abcdwxyz"`.

The script then posts the form in the background and shows a thank-you message.

## Photos

The "Meet the team" section uses striped placeholder blocks. To add a photo, put the image in `assets/` (resize it to about 800px wide first) and replace a placeholder:

```html
<div class="photo-placeholder" role="img" aria-label="Placeholder for a team photo">TODO: team photo</div>
```

with:

```html
<img src="assets/your-photo.jpg" alt="Describe what's in the photo" width="800" height="600" loading="lazy">
```

Only use photos, names and quotes of team members who have given written consent.

## Colors and accessibility

The site targets WCAG 2.1 AA. The base font is 18px, focus outlines are visible and the FAQ uses native `<details>` elements, so it works with a keyboard. If you change colors in `styles.css`, check text contrast with a tool such as [WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/). Aim for at least 4.5:1 for normal text.

## Custom domain

If the site moves to its own domain, update the `canonical`, `og:url`, `og:image` and JSON-LD `url`/`image` values in `index.html`, then add the domain under **Settings → Pages**.
