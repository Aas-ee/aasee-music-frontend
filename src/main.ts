import { createApp } from 'vue'
import './assets/base.scss'
import './assets/theme.scss'
import App from './App.vue'
import router from './router'
const app= createApp(App)
app.use(router)
app.mount('#app')
