# TatsunoriSaito.github.io

Personal academic website of **Tatsunori Saito** (Ph.D. Student, Keio University), served by GitHub Pages at <https://tatsunorisaito.github.io/>.

Plain static HTML/CSS/JS — no build step, no dependencies.

## Structure

```
index.html                  All sections: Home, About, Research, Publications, CV, Contact
404.html                    Not-found page
assets/css/style.css        Styles (design tokens at the top: colors, fonts, spacing)
assets/js/main.js           Mobile nav, scroll spy, reveal animation, publication filter, BibTeX copy
assets/img/                 favicon.svg, profile-placeholder.svg, og-image.png (social preview)
assets/cv/                  Tatsunori_Saito_CV.pdf (placeholder)
robots.txt, sitemap.xml     SEO
.nojekyll                   Serve files as-is (skip Jekyll)
```

## Filling in placeholders

Search `index.html` for `TODO` and `[` / `20XX` / `YOUR_`. In particular:

| What | Where |
| --- | --- |
| Google Scholar / ORCID / LinkedIn URLs | Hero social links, Contact → Profiles, and the JSON-LD `sameAs` block in `<head>` |
| Profile photo | Add `assets/img/profile.jpg` (square, ≥ 600 px) and update the `<img>` in the hero |
| Email | `data-user` / `data-domain` on `.email-link` in Contact (assembled by JS to deter scrapers) |
| Lab, advisor, degree years | About and CV sections |
| News | `#news` list, newest first |
| Publications | `#publications` — see below |
| CV PDF | Replace `assets/cv/Tatsunori_Saito_CV.pdf` (keep the filename or update both links) |

### Adding a publication

Copy an existing `<li class="pub">` inside the right year group (or copy a whole `.pub-year-group` for a new year). Within a year, entries are ordered journal → international → domestic.

```html
<li class="pub" data-type="international" data-first="true">   <!-- journal | international | domestic -->
  <span class="pub-venue-badge badge-international">Int’l Conf.</span>
  <div class="pub-main">
    <p class="pub-title">Paper title</p>
    <p class="pub-authors"><span class="me">Tatsunori Saito</span>, Coauthor, and Takeshi Toda</p>
    <p class="pub-venue"><em>Conference name</em>, P1-01, Nov. 2026.</p>
    <div class="pub-links">
      <a href="https://doi.org/..." class="pub-link" target="_blank" rel="noopener">DOI</a>
    </div>
  </div>
</li>
```

- `data-first="true"` marks first-authored papers (used by the “First-authored only” filter).
- Japanese entries: add `lang="ja"` to the `<li>` and use `badge-domestic` / `Domestic`.
- Optional extras: `<span class="pub-status">Under review</span>` after the title, `<p class="pub-award">…</p>` for an award, and a `BibTeX` button with `<pre class="bibtex" hidden><code>…</code></pre>` (see the IEEE TRS entry).
- Filter counts update automatically.

### Changing the accent color

Edit `--accent`, `--accent-hover`, `--accent-soft`, and `--accent-line` at the top of `assets/css/style.css`.

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```
