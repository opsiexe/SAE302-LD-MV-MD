import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faChevronUp, faLocationArrow, faCompass, faTemperatureHalf, faCircleDown, faCircleUp, faDroplet, faSun, faCloud, faCloudSun, faCloudRain, faBolt, faSmog, faSpinner, faSnowflake, faClock, faMoon, faCloudMoon } from '@fortawesome/free-solid-svg-icons'

library.add(faMagnifyingGlass, faLocationArrow, faChevronUp, faCompass, faTemperatureHalf, faCircleDown, faCircleUp, faDroplet, faSun, faCloud, faCloudSun, faCloudRain, faBolt, faSmog, faSpinner, faSnowflake, faClock, faMoon, faCloudMoon)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
