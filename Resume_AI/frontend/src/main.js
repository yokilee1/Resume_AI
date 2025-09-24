import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.scss'

// Create app instance
const app = createApp(App)

// Use plugins
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

// Mount app
app.mount('#app')