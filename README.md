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
npm install github:your-username/vue-airbnb-style-datepicker#main
# or pin a tag/commit
npm install github:your-username/vue-airbnb-style-datepicker#v2.7.0
```

- Monorepo subdirectory usage (npm v9+):
```bash
npm install github:your-username/your-monorepo#main:vue-airbnb-style-datepicker
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

### Theming: light, dark, auto

This fork provides a simple theming API driven by CSS variables and a `theme` prop.

- `auto` (default): Follows Quasar’s global dark mode by observing `.q-dark` on `html`/`body` and updates live without remounts.
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
- With Quasar, `theme="auto"` follows `q-dark` instantly; no remounts or manual syncing needed. If your app uses a different global dark class, you can control per‑instance explicitly via `theme`.

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

