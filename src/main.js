import Vue from 'vue'
import Vuetify from 'vuetify'
import router from './router'
import VueResource from 'vue-resource'
import App from './App.vue'
import 'vuetify/dist/vuetify.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueResource)
Vue.use(Vuetify)
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
