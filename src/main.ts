import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import { createPinia } from 'pinia'
import { router } from './router'
import '@arco-design/web-vue/dist/arco.css'
import './style.css'
import App from './App.vue'

createApp(App).use(createPinia()).use(router).use(ArcoVue).mount('#app')
