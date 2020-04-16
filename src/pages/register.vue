<template>
    <div class="app">
      <div class="img_div" style="height:rem;margin:0 ;padding: 1.2rem 0 .6rem .6rem;border-radius:0px" v-if='cancel !== "1"'>
           <p class="bind">绑定手机号</p>
           <p class="text">为了你的账户安全，社交账户必须绑定手机号</p>
        </div>
         <div class="img_div" style="height:rem;margin:0 ;padding: 2.3rem 0px 1.5rem 0rem;border-radius:0px" v-else>
           <img src="../assets/logo.png" alt="" style="width:25%;border-radius:0px;margin-left: 0px;margin:">
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="box">
             <el-form-item prop="mobile" class="p2" style="margin:auto;margin-bottom:16px;width:90%;"><img class="mt4" :src="require('@/assets/phone.png')">
                <el-input
                    class="pl40"
                    placeholder="请输入手机号码"
                    :maxlength="11"
                    v-model="ruleForm.mobile">
                </el-input>
            </el-form-item>
            <el-form-item prop="verifycode" style="margin:auto;margin-bottom:16px;width:90%;">
              <img class="mt4" :src="require('@/assets/yan.png')">
                <el-input
                    class="pl40 verifycode"
                    placeholder="请输入验证码"
                    v-model="ruleForm.verifycode">
                <el-button class="bb" slot="suffix" @click="getVerifycode">{{ verifyCodeNotes }}</el-button>
                </el-input>
            </el-form-item>

            <el-form-item prop="inviteCode" style="margin:auto;width:90%;" v-if='isCancel === true'>
                <img class="mt4" :src="require('@/assets/yaoqingma.png')">
                <el-input
                    class="pl40"
                    placeholder="推荐码(必填)"
                    v-model="ruleForm.inviteCode">
                </el-input>
            </el-form-item>
             <el-form-item prop="inviteCode" style="margin:auto;width:90%;" v-if='isCancel === false'>
                <img class="mt4" :src="require('@/assets/yaoqingma.png')">
                <el-input
                    class="pl40"
                    placeholder="推荐码(必填)"
                    v-model="ruleForm.inviteCode" readonly="readonly" >
                </el-input>{{ruleForm.inviteCode}}
            </el-form-item>
          </div>
            <el-form-item class="p10">
              <el-row>
                <el-button @click="submitForm" class="clear">登录</el-button>
              </el-row>
            </el-form-item>
            <el-form-item class="lt" style="margin:auto;width:80%;">
                <el-checkbox class="Iagree" v-model="checked"></el-checkbox><span class="gray">我已阅读并同意</span><span class="red" @click="dialogShow" >《用户协议和隐私政策》</span>
                <el-row class="text-center">
                    <!-- <router-link to="/download" class="login">APP下载链接</router-link> -->
               </el-row>
            </el-form-item>
        </el-form>
        <Dialog v-if="visible" ref="dialog" :dialogHidden='dialogHidden'></Dialog>
    </div>
</template>
<script>
import Vue from 'vue'
import Dialog from './dialog.vue'
import {
  validPhone,
  validVerifycode } from './validate.js'

export default {
  data () {
    return {
      visible: false,
      checked: true,
      hh: true,
      cancel: '',
      ruleForm: {
        mobile: null,
        inviteCode: '',
        loginChannel: '',
        wxLoginId: '',
        verifycode: null
      },
      rules: {
        mobile: [
          { required: true, validator: validPhone, trigger: 'blur' }
        ],
        verifycode: [
          { required: true, validator: validVerifycode, trigger: 'blur' }
        ]
      },
      phoneOK: false, // 当用户输入手机号才能点击获取验证码
      verifyCodeNotes: '获取验证码',
      isCancel: '',
      flag: true
    }
  },
  components: {
    Dialog
  },
  created () {
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.includes('micromessenger')) {
      this.$cookie.set('platform', 'WXWEB')
      this.ruleForm.loginChannel = 'WXWEB'
      if (Vue.cookie.get('wxLoginId')) {
        this.ruleForm.wxLoginId = Vue.cookie.get('wxLoginId')
      }
    } else {
      this.$cookie.set('platform', 'WEB')
      this.ruleForm.loginChannel = 'WEB'
    }
    if (this.$route.query.inviteCode && this.$route.query.inviteCode !== null && this.$route.query.inviteCode !== 'null') {
      this.ruleForm.inviteCode = this.$route.query.inviteCode
    }
    if (Vue.cookie.get('cancel')) {
      this.cancel = Vue.cookie.get('cancel')
      if (this.cancel === '1') {
        document.title = '登录'
      }
    }
  },
  watch: {
    'ruleForm.mobile': {
      handler (newValue, oldValue) {
        const reg = /^[1]([1-9])[0-9]{9}$/
        if (reg.test(newValue)) {
          this.phoneOK = true
          this.$http({
            url: this.$http.adornUrl('/h5/login/fetchMobileIsBind'),
            method: 'get',
            params: {mobile: newValue}
          }).then(({data}) => {
            if (data && data.code === 'ok') {
              if (data.data.bindInviteCode === false) {
                this.isCancel = true
              }
            } else {
              this.$toast(data.message)
            }
          })
        } else {
          this.isCancel = ''
          this.phoneOK = false
        }
      },
      deep: true
    }
  },
  mounted () {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.fun, false)// false阻止默认事件
    }
  },
  methods: {
    fun () {
      if (this.hh) {
        this.$router.replace('/')
      } else {
        this.$router.go('-1')
      }
    },
    dialogHidden () {
      this.visible = false
    },
    dialogShow () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dialog.init()
      })
    },
    submitForm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid && this.checked) {
          this.$http({
            url: this.$http.adornUrl('/h5/login/loginByMobile'),
            method: 'post',
            params: this.ruleForm
          }).then(({data}) => {
            if (data && data.code === 'ok') {
              this.hh = false
              this.$cookie.set('token ', data.data.token)
              this.$cookie.set('userId ', data.data.userId)
              if (this.$route.query.fromUrl && this.$route.query.fromUrl !== '' && this.$route.query.fromUrl.indexOf('/register') < 0 && this.$route.query.fromUrl.indexOf('h5.zzjk99.com/zzShop') > 0) {
                var url = decodeURIComponent(this.$route.query.fromUrl).split('#')[1]
                this.$router.replace(url)
              } else {
                this.$router.replace('/')
              }
              if (this.cancel === '1') { Vue.cookie.delete('cancel') }
            } else if (data.code === 'U47') {
              window.location.href = '//api.zzjk99.com/to/toAuth?type=redirect&fromUrl=' + encodeURIComponent(location.href) + '&inviteCode=' + this.$route.query.inviteCode
            } else {
              this.$toast(data.message)
            }
          })
        }
      })
    },
    getVerifycode () {
      if (this.phoneOK && this.flag) {
        this.flag = false
        this.$http({
          url: this.$http.adornUrl('/h5/login/sendVerifyCode'),
          method: 'post',
          params: {
            mobile: this.ruleForm.mobile
          }
        }).then(({data}) => {
          // this.$toast('发送成功')
          if (data.code === 'ok') {
            let num = 60
            this.verifyCodeNotes = num + '秒后重新获取验证码'
            let timer = setInterval(() => {
              num--
              this.verifyCodeNotes = num + '秒后重新获取验证码'
              if (num <= 0) {
                clearInterval(timer)
                this.verifyCodeNotes = '重新获取验证码'
                this.flag = true
              }
            }, 1000)
          } else {
            this.$toast(data.message)
            this.verifyCodeNotes = '重新获取验证码'
            this.flag = true
          }
        }).catch(() => {
          this.$toast('错误')
          this.verifyCodeNotes = '重新获取验证码'
          this.flag = true
        })
      }
    }
  },
  destroyed () {
    window.removeEventListener('popstate', this.fun, false)// false阻止默认事件
  }
}
</script>

<style scoped>
  @import './style.css'
</style>
