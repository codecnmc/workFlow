/*
 * @Author: 羊驼
 * @Date: 2023-04-25 09:10:13
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-25 14:40:06
 * @Description: file content
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "@/utils/config.js"

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')


