// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vant from 'vant'
import 'vant/lib/index.css'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import httpRequest from '@/utils/httpRequest'
import VueClipboard from 'vue-clipboard2'

import 'lib-flexible'
import VueCookie from 'vue-cookie'
import VideoPlayer from 'vue-video-player'
// import {clearLoginInfo} from '@/utils/httpRequest'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.use(VideoPlayer)
Vue.use(VueCookie)
Vue.config.productionTip = false
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.use(ElementUI)
Vue.use(Vant)
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
