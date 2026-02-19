# vue-airbnb-style-datepicker (Vue 3 fork)

This is a modernized fork of the original [MikaelEdebro/vue-airbnb-style-datepicker](https://github.com/MikaelEdebro/vue-airbnb-style-datepicker), updated to work smoothly with Vue 3 and a Vite-based toolchain.

Highlights
- Vue 3 compatible (plugin install via `app.use`)
- Vite library build (ES/CJS/UMD) with CSS extracted to `dist/style.css`
- click-outside close fixed for Vue 3 (`v-click-outside` directive)
- programmatic open/close toggle fixed via the `trigger` prop watcher
- Dev demo preserved under `dev/`

New in this fork
- Backwards range selection (second click earlier than the first swaps start/end)
- Theming via `theme` prop: `'light' | 'dark' | 'auto'` (default `'auto'` follows Quasar's `q-dark` live)
- New inline layout controls: `monthWidth` (px) and `autoFitInline` (default: `true`) to keep months aligned and optionally flex to fit the container before wrapping

Credit: All core logic and styles are based on the original work by Mikael Edebro (MIT). This fork focuses on compatibility, build, and small UX fixes.

---

## Original docs, examples, and screenshots

- Original Examples: https://mikaeledebro.gitbooks.io/vue-airbnb-style-datepicker/examples.html
- Full original documentation (GitBooks): https://mikaeledebro.gitbooks.io/vue-airbnb-style-datepicker/

<img src="https://raw.githubusercontent.com/MikaelEdebro/vue-airbnb-style-datepicker/master/docs/images/datepicker-tablet.gif" width="1124" alt="Datepicker on tablet">
<img src="https://raw.githubusercontent.com/MikaelEdebro/vue-airbnb-style-datepicker/master/docs/images/datepicker-mobile.gif" width="425" alt="Datepicker on mobile">

---

## Install (from GitHub)

This package is ready to be consumed directly from a Git repo. A `prepare` script builds the library on install.

- Separate repo usage (recommended):
```bash
# install from the repository default branch (master)
npm install github:SystemicGlitch/vue-airbnb-style-datepicker#master
# or pin a tag/commit
npm install github:SystemicGlitch/vue-airbnb-style-datepicker#v2.7.0
```

- Monorepo subdirectory usage (npm v9+):
```bash
npm install github:SystemicGlitch/your-monorepo#main:vue-airbnb-style-datepicker
```

Peer dependencies (must be present in your app):
- `vue`: 3.x
- `date-fns`: 1.x (this fork keeps v1 helper APIs)

Runtime dependency (bundled as dependency here so you don’t need to add it):
- `v-click-outside`: ^3

---

## Quick usage

Import the plugin and CSS, then register on your Vue app:

```js
// main.js / main.ts
import { createApp } from 'vue'
import App from './App.vue'

import VueAirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/style.css'

const app = createApp(App)
app.use(VueAirbnbStyleDatepicker)
app.mount('#app')
```

Use the component in your templates:

```vue
<template>
	<div class="datepicker-trigger">
		<input id="datepicker-input" :value="formatted" readonly />

		<airbnb-style-datepicker
			:trigger-element-id="'datepicker-input'"
			:mode="'range'"
			:date-one="dateOne"
			:date-two="dateTwo"
			:months-to-show="2"
			:show-action-buttons="true"
			@date-one-selected="v => dateOne = v"
			@date-two-selected="v => dateTwo = v"
		/>
	</div>

	<!-- Programmatic toggle example -->
	<button @click="isOpen = !isOpen">Toggle</button>
	<airbnb-style-datepicker
		:trigger-element-id="'datepicker-toggle'"
		:trigger="isOpen"
		:mode="'single'"
		:date-one="singleDate"
		@opened="isOpen = true"
		@closed="isOpen = false"
	/>
	<input id="datepicker-toggle" />
</template>

<script>
import format from 'date-fns/format'

export default {
	data() {
		return {
			dateOne: '',
			dateTwo: '',
			singleDate: '',
			isOpen: false,
			dateFormat: 'YYYY-MM-DD',
		}
	},
	computed: {
		formatted() {
			const { dateOne, dateTwo, dateFormat } = this
			if (!dateOne && !dateTwo) return ''
			const p1 = dateOne ? format(dateOne, dateFormat) : ''
			const p2 = dateTwo ? format(dateTwo, dateFormat) : ''
			return p2 ? `${p1} - ${p2}` : p1
		},
	},
}
</script>
```

### Inline layout and sizing (new)

This fork adds two props to control inline layout and sizing:

- `monthWidth?: number` – Base width (in px) of a single month. Default is 300.
- `autoFitInline?: boolean` – When `true` (default), months can grow to fill the row before wrapping. When `false`, months keep their fixed `monthWidth` and wrap only when there isn’t room.

Examples:

```vue
<!-- Auto-fit (default): months expand a bit to pack the row, then wrap when needed -->
<airbnb-style-datepicker
	:inline="true"
	:months-to-show="2"
	:month-width="300"
	:auto-fit-inline="true"  />

<!-- Fixed width: never stretch months; wrap only when container can't fit another -->
<airbnb-style-datepicker
	:inline="true"
	:months-to-show="3"
	:month-width="320"
	:auto-fit-inline="false" />
```

### Customizing day content and positioning (new)

- Slot: `#day` – Provides `{ day, date }` so you can replace the default content per cell.
- Prop: `dayNumberPosition` – Controls where the day content is placed inside each cell.
	- One of: `center` (default), `top-left`, `top-right`, `bottom-left`, `bottom-right`.

- Additional slot: `#day-extra` – Adds secondary content (e.g., price, badge) without replacing the day number. Slot props `{ day, date }`.
- Prop: `dayExtraPosition` – Controls where the extra content appears: `center` (default), `top`, `bottom`, `left`, `right`.

Examples:

```vue
<!-- Centered numbers (default) -->
<airbnb-style-datepicker :inline="true" />

<!-- Top-left numbers -->
<airbnb-style-datepicker :inline="true" :day-number-position="'top-left'" />

<!-- Custom slot: add a star on the first of each month -->
<airbnb-style-datepicker :inline="true">
	<template #day="{ day, date }">
		<div style="position:relative;display:inline-flex;align-items:center;gap:2px;">
			<span>{{ day }}</span>
			<small v-if="date && date.endsWith('-01')" style="color:#f39c12">★</small>
		</div>
	</template>

	<!-- Extra content: price shown at bottom -->
	<template #day-extra="{ day }">
		<small style="font-weight:600; font-size:0.72em;">${{ Number(day) * 5 }}</small>
	</template>

</airbnb-style-datepicker>
```

Tips
- Wrapping is handled by the inline months container; no right-side help column is reserved anymore. The help/shortcuts panel overlays on top of the calendar when opened.
- If your container is just a few pixels short, reduce `monthWidth` slightly (e.g., 300 → 292) or keep `autoFitInline` enabled so months can flex to fit.

### Theming: light, dark, auto

This fork provides a simple theming API driven by CSS variables and a `theme` prop.

- `auto` (default): Follows Quasar’s global dark mode by observing `.q-dark` or `.body--dark` on `html`/`body` and updates live without remounts.
- `dark`: Forces the dark palette for that instance.
- `light`: Forces the light palette for that instance.

Examples

```vue
<template>
	<!-- Auto (default) – follows Quasar q-dark live -->
	<airbnb-style-datepicker :trigger-element-id="'auto-trigger'" />

	<!-- Explicit auto (equivalent to default) -->
	<airbnb-style-datepicker :trigger-element-id="'auto2-trigger'" :theme="'auto'" />

	<!-- Force dark -->
	<airbnb-style-datepicker :trigger-element-id="'dark-trigger'" :theme="'dark'" />

	<!-- Force light -->
	<airbnb-style-datepicker :trigger-element-id="'light-trigger'" :theme="'light'" />
</template>
```

Under the hood the component sets `data-theme` on its wrapper and uses CSS variables for colors. To fine‑tune colors, override the variables in your global CSS:

```css
/* Optional: tweak dark palette */
.asd__wrapper[data-theme='dark']{
	--asd-bg: #1f1f1f;
	--asd-text: #f0f0f0;
	--asd-selected: #1db9aa;
	--asd-selected-text: #0b0b0b;
	--asd-in-range: #155e67;
	--asd-in-range-border: #2db9c8;
	--asd-hovered-in-range: #197f8b;
	--asd-disabled: #2a2a2a;
	--asd-border-color: rgba(255,255,255,.2);
	--asd-day-hover-bg: #2d2d2d;
	--asd-day-border: #3a3a3a;
}
```

Notes
- `trigger-element-id` must match an element that exists when the component mounts.
- In programmatic scenarios, keep your boolean in sync via `@opened`/`@closed`.
- When `inline` is `true`, the picker is always visible (outside-click close is disabled by design).
- Keyboard shortcuts/help panel: click the `?` chevron to open. The panel overlays above the calendar (higher z-index than the month nav arrows).
- With Quasar, `theme="auto"` follows `q-dark` (v2+) or `body--dark` (v1) instantly; no remounts or manual syncing needed. If your app uses a different global dark class, you can control per‑instance explicitly via `theme`.

---

## Dev / Demo

This repo includes a small demo under `dev/`.

```bash
# install deps
npm install

# run the demo (served from dev/)
npm run dev

# build library (ES/CJS/UMD) and demo
npm run build

# preview the built demo
npm run preview
```

Build outputs (library)
- `dist/vue-airbnb-style-datepicker.es.js` (module)
- `dist/vue-airbnb-style-datepicker.cjs.js` (commonjs)
- `dist/vue-airbnb-style-datepicker.js` (UMD)
- `dist/style.css`

---

## Formatting

This project uses Prettier v3.

```bash
npm run format       # apply formatting
npm run format:check # check formatting only
```

---

## Browser support (from original project)

This datepicker has been tested with the following browsers/OS (from the original project notes):

Chrome
Firefox
Edge
Android
IE: 9 and higher
Safari: 7.1 and higher
iOS: 6 and higher

However, these tests were not extensive; if you plan to use this in production, please verify in the browsers you intend to support.

---

## License & attribution

MIT. Based on the original work by Mikael Edebro: https://github.com/MikaelEdebro/vue-airbnb-style-datepicker

This fork updates the implementation and build tooling for Vue 3 and Vite.

Changelog (high level)
- Vue 3 compatibility and Vite builds
- Programmatic toggle fixes and outside‑click close on Vue 3
- Range selection improvements (backwards selection; fresh start after full range when action buttons are shown)
- Theming API: `theme = 'light' | 'dark' | 'auto'` (default `'auto'` follows Quasar `q-dark` live) + CSS variables


---

## Locale examples

This component supports localization via the plugin options (global) and per-instance overrides. The demo registers global values in `dev/index.js`; you can override per instance with the `monthNamesOverride`, `daysOverride`, and `daysShortOverride` props.

Global plugin (recommended for most apps):

```js
import VueAirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'

app.use(VueAirbnbStyleDatepicker, {
	monthNames: ['Jan', 'Feb', 'Mar', /* ... */],
	days: ['Sunday', 'Monday', /* ... */],
	daysShort: ['Su','Mo',/* ... */]
})
```

Per-instance overrides (non-forcing):

```vue
<airbnb-style-datepicker
	:monthNamesOverride="['Ene','Feb',... ]"
	:daysOverride="['Dom','Lun',... ]"
	:daysShortOverride="['Do','Lu',... ]"
/>
```

See the demo for examples: [dev/index.js](dev/index.js#L1) and [dev/App.vue](dev/App.vue#L1).

---

## Troubleshooting & dev tips

- If `npm run dev` fails locally, try removing `node_modules` and the lockfile then reinstalling with legacy peer deps:

```bash
cd vue-airbnb-style-datepicker
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

- If you consume this package from GitHub, the `prepare` script will build the library on `npm install` — ensure your CI or host supports building from source.
- If you see a browser console message about an async response to a listener, that usually comes from a browser extension (not from this repo).

---

## Running tests

This repo includes unit tests with Vitest. Run them from the project root:

```bash
npm install
npm run test
```

See configuration in [vitest.config.ts](vitest.config.ts#L1) and example specs in [src/components/__tests__/AirbnbStyleDatepicker.spec.js](src/components/__tests__/AirbnbStyleDatepicker.spec.js#L1).

---

## Package metadata

If you plan to publish or reference this fork as the primary source, consider updating `package.json` repository/homepage/bugs fields to point to this repo (`https://github.com/SystemicGlitch/vue-airbnb-style-datepicker`) so users can find issues and the source easily.

---

## Contributing

- Run formatting before committing: `npm run format`.
- Add tests for new behavior and run `npm run test`.
- Use `master` as the default example branch in install snippets in this README if that matches your repo layout.

---

