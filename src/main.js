import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';
import '@/components/DynamicForm/styles/index.styl'
import '@/components/DynamicForm/icons'

import FormControls from './components/FormControls/index.js'
Vue.use( FormControls )
Vue.use( ElementUI );

Vue.config.productionTip = false
Vue.prototype.log = console.log

new Vue( {
  router,
  store,
  render: h => h( App )
} ).$mount( '#app' )

