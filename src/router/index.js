import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'
import info from '@/pages/info'
import loginpro from '@/pages/loginpro'
import my from '@/pages/my'
import wages from '@/pages/my/wages'
import integral from '@/pages/my/integral'
import commission from '@/pages/my/commission'
import opinion from '@/pages/my/opinion'
import editInfo from '@/pages/my/editInfo'
import realName from '@/pages/my/realName'
import performanceNew from '@/pages/my/performanceNew'
import marketPerformanceTwo from '@/pages/my/marketPerformanceTwo'
import performance from '@/pages/my/performance'
import marketPerformanceOne from '@/pages/my/marketPerformanceOne'
import partner from '@/pages/my/partner'
import basicSalaryPerformance from '@/pages/my/basicSalaryPerformance'
import withdrawalsApply from '@/pages/my/withdrawalsApply'
import bankCard from '@/pages/my/bankCard'
import address from '@/pages/my/address'
import code from '@/pages/my/code'
import addressManage from '@/pages/my/addressManage'
import addOrEdit from '@/pages/my/addOrEdit'
import about from '@/pages/my/about'
import login from '@/pages/login'
import register from '@/pages/register'
import order from '@/pages/order'
import pay from '@/pages/order/pay'
import payMent from '@/pages/order/payMent'
import shopDetails from '@/pages/shop/shopDetails'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: home, meta: { title: '至真健康' }},
    {path: '/info', component: info, meta: { title: '消息通知' }},
    {path: '/login', component: login, meta: { title: '登录' }},
    {path: '/register', component: register, meta: { title: '绑定手机号' }},
    {path: '/order', component: order, meta: { title: '全部订单' }},
    {path: '/payMent', component: payMent, meta: { title: '确认订单' }},
    {path: '/pay', component: pay, meta: { title: '支付成功' }},
    {path: '/my', component: my, meta: { title: '个人中心' }},
    {path: '/wages', component: wages, meta: { title: '我的工资' }},
    {path: '/commission', component: commission, meta: { title: '我的佣金' }},
    {path: '/integral', component: integral, meta: { title: '我的积分' }},
    {path: '/opinion', component: opinion, meta: { title: '意见反馈' }},
    {path: '/realName', component: realName, meta: { title: '实名认证' }},
    {path: '/performanceNew', component: performanceNew, meta: { title: '本月新增业绩' }},
    {path: '/marketPerformanceTwo', component: marketPerformanceTwo, meta: { title: '市场二部总业绩' }},
    {path: '/performance', component: performance, meta: { title: '总业绩' }},
    {path: '/marketPerformanceOne', component: marketPerformanceOne, meta: { title: '市场一部总业绩' }},
    {path: '/partner', component: partner, meta: { title: '我的伙伴' }},
    {path: '/basicSalaryPerformance', component: basicSalaryPerformance, meta: { title: '本月责任底薪业绩' }},
    {path: '/editInfo', component: editInfo, meta: { title: '编辑个人资料' }},
    {path: '/withdrawalsApply', component: withdrawalsApply, meta: { title: '提现申请' }},
    {path: '/bankCard', component: bankCard, meta: {title: '选择银行卡'}},
    {path: '/address', component: address, meta: { title: '收货地址' }},
    {path: '/addressManage', component: addressManage, meta: { title: '收货地址' }},
    {path: '/shopDetails', component: shopDetails, meta: { title: '商品详情' }},
    {path: '/code', component: code, meta: { title: '我的邀请码' }},
    {path: '/about', component: about, meta: { title: '至真健康' }},
    {path: '/addOrEdit', component: addOrEdit, meta: { title: '新增地址' }},
    {path: '/loginpro', component: loginpro, meta: { title: '正在登录' }}
  ]
})
