import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
// import 'bootstrap/dist/css/bootstrap.css'
import './assets/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/global.scss'

import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBWHQ59vmmjxOlAegYTWr0ndFIu4zyeFnE',
    libraries: 'places'
  }
})

import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)
import App from './App.vue'
import store from './store'
import router from './routes'

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.getters.userLoggedIn) {
      next()
    } else {
      next({name: 'CustomerLogin'})
    }
  }
  next()
})

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
