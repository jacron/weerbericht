# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Chrome extension (Manifest V3) that displays Dutch weather data in a popup. It fetches live weather from the Weerlive API and weather maps from KNMI.

## No Build Step

This is a plain JavaScript project with no bundler, transpiler, or build process. Files are loaded directly by the browser/extension. To test, load the extension unpacked in Chrome via `chrome://extensions` > "Load unpacked" and select this directory.

The only npm dependency is `@types/chrome` for IDE type hints — it is not used at runtime.

## Architecture

The extension popup (`index.html`) is the sole entry point. On load it:
1. Requests geolocation (falls back to IP-based location via `ipapi.co` if denied)
2. Fetches weather JSON from `weerlive.nl/api/weerlive_api_v2.php`
3. Binds data to the DOM and loads KNMI map images

**Module layout:**
- `index.js` — main orchestrator: geolocation, fetch, menu navigation, event handling
- `plot.js` — Chart.js line charts for today's hourly and weekly wind/temperature
- `table.js` — builds HTML tables for hourly (today) and weekly forecasts
- `util.js` — date/time helpers (`dagVanDeWeek`, `tweedeWoord`, `getTime`) and `selecteerUurVerwachtingen` (picks which `uur_verw` entries table.js/plot.js render)

**Third-party libraries** are vendored locally in `third_party/` (Chart.js and chartjs-plugin-datalabels) and loaded via `<script>` tags — they are globals (`Chart`, `ChartDataLabels`), not imports.

**Menu system:** Four views cycle with arrow keys — `menu_vandaag` (today map), `menu_temp` (temperature map), `menu_buien` (rain radar), `menu_wind` (wind map). Press `v` to toggle the hourly forecast panel (first 12 `uur_verw` entries), `w` to toggle the weekly panel, `2` to toggle the 24-hour forecast panel (all 24 `uur_verw` entries filtered down to even hours, e.g. 08:00, 10:00, 12:00…, via `selecteerUurVerwachtingen`); `Escape` to close them.

**API data shape:** The Weerlive response contains `liveweer[0]` (current conditions), `wk_verw` (5-day forecast), and `uur_verw` (24-hour forecast). Field names are Dutch (e.g. `windbft`, `windr`, `neersl`, `image`).

**Weather icons:** PNG files in `icons/` named by the `image` field returned by the API (e.g. `zonnig`, `bewolkt`, `buien`).

## Host Permissions

Declared in `manifest.json`: `https://cdn.knmi.nl/*` and `https://weerlive.nl/api/`. Any new external fetch target requires adding a host permission there.
