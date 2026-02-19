<template>
  <transition name="asd__fade">
    <div
      :id="wrapperId"
      ref="wrapper"
      class="asd__wrapper"
      v-show="showDatepicker"
      :data-theme="dataTheme"
      :class="wrapperClasses"
      :style="showFullscreen ? undefined : wrapperStyles"
      v-click-outside="handleClickOutside"
    >
      <div class="asd__mobile-header asd__mobile-only" v-if="showFullscreen">
        <button
          type="button"
          class="asd__mobile-close"
          @click="closeDatepicker"
          :aria-label="ariaLabels.closeDatepicker"
        >
          <slot v-if="$slots['close-icon']" name="close-icon"></slot>
          <div v-else class="asd__mobile-close-icon" aria-hidden="true">X</div>
        </button>
        <h3>{{ mobileHeader || mobileHeaderFallback }}</h3>
      </div>
      <div class="asd__datepicker-header">
        <div class="asd__change-month-button asd__change-month-button--previous">
          <button @click="previousMonth" type="button" :aria-label="ariaLabels.previousMonth">
            <slot v-if="$slots['previous-month-icon']" name="previous-month-icon"></slot>
            <svg v-else viewBox="0 0 1000 1000">
              <path
                d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"
              ></path>
            </svg>
          </button>
        </div>
        <div class="asd__change-month-button asd__change-month-button--next">
          <button @click="nextMonth" type="button" :aria-label="ariaLabels.nextMonth">
            <slot v-if="$slots['next-month-icon']" name="next-month-icon"></slot>
            <svg v-else viewBox="0 0 1000 1000">
              <path
                d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"
              ></path>
            </svg>
          </button>
        </div>

        <div
          class="asd__days-legend"
          v-for="(month, index) in showMonths"
          :key="month"
          :style="[monthWidthStyles, {left: (width * index) + 'px'}]"
        >
          <div class="asd__day-title" v-for="(day, index) in daysShort" :key="index">{{ day }}</div>
        </div>
      </div>

      <div class="asd__inner-wrapper" :style="innerStyles">
        <transition-group name="asd__list-complete" tag="div">
          <div
            v-for="(month, monthIndex) in months"
            :key="month.firstDateOfMonth"
            class="asd__month"
            :class="{'asd__month--hidden': monthIndex === 0 || monthIndex > showMonths}"
            :style="monthWidthStyles"
          >
            <div class="asd__month-name">
              <select
                v-if="showMonthYearSelect"
                v-model="month.monthName"
                class="asd__month-year-select"
                :tabindex="monthIndex === 0 || monthIndex > showMonths ? -1 : 0"
                @change="updateMonth(monthIndex, month.year, $event)"
                v-resize-select
              >
                <option
                  v-for="(monthName, idx) in monthNames"
                  :value="monthName"
                  :disabled="isMonthDisabled(month.year, idx)"
                  :key="`month-${monthIndex}-${monthName}`"
                >{{ monthName }}</option>
              </select>
              <span v-else>{{ month.monthName }}</span>

              <select
                v-if="showMonthYearSelect"
                class="asd__month-year-select"
                :tabindex="monthIndex === 0 || monthIndex > showMonths ? -1 : 0"
                v-model="month.year"
                @change="updateYear(monthIndex, month.monthNumber - 1, $event)"
              >
                <option
                  v-if="years.indexOf(month.year) === -1"
                  :value="month.year"
                  :key="`month-${monthIndex}-${year}`"
                  :disabled="true"
                >{{ month.year }}</option>
                <option
                  v-for="year in years"
                  :value="year"
                  :key="`month-${monthIndex}-${year}`"
                >{{ year }}</option>
              </select>
              <span v-else>{{ month.year }}</span>
            </div>

            <table class="asd__month-table" role="presentation">
              <tbody>
                <tr class="asd__week" v-for="(week, index) in month.weeks" :key="index">
                  <td
                    class="asd__day"
                    v-for="({fullDate, dayNumber}, index) in week"
                    :key="index + '_' + dayNumber"
                    :data-date="fullDate"
                    :ref="`date-${fullDate}`"
                    :tabindex="isDateVisible(fullDate) && isSameDate(focusedDate, fullDate) ? 0 : -1"
                    :aria-label="isDateVisible(fullDate) ? getAriaLabelForDate(fullDate) : false"
                    :class="[{
                      'asd__day--enabled': dayNumber !== 0,
                      'asd__day--empty': dayNumber === 0,
                      'asd__day--disabled': isDisabled(fullDate),
                      'asd__day--selected': fullDate && (selectedDate1 === fullDate || selectedDate2 === fullDate),
                      'asd__day--in-range': isInRange(fullDate),
                      'asd__day--today': fullDate && isToday(fullDate),
                      'asd__day--hovered': isHoveredInRange(fullDate),
                      'asd__selected-date-one': fullDate && fullDate === selectedDate1,
                      'asd__selected-date-two': fullDate && fullDate === selectedDate2,
                    }, customizedDateClass(fullDate)]"
                    :style="getDayStyles(fullDate)"
                    @mouseover="() => { setHoverDate(fullDate) }"
                  >
                    <button
                      class="asd__day-button"
                      type="button"
                      v-if="dayNumber"
                      tabindex="-1"
                      :date="fullDate"
                      :disabled="isDisabled(fullDate)"
                      @click="() => { selectDate(fullDate) }"
                    >{{ dayNumber }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition-group>
        <div
          v-if="showShortcutsMenuTrigger"
          :class="{ 'asd__keyboard-shortcuts-menu': true, 'asd__keyboard-shortcuts-show': showKeyboardShortcutsMenu}"
          :style="keyboardShortcutsMenuStyles"
        >
          <div class="asd__keyboard-shortcuts-title">{{ texts.keyboardShortcuts }}</div>
          <button
            class="asd__keyboard-shortcuts-close"
            ref="keyboard-shortcus-menu-close"
            tabindex="0"
            @click="closeKeyboardShortcutsMenu"
            :aria-label="ariaLabels.closeKeyboardShortcutsMenu"
          >
            <slot v-if="$slots['close-shortcuts-icon']" name="close-shortcuts-icon"></slot>
            <div v-else class="asd__mobile-close-icon" aria-hidden="true">X</div>
          </button>
          <ul class="asd__keyboard-shortcuts-list">
            <li v-for="(shortcut, i) in keyboardShortcuts" :key="i">
              <span
                class="asd__keyboard-shortcuts-symbol"
                :aria-label="shortcut.symbolDescription"
              >{{ shortcut.symbol }}</span>
              {{ shortcut.label }}
            </li>
          </ul>
        </div>
      </div>
      <div class="asd__action-buttons" v-if="mode !== 'single' && showActionButtons">
        <button @click="closeDatepickerCancel" type="button">{{ texts.cancel }}</button>
        <button
          ref="apply-button"
          @click="apply"
          :style="{color: colors.selected}"
          type="button"
        >{{ texts.apply }}</button>
      </div>
      <div v-if="showShortcutsMenuTrigger" class="asd__keyboard-shortcuts-trigger-wrapper">
        <button
          class="asd__keyboard-shortcuts-trigger"
          :aria-label="ariaLabels.openKeyboardShortcutsMenu"
          tabindex="0"
          @click="openKeyboardShortcutsMenu"
        >
          <span>?</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import format from 'date-fns/format'
import subMonths from 'date-fns/sub_months'
import addMonths from 'date-fns/add_months'
import getDaysInMonth from 'date-fns/get_days_in_month'
import lastDayOfMonth from 'date-fns/last_day_of_month'
import getMonth from 'date-fns/get_month'
import setMonth from 'date-fns/set_month'
import getYear from 'date-fns/get_year'
import setYear from 'date-fns/set_year'
import isSameMonth from 'date-fns/is_same_month'
import isSameDay from 'date-fns/is_same_day'
import addDays from 'date-fns/add_days'
import subDays from 'date-fns/sub_days'
import addWeeks from 'date-fns/add_weeks'
import subWeeks from 'date-fns/sub_weeks'
import startOfMonth from 'date-fns/start_of_month'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'
import isValid from 'date-fns/is_valid'
import { debounce, copyObject, findAncestor, randomString } from './../helpers'
import vClickOutside from 'v-click-outside'
import ResizeSelect from '../directives/ResizeSelect'

export default {
  name: 'AirbnbStyleDatepicker',
  // Declare all emitted events (Vue 3 best practice)
  emits: [
    'date-one-selected',
    'date-two-selected',
    'previous-month',
    'next-month',
    'opened',
    'closed',
    'cancelled',
    'apply',
  ],
  directives: {
    // For Vue 3, v-click-outside exposes the directive on the `.directive` property
    clickOutside: vClickOutside.directive,
    resizeSelect: ResizeSelect,
  },
  props: {
    triggerElementId: { type: String },
    dateOne: { type: [String, Date] },
    dateTwo: { type: [String, Date] },
    minDate: { type: [String, Date] },
    endDate: { type: [String, Date] },
    mode: { type: String, default: 'range' },
    offsetY: { type: Number, default: 0 },
    offsetX: { type: Number, default: 0 },
    monthsToShow: { type: Number, default: 2 },
    startOpen: { type: Boolean },
    fullscreenMobile: { type: Boolean },
    inline: { type: Boolean },
    mobileHeader: { type: String },
    disabledDates: { type: Array, default: () => [] },
    enabledDates: { type: Array, default: () => [] },
    customizedDates: { type: Array, default: () => [] },
    showActionButtons: { type: Boolean, default: true },
    showShortcutsMenuTrigger: { type: Boolean, default: true },
    showMonthYearSelect: { type: Boolean, default: false },
    yearsForSelect: { type: Number, default: 10 },
    isTest: {
      type: Boolean,
      // Avoid relying on webpack-style process.env; use Vite's import.meta.env when available
      default: () => (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'test') || false,
    },
    trigger: { type: Boolean, default: false },
    closeAfterSelect: { type: Boolean, default: false },
    // Theming: 'light' | 'dark' | 'auto' (auto follows app's dark mode, e.g. Quasar q-dark)
    theme: {
      type: String,
      default: 'auto',
      validator: v => ['light', 'dark', 'auto', undefined].includes(v),
    },
  },
  data() {
    return {
      wrapperId: 'airbnb-style-datepicker-wrapper-' + randomString(5),
      dateFormat: 'YYYY-MM-DD',
      dateLabelFormat: 'dddd, MMMM D, YYYY',
      showDatepicker: false,
      showKeyboardShortcutsMenu: false,
      showMonths: 2,
      colors: {
        selected: '#00a699',
        inRange: '#66e2da',
        selectedText: '#fff',
        text: '#565a5c',
        inRangeBorder: '#33dacd',
        disabled: '#fff',
        hoveredInRange: '#67f6ee',
      },
      sundayFirst: false,
      ariaLabels: {
        chooseDate: date => date,
        chooseStartDate: date => `Choose ${date} as your start date.`,
        chooseEndDate: date => `Choose ${date} as your end date.`,
        selectedDate: date => `Selected. ${date}`,
        unavailableDate: date => `Not available. ${date}`,
        previousMonth: 'Move backward to switch to the previous month.',
        nextMonth: 'Move forward to switch to the next month.',
        closeDatepicker: 'Close calendar',
        openKeyboardShortcutsMenu: 'Open keyboard shortcuts menu.',
        closeKeyboardShortcutsMenu: 'Close keyboard shortcuts menu',
      },
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      daysShort: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
      texts: {
        apply: 'Apply',
        cancel: 'Cancel',
        keyboardShortcuts: 'Keyboard Shortcuts',
      },
      keyboardShortcuts: [
        { symbol: '↵', label: 'Select the date in focus', symbolDescription: 'Enter key' },
        {
          symbol: '←/→',
          label: 'Move backward (left) and forward (right) by one day.',
          symbolDescription: 'Left or right arrow keys',
        },
        {
          symbol: '↑/↓',
          label: 'Move backward (up) and forward (down) by one week.',
          symbolDescription: 'Up or down arrow keys',
        },
        {
          symbol: 'PgUp/PgDn',
          label: 'Switch months.',
          symbolDescription: 'PageUp and PageDown keys',
        },
        {
          symbol: 'Home/End',
          label: 'Go to the first or last day of a week.',
          symbolDescription: 'Home or End keys',
        },
        { symbol: 'Esc', label: 'Close this panel', symbolDescription: 'Escape key' },
        { symbol: '?', label: 'Open this panel', symbolDescription: 'Question mark' },
      ],
      keys: {
        arrowDown: 40,
        arrowUp: 38,
        arrowRight: 39,
        arrowLeft: 37,
        enter: 13,
        pgUp: 33,
        pgDn: 34,
        end: 35,
        home: 36,
        questionMark: 191,
        esc: 27,
      },
      startingDate: '',
      months: [],
      years: [],
      width: 300,
      selectedDate1: '',
      selectedDate2: '',
      isSelectingDate1: true,
      hoverDate: '',
      focusedDate: '',
      alignRight: false,
      triggerPosition: {},
      triggerWrapperPosition: {},
      viewportWidth: undefined,
      isMobile: undefined,
      isTablet: undefined,
      triggerElement: undefined,
      isDark: false,
      _darkMo: null,
    }
  },
  computed: {
    dataTheme() {
      return this.isDark ? 'dark' : null
    },
    wrapperClasses() {
      return {
        'asd__wrapper--datepicker-open': this.showDatepicker,
        'asd__wrapper--full-screen': this.showFullscreen,
        'asd__wrapper--inline': this.inline,
      }
    },
    wrapperStyles() {
      return {
        position: this.inline ? 'static' : 'absolute',
        top: this.inline ? '0' : this.triggerPosition.height + this.offsetY + 'px',
        left: !this.alignRight
          ? this.triggerPosition.left - this.triggerWrapperPosition.left + this.offsetX + 'px'
          : '',
        right: this.alignRight
          ? this.triggerWrapperPosition.right - this.triggerPosition.right + this.offsetX + 'px'
          : '',
        width: this.width * this.showMonths + 'px',
        zIndex: this.inline ? '0' : '100',
      }
    },
    innerStyles() {
      return {
        'margin-left': this.showFullscreen ? '-' + this.viewportWidth : `-${this.width}px`,
      }
    },
    keyboardShortcutsMenuStyles() {
      return {
        left: this.showFullscreen ? this.viewportWidth : `${this.width}px`,
      }
    },
    monthWidthStyles() {
      return {
        width: this.showFullscreen ? this.viewportWidth : this.width + 'px',
      }
    },
    mobileHeaderFallback() {
      return this.mode === 'range' ? 'Select dates' : 'Select date'
    },
    showFullscreen() {
      return this.isMobile && this.fullscreenMobile
    },
    datesSelected() {
      return !!(
        (this.selectedDate1 && this.selectedDate1 !== '') ||
        (this.selectedDate2 && this.selectedDate2 !== '')
      )
    },
    allDatesSelected() {
      return !!(
        this.selectedDate1 &&
        this.selectedDate1 !== '' &&
        this.selectedDate2 &&
        this.selectedDate2 !== ''
      )
    },
    hasMinDate() {
      return !!(this.minDate && this.minDate !== '')
    },
    isRangeMode() {
      return this.mode === 'range'
    },
    isSingleMode() {
      return this.mode === 'single'
    },
    datepickerWidth() {
      return this.width * this.showMonths
    },
    datePropsCompound() {
      // used to watch for changes in props, and update GUI accordingly
      return this.dateOne + this.dateTwo
    },
    isDateTwoBeforeDateOne() {
      if (!this.dateTwo) {
        return false
      }
      return isBefore(this.dateTwo, this.dateOne)
    },
    visibleMonths() {
      const firstMonthArray = this.months.filter((m, index) => index > 0)
      const numberOfMonthsArray = []
      for (let i = 0; i < this.showMonths; i++) {
        numberOfMonthsArray.push(i)
      }
      return numberOfMonthsArray.map((_, index) => firstMonthArray[index].firstDateOfMonth)
    },
  },
  watch: {
    theme() {
      this._applyTheme()
      if (this.theme === 'auto' && !this._darkMo) {
        try {
          const body = document.body
          const html = document.documentElement
          this._darkMo = new MutationObserver(() => this._applyTheme())
          if (body) this._darkMo.observe(body, { attributes: true, attributeFilter: ['class'] })
          if (html) this._darkMo.observe(html, { attributes: true, attributeFilter: ['class'] })
        } catch (e) {}
      } else if (this.theme !== 'auto' && this._darkMo) {
        try { this._darkMo.disconnect() } catch (e) {}
        this._darkMo = null
      }
    },
    selectedDate1(newValue, oldValue) {
      let newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat)
      this.$emit('date-one-selected', newDate)
    },
    selectedDate2(newValue, oldValue) {
      let newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat)
      this.$emit('date-two-selected', newDate)
    },
    mode(newValue, oldValue) {
      this.setStartDates()
    },
    minDate() {
      this.setStartDates()
      this.generateMonths()
      this.generateYears()
    },
    endDate() {
      this.generateYears()
    },
    datePropsCompound(newValue) {
      if (this.dateOne !== this.selectedDate1) {
        this.startingDate = this.dateOne
        this.setStartDates()
        this.generateMonths()
        this.generateYears()
      }
      if (this.isDateTwoBeforeDateOne) {
        this.selectedDate2 = ''
        this.$emit('date-two-selected', '')
      }
    },
    trigger(newValue, oldValue) {
      // Allow external prop to both open and close the datepicker
      // true -> open, false -> close
      setTimeout(() => {
        if (newValue) {
          this.openDatepicker()
        } else {
          this.closeDatepicker()
        }
      }, 0)
    },
  },
  created() {
    this.setupDatepicker()

    if (this.sundayFirst) {
      this.setSundayToFirstDayInWeek()
    }
  },
  mounted() {
    this.viewportWidth = window.innerWidth + 'px'
    this.isMobile = window.innerWidth < 768
    this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024
    // Initialize theme and attach observer if needed
    this._applyTheme()
    if (this.theme === 'auto') {
      try {
        const body = document.body
        const html = document.documentElement
        this._darkMo = new MutationObserver(() => this._applyTheme())
        if (body) this._darkMo.observe(body, { attributes: true, attributeFilter: ['class'] })
        if (html) this._darkMo.observe(html, { attributes: true, attributeFilter: ['class'] })
      } catch (e) {
        // ignore
      }
    }
    this._handleWindowResizeEvent = debounce(() => {
      this.positionDatepicker()
      this.setStartDates()
    }, 200)
    this._handleWindowClickEvent = event => {
      // toggle when the trigger element (or any of its children) is clicked
      if (!this.triggerElement) return
      const clickedTrigger =
        event.target === this.triggerElement || this.triggerElement.contains(event.target)
      if (clickedTrigger) {
        event.stopPropagation()
        event.preventDefault()
        this.toggleDatepicker()
      }
    }
    window.addEventListener('resize', this._handleWindowResizeEvent)

    this.triggerElement = this.isTest
      ? document.createElement('input')
      : document.getElementById(this.triggerElementId)

    this.setStartDates()
    this.generateMonths()
    this.generateYears()

    if (this.startOpen || this.inline) {
      this.openDatepicker()
    }

    const wrapperEl = this.$refs && this.$refs.wrapper
    if (wrapperEl) {
      wrapperEl.addEventListener('keyup', this.handleKeyboardInput)
      wrapperEl.addEventListener('keydown', this.trapKeyboardInput)
    }
    if (this.triggerElement) {
      this.triggerElement.addEventListener('keyup', this.handleTriggerInput)
      this.triggerElement.addEventListener('click', this._handleWindowClickEvent)
    }
  },
  unmounted() {
    window.removeEventListener('resize', this._handleWindowResizeEvent)
    if (this._darkMo) {
      try {
        this._darkMo.disconnect()
      } catch (e) {}
      this._darkMo = null
    }
    const wrapperEl = this.$refs && this.$refs.wrapper
    if (wrapperEl) {
      wrapperEl.removeEventListener('keyup', this.handleKeyboardInput)
      wrapperEl.removeEventListener('keydown', this.trapKeyboardInput)
    }
    if (this.triggerElement) {
      this.triggerElement.removeEventListener('keyup', this.handleTriggerInput)
      this.triggerElement.removeEventListener('click', this._handleWindowClickEvent)
    }
  },
  methods: {
    _detectQuasarDark() {
      try {
        const body = document.body
        const html = document.documentElement
        const hasDark = el => !!(el && el.classList && (el.classList.contains('q-dark') || el.classList.contains('body--dark')))
        return hasDark(body) || hasDark(html)
      } catch (e) {
        return false
      }
    },
    _applyTheme() {
      if (this.theme === 'dark') this.isDark = true
      else if (this.theme === 'light') this.isDark = false
      else this.isDark = this._detectQuasarDark()
    },
    getDayStyles(date) {
      // Keep width inline; colors and borders are now driven by CSS variables and state classes
      return {
        width: (this.width - 30) / 7 + 'px',
      }
    },
    getAriaLabelForDate(date) {
      const dateLabel = format(date, this.dateLabelFormat)

      const isDisabled = this.isDisabled(date)
      if (isDisabled) {
        return this.ariaLabels.unavailableDate(dateLabel)
      }

      const isSelected = this.isSelected(date)
      if (isSelected) {
        return this.ariaLabels.selectedDate(dateLabel)
      }

      if (this.isRangeMode) {
        if (this.isSelectingDate1) {
          return this.ariaLabels.chooseStartDate(dateLabel)
        } else {
          return this.ariaLabels.chooseEndDate(dateLabel)
        }
      } else {
        return this.ariaLabels.chooseDate(dateLabel)
      }
    },
    handleClickOutside(event) {
      // if click was inside the trigger element, ignore (so trigger toggles work)
      if (!this.showDatepicker || this.inline) return
      if (this.triggerElement && (event.target === this.triggerElement || this.triggerElement.contains(event.target))) return
      this.closeDatepicker()
    },
    shouldHandleInput(event, key) {
      return (
        event.keyCode === key && (!event.shiftKey || event.keyCode === 191) && this.showDatepicker
      )
    },
    handleTriggerInput(event) {
      if (this.mode === 'single') {
        this.setDateFromText(event.target.value)
      }
    },
    trapKeyboardInput(event) {
      // prevent keys that are used as keyboard shortcuts from propagating out of this element
      // except for the enter key, which is needed to activate buttons
      const shortcutKeyCodes = Object.keys(this.keys).map(key => this.keys[key])
      shortcutKeyCodes.splice(shortcutKeyCodes.indexOf(13), 1)
      const shouldPreventDefault = shortcutKeyCodes.indexOf(event.keyCode) > -1
      if (shouldPreventDefault) event.preventDefault()
    },
    handleKeyboardInput(event) {
      if (this.shouldHandleInput(event, this.keys.esc)) {
        if (this.showKeyboardShortcutsMenu) {
          this.closeKeyboardShortcutsMenu()
        } else {
          this.closeDatepicker()
        }
      } else if (this.showKeyboardShortcutsMenu) {
        // if keyboard shortcutsMenu is open, then esc is the only key we want to have fire events
      } else if (this.shouldHandleInput(event, this.keys.arrowDown)) {
        const newDate = addWeeks(this.focusedDate, 1)
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.nextMonth()
      } else if (this.shouldHandleInput(event, this.keys.arrowUp)) {
        const newDate = subWeeks(this.focusedDate, 1)
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.previousMonth()
      } else if (this.shouldHandleInput(event, this.keys.arrowRight)) {
        const newDate = addDays(this.focusedDate, 1)
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.nextMonth()
      } else if (this.shouldHandleInput(event, this.keys.arrowLeft)) {
        const newDate = subDays(this.focusedDate, 1)
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.previousMonth()
      } else if (this.shouldHandleInput(event, this.keys.enter)) {
        // on enter key, only select the date if a date is currently in focus
        const target = event.target
        if (!this.showKeyboardShortcutsMenu && target && target.tagName === 'TD') {
          this.selectDate(this.focusedDate)
        }
      } else if (this.shouldHandleInput(event, this.keys.pgUp)) {
        this.setFocusedDate(subMonths(this.focusedDate, 1))
        this.previousMonth()
      } else if (this.shouldHandleInput(event, this.keys.pgDn)) {
        this.setFocusedDate(addMonths(this.focusedDate, 1))
        this.nextMonth()
      } else if (this.shouldHandleInput(event, this.keys.home)) {
        const newDate = startOfWeek(this.focusedDate, {
          weekStartsOn: this.sundayFirst ? 0 : 1,
        })
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.previousMonth()
      } else if (this.shouldHandleInput(event, this.keys.end)) {
        const newDate = endOfWeek(this.focusedDate, {
          weekStartsOn: this.sundayFirst ? 0 : 1,
        })
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.nextMonth()
      } else if (this.shouldHandleInput(event, this.keys.questionMark)) {
        this.openKeyboardShortcutsMenu()
      }
    },
    setDateFromText(value) {
      if (!value || value.length < 10) {
        return
      }
      // make sure format is either 'YYYY-MM-DD' or 'DD.MM.YYYY'
      const isFormatYearFirst = value.match(
        /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/
      )
      const isFormatDayFirst = value.match(
        /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])[.](0[1-9]|1[0-2])[.](\d{4})$/
      )

      if (!isFormatYearFirst && !isFormatDayFirst) {
        return
      }
      if (isFormatDayFirst) {
        //convert to YYYY-MM-DD
        value = `${value.substring(6, 10)}-${value.substring(3, 5)}-${value.substring(0, 2)}`
      }

      const valueAsDateObject = new Date(value)
      if (!isValid(valueAsDateObject)) {
        return
      }
      const formattedDate = format(valueAsDateObject, this.dateFormat)
      if (
        this.isDateDisabled(formattedDate) ||
        this.isBeforeMinDate(formattedDate) ||
        this.isAfterEndDate(formattedDate)
      ) {
        return
      }
      this.startingDate = subMonths(formattedDate, 1)
      this.generateMonths()
      this.generateYears()
      this.selectDate(formattedDate)
    },
    isMonthDisabled(year, monthIndex) {
      const monthDate = new Date(year, monthIndex)
      if (this.hasMinDate && isBefore(monthDate, startOfMonth(this.minDate))) {
        return true
      }
      return this.isAfterEndDate(monthDate)
    },
    generateMonths() {
      this.months = []
      let currentMonth = this.startingDate
      for (let i = 0; i < this.showMonths + 2; i++) {
        this.months.push(this.getMonth(currentMonth))
        currentMonth = this.addMonths(currentMonth)
      }
    },
    generateYears() {
      if (!this.showMonthYearSelect) return
      this.years = []
      const currentYear = getYear(this.startingDate)
      const startYear = this.minDate ? getYear(this.minDate) : currentYear - this.yearsForSelect
      const endYear = this.endDate ? getYear(this.endDate) : currentYear + this.yearsForSelect
      for (var year = startYear; year <= endYear; year++) {
        this.years.push(year.toString())
      }
    },
    setupDatepicker() {
      if (this.$options.ariaLabels) {
        this.ariaLabels = copyObject(this.$options.ariaLabels)
      }
      if (this.$options.keyboardShortcuts) {
        this.keyboardShortcuts = copyObject(this.$options.keyboardShortcuts)
      }
      if (this.$options.dateLabelFormat) {
        this.dateLabelFormat = copyObject(this.$options.dateLabelFormat)
      }
      if (this.$options.sundayFirst) {
        this.sundayFirst = copyObject(this.$options.sundayFirst)
      }
      if (this.$options.colors) {
        const colors = copyObject(this.$options.colors)
        this.colors.selected = colors.selected || this.colors.selected
        this.colors.inRange = colors.inRange || this.colors.inRange
        this.colors.hoveredInRange = colors.hoveredInRange || this.colors.hoveredInRange
        this.colors.selectedText = colors.selectedText || this.colors.selectedText
        this.colors.text = colors.text || this.colors.text
        this.colors.inRangeBorder = colors.inRangeBorder || this.colors.inRangeBorder
        this.colors.disabled = colors.disabled || this.colors.disabled
      }
      if (this.$options.monthNames && this.$options.monthNames.length === 12) {
        this.monthNames = copyObject(this.$options.monthNames)
      }
      if (this.$options.days && this.$options.days.length === 7) {
        this.days = copyObject(this.$options.days)
      }
      if (this.$options.daysShort && this.$options.daysShort.length === 7) {
        this.daysShort = copyObject(this.$options.daysShort)
      }
      if (this.$options.texts) {
        const texts = copyObject(this.$options.texts)
        this.texts.apply = texts.apply || this.texts.apply
        this.texts.cancel = texts.cancel || this.texts.cancel
      }
    },
    setStartDates() {
      let startDate = this.dateOne || new Date()
      if (this.hasMinDate && isBefore(startDate, this.minDate)) {
        startDate = this.minDate
      }
      this.startingDate = this.subtractMonths(startDate)
      this.selectedDate1 = this.dateOne
      this.selectedDate2 = this.dateTwo
      this.focusedDate = startDate
    },
    setSundayToFirstDayInWeek() {
      const lastDay = this.days.pop()
      this.days.unshift(lastDay)
      const lastDayShort = this.daysShort.pop()
      this.daysShort.unshift(lastDayShort)
    },
    getMonth(date) {
      const firstDateOfMonth = format(date, 'YYYY-MM-01')
      const year = format(date, 'YYYY')
      const monthNumber = parseInt(format(date, 'M'))
      const monthName = this.monthNames[monthNumber - 1]

      return {
        year,
        firstDateOfMonth,
        monthName,
        monthNumber,
        weeks: this.getWeeks(firstDateOfMonth),
      }
    },
    getWeeks(date) {
      const weekDayNotInMonth = { dayNumber: 0 }
      const daysInMonth = getDaysInMonth(date)
      const year = format(date, 'YYYY')
      const month = format(date, 'MM')
      let firstDayInWeek = parseInt(format(date, this.sundayFirst ? 'd' : 'E'))
      if (this.sundayFirst) {
        firstDayInWeek++
      }
      let weeks = []
      let week = []

      // add empty days to get first day in correct position
      for (let s = 1; s < firstDayInWeek; s++) {
        week.push(weekDayNotInMonth)
      }
      for (let d = 0; d < daysInMonth; d++) {
        let isLastDayInMonth = d >= daysInMonth - 1
        let dayNumber = d + 1
        let dayNumberFull = dayNumber < 10 ? '0' + dayNumber : dayNumber
        week.push({
          dayNumber,
          dayNumberFull: dayNumberFull,
          fullDate: year + '-' + month + '-' + dayNumberFull,
        })

        if (week.length === 7) {
          weeks.push(week)
          week = []
        } else if (isLastDayInMonth) {
          for (let i = 0; i < 7 - week.length; i++) {
            week.push(weekDayNotInMonth)
          }
          weeks.push(week)
          week = []
        }
      }
      return weeks
    },
    selectDate(date) {
      if (this.isBeforeMinDate(date) || this.isAfterEndDate(date) || this.isDateDisabled(date)) {
        return
      }

      if (this.mode === 'single') {
        this.selectedDate1 = date
        this.closeDatepicker()
        return
      }

      // If a full range is already selected and the picker remains open
      // (e.g., action buttons are shown and closeAfterSelect is false),
      // treat the next click as starting a new range from the clicked date.
      if (this.allDatesSelected && this.showActionButtons && !this.closeAfterSelect) {
        this.selectedDate1 = date
        this.selectedDate2 = ''
        this.isSelectingDate1 = false
        return
      }

      // First click: selecting start
      if (this.isSelectingDate1) {
        this.selectedDate1 = date
        this.selectedDate2 = ''
        this.isSelectingDate1 = false
        return
      }

      // Second click: selecting end (supports backwards selection and same-day)
      const start = this.selectedDate1
      const endCandidate = date
      if (isBefore(endCandidate, start)) {
        // backwards: swap
        this.selectedDate1 = endCandidate
        this.selectedDate2 = start
      } else {
        // forward or same-day
        this.selectedDate2 = endCandidate
      }
      this.isSelectingDate1 = true

      if (this.showActionButtons) {
        const applyBtn = this.$refs && this.$refs['apply-button']
        if (applyBtn && typeof applyBtn.focus === 'function') applyBtn.focus()
      }
      if (this.allDatesSelected && this.closeAfterSelect) {
        this.closeDatepicker()
      }
    },
    setHoverDate(date) {
      this.hoverDate = date
    },
    setFocusedDate(date) {
      const formattedDate = format(date, this.dateFormat)
      this.focusedDate = formattedDate
      const dateElement = this.$refs[`date-${formattedDate}`]
      // handle .focus() on ie11 by adding a short timeout
      if (dateElement && dateElement.length) {
        setTimeout(function() {
          dateElement[0].focus()
        }, 10)
      }
    },
    resetFocusedDate(setToFirst) {
      if (this.focusedDate && !this.isDateVisible(this.focusedDate)) {
        const visibleMonthIdx = setToFirst ? 0 : this.visibleMonths.length - 1
        const targetMonth = this.visibleMonths[visibleMonthIdx]
        const monthIdx = getMonth(targetMonth)
        const year = getYear(targetMonth)
        const newFocusedDate = setYear(setMonth(this.focusedDate, monthIdx), year)
        this.focusedDate = format(newFocusedDate, this.dateFormat)
      }
    },
    isToday(date) {
      return format(new Date(), this.dateFormat) === date
    },
    isSameDate(date1, date2) {
      return isSameDay(date1, date2)
    },
    isSelected(date) {
      if (!date) {
        return
      }
      return this.selectedDate1 === date || this.selectedDate2 === date
    },
    isInRange(date) {
      if (!this.allDatesSelected || this.isSingleMode) {
        return false
      }

      return (
        (isAfter(date, this.selectedDate1) && isBefore(date, this.selectedDate2)) ||
        (isAfter(date, this.selectedDate1) &&
          isBefore(date, this.hoverDate) &&
          !this.allDatesSelected)
      )
    },
    isHoveredInRange(date) {
      if (this.isSingleMode || this.allDatesSelected) {
        return false
      }

      return (
        (isAfter(date, this.selectedDate1) && isBefore(date, this.hoverDate)) ||
        (isAfter(date, this.hoverDate) && isBefore(date, this.selectedDate1))
      )
    },
    isBeforeMinDate(date) {
      if (!this.minDate) {
        return false
      }
      return isBefore(date, this.minDate)
    },
    isAfterEndDate(date) {
      if (!this.endDate) {
        return false
      }
      return isAfter(date, this.endDate)
    },
    isDateVisible(date) {
      if (!date) {
        return false
      }
      const start = subDays(this.visibleMonths[0], 1)
      const end = addDays(lastDayOfMonth(this.visibleMonths[this.monthsToShow - 1]), 1)
      return isAfter(date, start) && isBefore(date, end)
    },
    isDateDisabled(date) {
      if (this.enabledDates.length > 0) {
        return this.enabledDates.indexOf(date) === -1
      } else {
        return this.disabledDates.indexOf(date) > -1
      }
    },
    customizedDateClass(date) {
      var customizedClasses = ''
      if (this.customizedDates.length > 0) {
        for (var i = 0; i < this.customizedDates.length; i++) {
          if (this.customizedDates[i].dates.indexOf(date) > -1)
            customizedClasses += ` asd__day--${this.customizedDates[i].cssClass}`
        }
      }
      return customizedClasses
    },
    isDisabled(date) {
      return this.isDateDisabled(date) || this.isBeforeMinDate(date) || this.isAfterEndDate(date)
    },
    previousMonth() {
      this.startingDate = this.subtractMonths(this.months[0].firstDateOfMonth)

      this.months.unshift(this.getMonth(this.startingDate))
      this.months.splice(this.months.length - 1, 1)
      this.$emit('previous-month', this.visibleMonths)
      this.resetFocusedDate(false)
    },
    nextMonth() {
      this.startingDate = this.addMonths(this.months[this.months.length - 1].firstDateOfMonth)
      this.months.push(this.getMonth(this.startingDate))
      this.months.splice(0, 1)
      this.$emit('next-month', this.visibleMonths)
      this.resetFocusedDate(true)
    },
    subtractMonths(date) {
      return format(subMonths(date, 1), this.dateFormat)
    },
    addMonths(date) {
      return format(addMonths(date, 1), this.dateFormat)
    },
    toggleDatepicker() {
      if (this.showDatepicker) {
        this.closeDatepicker()
      } else {
        this.openDatepicker()
      }
    },
    updateMonth(offset, year, event) {
      const newMonth = event.target.value
      const monthIdx = this.monthNames.indexOf(newMonth)
      const newDate = setYear(setMonth(this.startingDate, monthIdx), year)
      this.startingDate = subMonths(newDate, offset)
      this.generateMonths()
    },
    updateYear(offset, monthIdx, event) {
      const newYear = event.target.value
      const newDate = setYear(setMonth(this.startingDate, monthIdx), newYear)
      this.startingDate = subMonths(newDate, offset)
      this.generateMonths()
    },
    openDatepicker() {
      this.positionDatepicker()
      this.setStartDates()
      if (this.triggerElement && this.triggerElement.classList) {
        this.triggerElement.classList.add('datepicker-open')
      }
      this.showDatepicker = true
      this.initialDate1 = this.dateOne
      this.initialDate2 = this.dateTwo
      this.$emit('opened')
      this.$nextTick(() => {
        if (!this.inline) this.setFocusedDate(this.focusedDate)
      })
    },
    closeDatepickerCancel() {
      if (this.showDatepicker) {
        this.selectedDate1 = this.initialDate1
        this.selectedDate2 = this.initialDate2
        this.$emit('cancelled')
        this.closeDatepicker()
      }
    },
    closeDatepicker() {
      if (this.inline) {
        return
      }
      this.showDatepicker = false
      this.showKeyboardShortcutsMenu = false
      if (this.triggerElement && this.triggerElement.classList) {
        this.triggerElement.classList.remove('datepicker-open')
      }
      this.$emit('closed')
    },
    openKeyboardShortcutsMenu() {
      this.showKeyboardShortcutsMenu = true
      const shortcutMenuCloseBtn = this.$refs && this.$refs['keyboard-shortcus-menu-close']
      this.$nextTick(() => {
        if (shortcutMenuCloseBtn && typeof shortcutMenuCloseBtn.focus === 'function') {
          shortcutMenuCloseBtn.focus()
        }
      })
    },
    closeKeyboardShortcutsMenu() {
      this.showKeyboardShortcutsMenu = false
      this.$nextTick(() => this.setFocusedDate(this.focusedDate))
    },
    apply() {
      this.$emit('apply')
      this.closeDatepicker()
    },
    positionDatepicker() {
      if (!this.triggerElement) return
      const triggerWrapperElement = findAncestor(this.triggerElement, '.datepicker-trigger')
      this.triggerPosition = this.triggerElement.getBoundingClientRect()
      if (triggerWrapperElement) {
        this.triggerWrapperPosition = triggerWrapperElement.getBoundingClientRect()
      } else {
        this.triggerWrapperPosition = { left: 0, right: 0 }
      }

      const viewportWidth = document.documentElement.clientWidth || window.innerWidth
      this.viewportWidth = viewportWidth + 'px'
      this.isMobile = viewportWidth < 768
      this.isTablet = viewportWidth >= 768 && viewportWidth <= 1024
      this.showMonths = this.isMobile
        ? 1
        : this.isTablet && this.monthsToShow > 2
        ? 2
        : this.monthsToShow

      this.$nextTick(() => {
        const datepickerWrapper = document.getElementById(this.wrapperId)
        if (!this.triggerElement || !datepickerWrapper) {
          return
        }

        const rightPosition =
          this.triggerElement.getBoundingClientRect().left +
          datepickerWrapper.getBoundingClientRect().width
        this.alignRight = rightPosition > viewportWidth
      })
    },
  },
}
</script>

<style lang="scss">
@use 'sass:math';
@use './../styles/transitions' as transitions;

$transition-time: 0.3s;

/* CSS variables: default (light) theme, scoped to the component */
.asd__wrapper {
  --asd-bg: #ffffff;
  --asd-text: #565a5c;
  --asd-selected: #00a699;
  --asd-selected-text: #ffffff;
  --asd-in-range: #66e2da;
  --asd-in-range-border: #33dacd;
  --asd-hovered-in-range: #67f6ee;
  --asd-disabled: #ffffff;
  --asd-border-color: rgba(0, 0, 0, 0.2);
  --asd-day-hover-bg: #e4e7e7;
  --asd-day-border: #e4e7e7;
}
/* Manual dark theme override (opt-in) */
.asd__wrapper[data-theme='dark'] {
  --asd-bg: #1f1f1f;
  --asd-text: #e7e7e7;
  --asd-selected: #1db9aa;
  --asd-selected-text: #0b0b0b;
  --asd-in-range: #155e67;
  --asd-in-range-border: #2db9c8;
  --asd-hovered-in-range: #197f8b;
  --asd-disabled: #2a2a2a;
  --asd-border-color: rgba(255, 255, 255, 0.2);
  --asd-day-hover-bg: #2d2d2d;
  --asd-day-border: #3a3a3a;
}

$tablet: 768px;
$border-normal: 1px solid var(--asd-border-color);
$border: 1px solid var(--asd-day-border);

.datepicker-trigger {
  position: relative;
  overflow: visible;
}

.asd {
  &__wrapper {
    border: $border-normal;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
    background-color: var(--asd-bg);
    color: var(--asd-text);

    *,
    *:after,
    *:before {
      box-sizing: border-box;
    }

    &--full-screen {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: none;
      z-index: 100;
    }
  }
  &__inner-wrapper {
    transition: all $transition-time ease;
    position: relative;
  }
  &__datepicker-header {
    position: relative;
  }
  &__keyboard-shortcuts-trigger-wrapper {
    position: relative;
  }
  &__keyboard-shortcuts-trigger {
    background-color: transparent;
    cursor: pointer;
    position: absolute;
    bottom: 0px;
    right: 0px;
    font: inherit;
    border-width: 26px 33px 0px 0px;
    border-top: 26px solid transparent;
    border-right: 33px solid rgb(0, 166, 153);

    span {
      color: rgb(255, 255, 255);
      position: absolute;
      bottom: 0px;
      right: -28px;
    }
  }
  &__keyboard-shortcuts-show {
    display: block !important;
  }
  &__keyboard-shortcuts-close {
    background-color: transparent;
    border: none;
    position: absolute;
    top: 7px;
    right: 5px;
    padding: 5px;
    z-index: 100;
    cursor: pointer;
  }
  &__keyboard-shortcuts-menu {
    display: none;
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    z-index: 10;
    overflow: auto;
    background: rgb(255, 255, 255);
    border-width: 1px;
    border-style: solid;
    border-color: rgb(219, 219, 219);
    border-image: initial;
    border-radius: 2px;
    padding: 22px;
    margin: 33px;
    text-align: left;
  }
  &__keyboard-shortcuts-title {
    font-size: 16px;
    font-weight: bold;
    margin: 0px;
  }
  &__keyboard-shortcuts-list {
    list-style: none;
    margin: 6px 0px;
    padding: 0px;
    white-space: initial;
  }
  &__keyboard-shortcuts-symbol {
    font-family: monospace;
    font-size: 12px;
    text-transform: uppercase;
    background: rgb(242, 242, 242);
    padding: 2px 6px;
    margin-right: 4px;
  }
  &__change-month-button {
    position: absolute;
    top: 12px;
    z-index: 10;
    background: var(--asd-bg);

    &--previous {
      left: 0;
      padding-left: 15px;
    }
    &--next {
      right: 0;
      padding-right: 15px;
    }

    > button {
      background-color: var(--asd-bg);
      border: $border;
      border-radius: 3px;
      padding: 4px 8px;
      cursor: pointer;

      &:hover {
        border: 1px solid #c4c4c4;
      }

      > svg {
        height: 19px;
        width: 19px;
        fill: var(--asd-text);
        opacity: 0.8;
      }
    }
  }

  &__days-legend {
    position: absolute;
    top: 50px;
    left: 10px;
    padding: 0 10px;
  }
  &__day-title {
    display: inline-block;
    width: math.percentage(math.div(1, 7));
    text-align: center;
    margin-bottom: 4px;
    color: var(--asd-text);
    opacity: 0.7;
    font-size: 0.8em;
    margin-left: -1px;
  }

  &__month-table {
    border-collapse: collapse;
    border-spacing: 0;
    background: var(--asd-bg);
    width: 100%;
    max-width: 100%;
  }

  &__month {
    transition: all $transition-time ease;
    display: inline-block;
    padding: 15px;

    &--hidden {
      height: 275px;
      visibility: hidden;
    }
  }
  &__month-name {
    font-size: 1.3em;
    text-align: center;
    margin: 0 0 30px;
    line-height: 1.4em;
    font-weight: bold;
    color: var(--asd-text);
  }
  &__month-year-select {
    &::-ms-expand {
      display: none;
    }
    -webkit-appearance: none;
    border: none;
    background-color: inherit;
    cursor: pointer;
    color: blue;
    font-size: inherit;
    font-weight: inherit;
    padding: 0;
  }

  &__day {
    $size: 38px;
    line-height: $size;
    height: $size;
    padding: 0;
    overflow: hidden;
    color: var(--asd-text);
    &--enabled {
      border: $border;
      &:hover {
        background-color: var(--asd-day-hover-bg);
      }
      &:focus {
        outline: auto 5px Highlight;
        outline: auto 5px -webkit-focus-ring-color;
      }
    }
    &--disabled,
    &--empty {
      opacity: 0.5;

      button {
        cursor: default;
      }
    }
    &--empty {
      border: none;
    }
    &--disabled {
      &:hover {
        background-color: transparent;
      }
    }
    &--selected {
      background: var(--asd-selected) !important;
      color: var(--asd-selected-text) !important;
      border: 1px double var(--asd-selected) !important;
    }
    &--in-range {
      background: var(--asd-in-range) !important;
      color: var(--asd-selected-text) !important;
      border: 1px double var(--asd-in-range-border) !important;
    }
    &--hovered {
      background: var(--asd-hovered-in-range) !important;
      color: var(--asd-selected-text) !important;
      border: 1px double var(--asd-in-range-border) !important;
    }
  }
  &__day-button {
    background: transparent;
    width: 100%;
    height: 100%;
    border: none;
    cursor: pointer;
    color: inherit;
    text-align: center;
    user-select: none;
    font-size: 15px;
    font-weight: inherit;
    padding: 0;
  }

  &__action-buttons {
    min-height: 50px;
    padding-top: 10px;
    margin-bottom: 12px;
    button {
      color: var(--asd-text);
      display: block;
      position: relative;
      background: transparent;
      border: none;
      font-weight: bold;
      font-size: 15px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
      &:nth-child(1) {
        float: left;
        left: 15px;
      }
      &:nth-child(2) {
        float: right;
        right: 15px;
      }
    }
  }

  &__mobile-header {
    border-bottom: $border-normal;
    position: relative;
    padding: 15px 15px 15px 15px !important;
    text-align: center;
    height: 50px;
    h3 {
      font-size: 20px;
      margin: 0;
    }
  }
  &__mobile-only {
    display: none;
    @media (max-width: 600px) {
      display: block;
    }
  }
  &__mobile-close {
    border: none;
    position: absolute;
    top: 7px;
    right: 5px;
    padding: 5px;
    z-index: 100;
    cursor: pointer;

    &__icon {
      position: relative;
      font-size: 1.6em;
      font-weight: bold;
      padding: 0;
    }
  }
}
</style>
