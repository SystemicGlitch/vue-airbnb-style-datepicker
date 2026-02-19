
import { createApp } from 'vue'
import App from './App.vue'
import AirBnbStyleDatepicker from './../src/index'

const app = createApp(App)
app.use(AirBnbStyleDatepicker, {
  sundayFirst: false,
  days: ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'],
  daysShort: ['Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör', 'Sön'],
  monthNames: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  colors: {
    selected: '#00a699',
    inRange: '#66e2da',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#33dacd',
    disabled: '#fff',
  },
  texts: {
    apply: 'Tillämpa',
    cancel: 'Avbryt',
  },
})
app.mount('#app')
