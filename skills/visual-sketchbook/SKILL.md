---
name: visual-sketchbook
description: "Turn a book, paper, blog post or long document into a 15-22 page visual booklet (one idea, one original diagram per page), published as an artifact with a light/dark moon toggle and optional PDF, offline HTML, PPTX, EPUB and PNG exports. Default style is the clean \"field guide\" (white canvas, blue/red/green/yellow, crisp geometric diagrams); hand-drawn sketchnotes are the alternative style."
---

# Visual sketchbook

Condense a book, paper or set of posts into a short visual booklet people can remember and teach from: one idea per page, each with an original diagram, a few plain lines, a memory hook and a teaching question.

Two working templates sit next to this file. Start from one rather than writing from scratch:

| Style | Template | Use when |
|---|---|---|
| **Field guide (default)** | `templates/field-guide.html` | Technical or research topics, or whenever the user names no style. White canvas, research-lab look. |
| Sketchnote | `templates/sketchbook.html` | The user asks for hand-drawn, sketchy or playful. Kalam + Patrick Hand, rough.js, tape and sticky notes. |

Both templates already contain the navigation, the light/dark toggle, the page renderer and every page type. Replace only the `SK` drawing functions, the `PAGES` array, the title, the footer credit and the cover text.

## 1. Before building: ask up front

Ask these in one go, skipping any the user already answered:
- **Source:** which book, paper or URLs? Read every URL in the built-in browser (`get_page_text`), since many labs render posts with JavaScript. Also open the model card and the Hugging Face `config.json`, or the repo, when they exist.
- **Audience:** just the user, or people they teach?
- **Downloads:** PDF, offline HTML, PPTX, EPUB or PNG zip?
- **Style:** field guide (default) or sketchnote.

When several sources describe the same idea (for example two models with the same architecture), organise the booklet by the general idea and use each source as a case study. Don't write one booklet per source.

## 2. Content rules (do not skip)

- Write every sentence in your own words. Never copy or closely paraphrase the source text, never redraw its figures, and never recite passages.
- Real numbers are welcome, drawn as your own chart form. Mark any value read off a chart as approximate on the page itself.
- Keep scope honest: say which model or test a number comes from (for example "30B test model, not GLM-5.4 itself"). Attribute claims such as "performs like 2–3T models" to the lab.
- Organise by idea, not section by section.
- Credit every source on the cover and in the footer of every page, call the booklet an unofficial visual companion, and tell readers to read the originals.
- Never invent quotes or voices for real people.
- At hand-off, tell the user where the content came from.

## 3. Booklet structure

Aim for a cover, 15–19 idea pages and a recap: 18–21 pages in all. Group idea pages into named sections through `kick`, for example `7 · Stability`.

Each idea page in `PAGES` holds:
- `id`: hash name (ASCII, hyphens)
- `kick`: number and section
- `title`: the idea stated plainly
- `idea`: one or two sentences, with the key phrase in `<mark>`
- `pts`: three short points, each starting with a `<b>` lead-in
- `hook`: one line to remember it by
- `ask`: an "Ask the room" teaching question
- `sk`: name of its drawing function in `SK`

Special page types (all already in the templates):
- `cover`: title, picture, credit and Start button.
- `compare`: `rows: [[label, a, b], ...]` rendered as a table beside a to-scale picture.
- `traps`: `items: [[name, problem, way out], ...]`, used for limits and open problems.
- `recap`: every diagram as a tappable thumbnail with its hook.

Plan the page list, and the picture for each page, before writing code.

## 4. Field-guide style (default)

- **Canvas:** white page (`--paper:#fff`). Each diagram sits in a soft panel (`--soft`, radius 28px). No tape, no tilt, no textures.
- **Colours:** blue `#1a73e8`, red `#d93025`, green `#188038`, yellow `#f9ab00`, ink `#1f1f1f`, muted `#5f6368`. Dark theme uses the lighter tints already in the template.
  - Blue: structure and baselines.
  - Green: the thing being explained, or "better".
  - Red: problems, loops and arrows that matter.
  - Yellow: gates, hooks and highlights.
- **Type:** Google Sans Flex, with Inter as fallback. Medium weight for titles, 17px body.
- **Diagrams:** use the template's crisp `kit` (no rough.js).
  - Calls: `R` (rounded rect), `C`, `E` (ellipse), `L`, `P`, `AR`/`AP` (arrows with colour-matched markers), `T` (text with `bg`, `med`, `bold`, `anchor`, `rot`).
  - Fills are tints (`f` plus `fo`, 0.15–0.6).
  - Keep everything inside the 640×420 viewBox.
  - Label parts directly on the drawing, and keep labels off lines and bars.
- **Chrome:** four colour dots in the bar; pill buttons; dot bullets cycling blue, red, green, yellow; hook as a pale-yellow pill; "Ask the room" in a hairline box with a red lead.
- **Charts:** bars, ranges and dot plots of real values, with values printed at the end of each bar.

The sketchnote style keeps its original rules: Kalam and Patrick Hand, the rough.js 4.6.6 kit, watercolour filter, taped cards and sticky-note hooks. Everything for it is in `templates/sketchbook.html`.

## 5. Light/dark toggle (required on every page)

Every booklet, and every other artifact, carries a moon button in the top bar:
- It shows a moon in light mode and a sun in dark mode, with a matching `aria-label`.
- It sets `data-theme` on `<html>` and remembers the choice in `localStorage` inside try/catch.
- It follows the system setting until the user clicks it.

The block is the `/* light / dark toggle */` section of either template, plus `#theme` and the `.btn.icon` CSS. Colour tokens must be defined three times: in `:root`, under `@media (prefers-color-scheme:dark)` guarded by `:root:not([data-theme='light'])`, and under `:root[data-theme='dark']`.

## 6. Check before publishing

1. Syntax-check the inline script: extract it and run `node --check`.
2. Render every page with `scripts/render.py <html> <outdir>`. It waits for DOM ready, not full load, so slow Google Fonts don't time it out. This needs Playwright and uses the system Chrome (`channel='chrome'`, no browser download); install `playwright pypdf pillow` into a scratch venv. It renders at 1280×800 and 400×800 and reports sideways overflow and page errors.
3. Look at contact sheets once. Fix overlapping labels and clipped text.
4. Click the theme toggle in a headless run and check: the label flips, the choice survives a reload, and the dark render reads well.
5. Say plainly what was and was not checked.

## 7. Publishing and downloads

- Write the HTML into the session's folder and publish with the artifacts tool from that file.
- After any comment-driven edit made with `edit_version`, apply the same edit to the local file before republishing from disk.
- **PDF:** `scripts/pdf.py <html> <out.pdf> "<title>"` renders each page at 1280×905 in the light theme, hides the nav, shrinks overflowing pages with `zoom`, then merges with pypdf and sets the title.
- **Offline HTML, PPTX, EPUB, PNG zip:** only when asked. For PPTX, load the pptx skill first; the slides are images, so say so. For EPUB, build EPUB 3 by hand and check that every XML part is well-formed.

## 8. Comments on the published booklet

When the user sends artifact comments asking "what's X?", answer in the comment thread. Also add a short in-page definition where the term first appears, so the next reader isn't stuck.

## 9. Hand-off

Keep it to about five lines: the link, the PDF, the sources used, what was and wasn't checked, and one question about what to change.
