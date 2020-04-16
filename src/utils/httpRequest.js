import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import merge from 'lodash/merge'
// import store from '@/store'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: false,
  headers: {
    // 'Content-Type': 'application/json; charset=utf-8'
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  }
})
/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  Vue.cookie.delete('userId')
  // store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}
/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') == null ? 0 : Vue.cookie.get('token') // 请求头带上token
  config.headers['uid'] = Vue.cookie.get('userId') == null ? 0 : Vue.cookie.get('userId')// 请求头带上uid
  config.headers['loginChannel'] = Vue.cookie.get('platform')
  return config
}, error => {
  return Promise.reject(error)
})
/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && (response.data.code === 'B19' || response.data.code === 'UNDEFINED')) {
    if (location.href.split('#')[1] === '/order' || location.href.split('#')[1] === '/my' || location.href.split('#')[1] === '/' || location.href.split('#')[1] === '/info') {
    } else if (location.href.indexOf('my') !== -1 || location.href.indexOf('order') !== -1 || location.href.indexOf('info') !== -1) {
    } else {
      clearLoginInfo()
      if (Vue.cookie.get('platform') === 'WXWEB') {
        window.location.replace('//api.zzjk99.com/to/toAuth?type=redirect&fromUrl=' + encodeURIComponent(location.href) + '&inviteCode=' + Vue.cookie.get('inviteCode'))
      } else {
        router.replace('/register?fromUrl=' + encodeURIComponent(location.href) + '&inviteCode=' + Vue.cookie.get('inviteCode'))
      }
    }
  }
  return response
}, error => {
  return Promise.reject(error)
})
/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, contentType = 'form', openDefultdata = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
