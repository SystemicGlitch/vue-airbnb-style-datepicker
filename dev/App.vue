<template>
  <div class="app" :class="{'align-right': alignRight}">
    <h1>Examples</h1>
    <div class="buttons">
      <label style="margin-right:12px;">
        <input type="checkbox" v-model="useDark" /> Dark mode
      </label>
      <label>
        Locale:
        <select v-model="selectedLocale" style="margin-left:8px;">
          <option v-for="loc in locales" :key="loc.id" :value="loc.id">{{ loc.label }}</option>
        </select>
      </label>
    </div>
    <div class="buttons responsive-controls">
      <label>
        Demo container width:
        <input type="range" min="280" max="1000" v-model.number="demoContainerWidth" style="margin: 0 8px; vertical-align: middle;" />
        <span>{{ demoContainerWidth }}px</span>
      </label>
    </div>
    <div class="buttons">
      <button @click="toggleDatepickers">Hide datepickers</button>
      <button @click="toggleAlign">Toggle alignment</button>
      <button @click="toggleTrigger">Toggle trigger</button>
    </div>
    <div class="demo-wrap" :style="{'--demo-max-width': demoContainerWidth + 'px'}">
    <div v-if="showDatepickers">

      <div class="datepicker-container with-input">
        <h3>Range datepicker with input</h3>
        <div class="datepicker-trigger">
          <input
            type="text"
            id="datepicker-input-trigger"
            :value="formatDates(inputDateOne, inputDateTwo)"
            placeholder="Select dates"
          >

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-input-trigger'"
            :mode="'range'"
            :date-one="inputDateOne"
            :min-date="'2018-08-28'"
            :months-to-show="2"

            :month-names-override="currentLocale.monthNames"
            :days-override="currentLocale.days"
            :days-short-override="currentLocale.daysShort"

            :show-action-buttons="true"
            :show-month-year-select="true"
            :theme="demoTheme"
            :key="selectedLocale"
            @date-one-selected="val => { inputDateOne = val }"
            @date-two-selected="val => { inputDateTwo = val }"
          />
        </div>
      </div>

      <div class="datepicker-container single-with-input">
        <h3>Single datepicker with input</h3>
        <div class="datepicker-trigger">
          <input
            type="text"
            id="datepicker-input-single-trigger"
            :value="formatDates(inputSingleDateOne)"
            placeholder="Select dates"
          >

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-input-single-trigger'"
            :mode="'single'"
            :date-one="inputSingleDateOne"
            :date-two="inputSingleDateTwo"

            :theme="demoTheme"
            :key="selectedLocale"
            :month-names-override="currentLocale.monthNames"
            :days-override="currentLocale.days"
            :days-short-override="currentLocale.daysShort"
            @date-one-selected="val => { inputSingleDateOne = val }"
          />
        </div>
      </div>

      <div class="datepicker-container with-button">
        <h3>Range datepicker with button</h3>
        <div class="datepicker-trigger">
          <button id="datepicker-button-trigger">{{ formatDates(buttonDateOne, buttonDateTwo) || 'Select dates' }}</button>

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-button-trigger'"
            :mode="'range'"
            :date-one="buttonDateOne"
            :date-two="buttonDateTwo"
            :min-date="'2018-04-18'"
            :fullscreen-mobile="false"
            :months-to-show="2"

            :trigger="trigger"
            :offset-y="10"
            :close-after-select="true"
            :theme="demoTheme"
            :key="selectedLocale"
            :month-names-override="currentLocale.monthNames"
            :days-override="currentLocale.days"
            :days-short-override="currentLocale.daysShort"
            @date-one-selected="val => { buttonDateOne = val }"
            @date-two-selected="val => { buttonDateTwo = val; trigger = false }"
          />
        </div>
      </div>

      <div class="datepicker-container inline-with-input">
        <h3>Inline datepicker with input</h3>
        <div class="controls" style="margin: 8px 0 12px; display:flex; flex-wrap:wrap; gap:10px 16px; align-items:center;">
          <label>
            Months to show:
            <input type="number" v-model.number="inlineMonthsToShow" min="1" max="6" style="width:70px; margin-left:6px;" />
          </label>
          <label v-if="!demoAutoFitInline">
            Month width: <input type="range" min="260" max="360" step="2" v-model.number="demoMonthWidth" style="vertical-align: middle; margin: 0 8px;" />
            <span>{{ demoMonthWidth }}px</span>
          </label>
          <label>
            <input type="checkbox" v-model="demoAutoFitInline" /> Auto-fit inline (flex months)
          </label>
          <label>
            Day number position:
            <select v-model="demoDayPosition" style="margin-left:6px;">
              <option value="center">Center</option>
              <option value="top-left">Top left</option>
              <option value="top-right">Top right</option>
              <option value="bottom-left">Bottom left</option>
              <option value="bottom-right">Bottom right</option>
            </select>
          </label>
        </div>
        <input
          id="datepicker-inline-trigger"
          :value="formatDates(inlineDateOne)"
          type="text"
          placeholder="Select date"
        >
        <airbnb-style-datepicker
          :trigger-element-id="'datepicker-inline-trigger'"
          :mode="'single'"
          :inline="true"
          :fullscreen-mobile="false"
          :date-one="inlineDateOne"
          :months-to-show="inlineMonthsToShow"
          :month-width="demoMonthWidth"
          :auto-fit-inline="demoAutoFitInline"
          :day-number-position="demoDayPosition"

          :disabled-dates="['2018-04-30', '2018-05-10', '2018-12-14']"
          :customized-dates="[{ dates: ['2019-03-21', '2019-03-22', '2019-03-23', '2019-03-24'], cssClass: 'booked' }, { dates: ['2019-03-21', '2019-03-22', '2019-03-23', '2019-04-24'], cssClass: 'not-available' }]"
          :theme="demoTheme"
          :month-names-override="currentLocale.monthNames"
          :days-override="currentLocale.days"
          :days-short-override="currentLocale.daysShort"
          :key="selectedLocale"
          @date-one-selected="val => { inlineDateOne = val }"
        >
          <!-- Example of custom day slot: star first day of each month -->
          <template #day="{ day, date }">
            <div class="demo-day-slot" :title="date">
              <span>{{ day }}</span>
              <small v-if="date && date.endsWith('-01')" class="demo-star">★</small>
            </div>
          </template>
        </airbnb-style-datepicker>
      </div>

      <div class="datepicker-container inline-with-input">
        <h3>Inline datepicker with disabled dates</h3>
        <input
          id="datepicker-disabled-dates-trigger"
          :value="formatDates(withDisabledDatesDateOne)"
          type="text"
          placeholder="Select date"
        >
        <airbnb-style-datepicker
          :trigger-element-id="'datepicker-disabled-dates-trigger'"
          :mode="'single'"
          :inline="true"
          :date-one="withDisabledDatesDateOne"
          :months-to-show="2"
          :month-width="demoMonthWidth"
          :auto-fit-inline="demoAutoFitInline"
          :day-number-position="demoDayPosition"

          :disabled-dates="disabledDates"
          :theme="demoTheme"
          :month-names-override="currentLocale.monthNames"
          :days-override="currentLocale.days"
          :days-short-override="currentLocale.daysShort"
          :key="selectedLocale"
          @date-one-selected="val => { withDisabledDatesDateOne = val }"
        />
      </div>

      <div class="datepicker-container with-button">
        <h3>Test callback methods</h3>
        <div class="datepicker-trigger">
          <button id="datepicker-callback-trigger">{{ formatDates(callbackDateOne, callbackDateTwo) || 'Select dates' }}</button>

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-callback-trigger'"
            :mode="'range'"
            :date-one="callbackDateOne"
            :date-two="callbackDateTwo"
            :fullscreen-mobile="false"
            :months-to-show="2"

            :offset-y="10"
            :theme="demoTheme"
            :month-names-override="currentLocale.monthNames"
            :days-override="currentLocale.days"
            :days-short-override="currentLocale.daysShort"
            :key="selectedLocale"
            @date-one-selected="onDateOneSelected"
            @date-two-selected="onDateTwoSelected"
            @apply="applyMethod"
            @closed="closedMethod"
            @cancelled="cancelledMethod"
            @opened="openedMethod"
            @previous-month="changeMonthMethod"
            @next-month="changeMonthMethod"
          />
          <div class="event-log" v-if="eventLog.length">
            <h4>Event log</h4>
            <ul>
              <li v-for="(e, i) in eventLog" :key="i">{{ e }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="datepicker-container with-button">
      <h3>Range datepicker ({{ demoThemeLabel }})</h3>
      <div class="datepicker-trigger">
        <button id="datepicker-button-dark-trigger">{{ formatDates(darkDateOne, darkDateTwo) || 'Select dates' }}</button>

        <airbnb-style-datepicker
          :trigger-element-id="'datepicker-button-dark-trigger'"
          :mode="'range'"
          :date-one="darkDateOne"
          :date-two="darkDateTwo"
          :months-to-show="2"

          :offset-y="10"
          :theme="demoTheme"
          :close-after-select="true"
          :month-names-override="currentLocale.monthNames"
          :days-override="currentLocale.days"
          :days-short-override="currentLocale.daysShort"
          :key="selectedLocale"
          @date-one-selected="val => { darkDateOne = val }"
          @date-two-selected="val => { darkDateTwo = val }"
        />
      </div>
    </div>
    </div> <!-- .demo-wrap -->
  </div>
</template>

<script>
import format from 'date-fns/format'

export default {
  data() {
    return {
      dateFormat: 'YYYY-MM-DD', //'D MMM',
      inputDateOne: '',
      inputDateTwo: '',
      inputSingleDateOne: '',
      inputSingleDateTwo: '',
      buttonDateOne: '',
      buttonDateTwo: '',
      darkDateOne: '',
      darkDateTwo: '',
      inlineDateOne: '',
      withDisabledDatesDateOne: '',
      callbackDateOne: '',
      callbackDateTwo: '',
      sundayFirst: false,
      alignRight: false,
      showDatepickers: true,
      trigger: false,
      eventLog: [],
      useDark: false,
      inlineMonthsToShow: 2,
      // demo-only locales
      selectedLocale: 'en',
      locales: [
        {
          id: 'en',
          label: 'English',
          monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
          days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          daysShort: ['Su','Mo','Tu','We','Th','Fr','Sa']
        },
        {
          id: 'sv',
          label: 'Svenska',
          monthNames: ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December'],
          days: ['Söndag','Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag'],
          daysShort: ['Sö','Må','Ti','On','To','Fr','Lö']
        }
      ],
      // demo-only flags
      demoContainerWidth: 600,
      demoMonthWidth: 300,
      demoAutoFitInline: true,
      demoDayPosition: 'center',
    }
  },
  computed: {

    currentLocale() {
      return this.locales.find(l => l.id === this.selectedLocale) || this.locales[0]
    },

    demoTheme() {
      return this.useDark ? 'dark' : undefined
    },
    demoThemeLabel() {
      return this.useDark ? 'Dark theme' : 'Light theme'
    },
    disabledDates() {
      // Disable a few dates within the two months currently shown (current & next month)
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth()
      const fmt = d => format(d, 'YYYY-MM-DD')

      const month1Days = [5, 12, 20]
      const month2Days = [3, 15, 27]

      const inMonth = (year, month, days) =>
        days
          .map(day => new Date(year, month, day))
          .filter(d => d.getMonth() === month) // guard invalid dates
          .map(fmt)

      const month1 = inMonth(y, m, month1Days)
      const month2 = inMonth(y, (m + 1) % 12, month2Days.map(d => d))

      // If next month wrapped year, adjust year
      if (m === 11) {
        // December -> January
        const nextYear = y + 1
        const jan = month2Days
          .map(day => new Date(nextYear, 0, day))
          .filter(d => d.getMonth() === 0)
          .map(fmt)
        return [...month1, ...jan]
      }

      return [...month1, ...month2]
    },
  },
  methods: {
    formatDates(dateOne, dateTwo) {
      let formattedDates = ''
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat)
      }
      if (dateTwo) {
        formattedDates += ' - ' + format(dateTwo, this.dateFormat)
      }
      return formattedDates
    },
    toggleAlign() {
      this.alignRight = !this.alignRight
    },
    toggleDatepickers() {
      this.showDatepickers = !this.showDatepickers
    },
    toggleTrigger() {
      this.trigger = !this.trigger
    },
    applyMethod() {
      const msg = `apply: ${this.formatDates(this.callbackDateOne, this.callbackDateTwo)}`
      console.log(msg)
      this.eventLog.unshift(msg)
    },
    openedMethod() {
      const msg = 'opened'
      console.log(msg)
      this.eventLog.unshift(msg)
    },
    closedMethod() {
      const msg = 'closed'
      console.log(msg)
      this.eventLog.unshift(msg)
      this.trigger = false
    },
    cancelledMethod() {
      const msg = 'cancelled'
      console.log(msg)
      this.eventLog.unshift(msg)
    },
    changeMonthMethod(visibleMonths) {
      const msg = `change months: ${visibleMonths.join(' , ')}`
      console.log(msg)
      this.eventLog.unshift(msg)
    },

    onDateOneSelected(val) {
      this.callbackDateOne = val
      const msg = `date-one-selected: ${val || 'cleared'}`
      this.eventLog.unshift(msg)
    },
    onDateTwoSelected(val) {
      this.callbackDateTwo = val
      const msg = `date-two-selected: ${val || 'cleared'}`
      this.eventLog.unshift(msg)
    },
  },
}
</script>

<style lang="scss">
html,
body {
  min-height: 200vh;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
    Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 18px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  padding: 10px;
}
.app {
  &.align-right {
    text-align: right;
  }
}

h1 {
  font-size: 1.8em;
  line-height: 1.5em;
  text-align: center;
}
.datepicker-container {
  padding: 0 30px 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.01);
  max-width: 600px;
  margin: 0 auto 30px;
  border-radius: 12px;
}

#datepicker-button-trigger {
  background: #008489;
  border: 1px solid #008489;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  min-width: 200px;
}
input {
  padding: 6px 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.with-input {
  .datepicker-trigger {
    //padding-right: 40px;
  }
}
.with-button {
  .datepicker-trigger {
    //padding-left: 10px;
  }
}
// .inline-with-input {
//   width: 600px;
//   input {
//     width: 100%;
//   }
// }
.buttons {
  max-width: 800px;
  margin: 0 auto 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px 16px;
  flex-wrap: wrap;
  > * {
    margin: 0 !important;
  }
}

.demo-wrap {
  /* used to pass a CSS var for container max width */
}

.datepicker-container {
  padding: 0 20px 16px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.01);
  max-width: min(100%, var(--demo-max-width, 600px));
  width: 100%;
  /* Ensure the center column (demo block) doesn't get too narrow on larger screens */
  min-width: 520px;
  margin: 0 auto 20px;
  border-radius: 12px;
}

/* Make inputs and controls friendlier on small screens */
@media (max-width: 640px) {
  body { padding: 10px 8px; }
  .datepicker-container {
    padding: 0 12px 12px;
    min-width: 0; /* allow full fluid behavior on small screens */
  }
  .buttons { gap: 8px 10px; }
  .buttons select,
  .buttons input[type='checkbox'] { transform: scale(1.0); }
  #datepicker-button-trigger,
  #datepicker-button-dark-trigger { width: 100%; min-width: 0; }
  .with-input input[type='text'] { width: 100%; box-sizing: border-box; }
}

/* Make the datepicker header's center area a bit wider in the demo so month names don't crowd */
@media (min-width: 768px) {
  .asd__datepicker-header {
    padding: 0 96px; /* default was 72px in component; give more room between nav buttons */
  }
}

/* Small decoration for custom day slot in the demo */
.demo-day-slot { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 2px; }
.demo-day-slot .demo-star { color: #f39c12; font-size: 0.72em; line-height: 1; }
</style>
