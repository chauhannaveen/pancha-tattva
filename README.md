# Pancha Tattva

A scroll journey through the five elements of Indian thought (earth, water, fire, air, ether)
and the two that lie beyond them (mind and consciousness). Every scene is drawn live on the
GPU; there are no images or video.

## Run it

Open `index.html` in a browser. There is no build step and nothing to install.

Some browsers restrict pages opened straight from disk. If anything misbehaves, serve the
folder instead:

    python -m http.server 8123

then open http://localhost:8123.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page structure |
| `css/styles.css` | All styling |
| `js/content.js` | All wording: elements, hints, wisdom cards, mixer results. Edit here to correct or translate text |
| `js/shaders.js` | The GPU programs for the ten scenes |
| `js/app.js` | Behaviour: rendering, scrolling, sound, mixer, daily practice, time of day |
| `tools/build_single.py` | Bundles everything into one HTML file in `dist/` |
| `manifest.webmanifest`, `sw.js` | Make the site installable on phones and usable offline |
| `assets/` | App icon and the preview image shown when the link is shared |
| `tools/make_images.py`, `tools/og-card.html` | Regenerate the icons and preview image |

The three scripts are plain files loaded in order (content, shaders, app), not modules, so the
site also works when opened directly from disk.

## One-file copy

    python tools/build_single.py

writes `dist/pancha-tattva.html`, a single self-contained file, plus a variant shaped for the
claude.ai share link.

## If the web address changes

The preview-image tags in `index.html` (`og:url`, `og:image`, `twitter:image`) contain the full
address `https://chauhannaveen.github.io/pancha-tattva/`. Update them if the site moves to
another domain.

Visitors who are online always get the latest files; the saved offline copy is only used when
there is no connection, so no version bump is needed after a change.

## Notes

- The daily practice streak and the wisdom-card preference are stored in the visitor's browser
  only. Nothing is sent anywhere.
- Fonts load from Google Fonts and are saved for offline use after the first visit; before that,
  the Sanskrit text falls back to a system font.
- The scripture quotations and references in `js/content.js` have not yet been reviewed by
  someone who knows the source texts.
