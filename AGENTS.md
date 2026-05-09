## Session: 2026-05-08

### Added time selector dropdown

- **`templates/index.html:30-37`** — Added "Time" `<select>` dropdown with 30s, 60s, 90s options
- **`static/script.js:29`** — `timer` declaration now reads from `timeSelect.value`
- **`static/script.js:102`** — Timer reset in `startGame()` reads from `timeSelect.value`

Uses existing `.category-box` CSS — no style changes needed.
