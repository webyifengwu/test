import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
  //将scss导入 全局导入了 scss: base , icon , reset 
import './assets/scss/index.scss'
import directPlugin from './plugins'
const app = createApp(App)

app.use(store).use(router).use(directPlugin).mount('#app')
