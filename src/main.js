import Vue from 'vue'
import Vuetify from 'vuetify'
import router from './router'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import App from './App.vue'
import store from './store'
import 'vuetify/dist/vuetify.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueResource)
Vue.use(Vuetify)
Vue.use(Vuex)
new Vue({
  el: '#app',
  router,
  store: new Vuex.Store(store),
  render: h => h(App)
})
