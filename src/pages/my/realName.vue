<template>
  <div class="app">
    <div class="cont">
      <h2 class="h2">实名认证</h2>
        <div class="name">真实姓名</div>
        <van-field v-model="name" placeholder="请填写本人的真实姓名" :readonly='disabled' style="padding: 10px 6px;margin-bottom:.5rem"/>
         <div class="name">身份证号</div>
         <van-field v-model="idcard" placeholder="请输入身份证号" :readonly='disabled' maxlength='22' type='text' style="padding: 10px 0px;margin-bottom:.5rem"/>
        <p class="info">注意:以上信息请谨慎填写，若有假冒或虚假信息填写，将会影响你的提现等相关权益,若身份证号码含有字母，请使用小写。</p>
    </div>
    <div class="btn" @click="onSave" v-if='!disabled'>提交认证</div>
  </div>
</template>
<script>
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      name: '',
      idcard: '',
      disabled: false
    }
  },
  created () {
    this.$http({
      url: this.$http.adornUrl('/h5/user/fetchUserCertInfo'),
      method: 'get'
    }).then(({data}) => {
      if (data.code === 'ok') {
        this.name = data.data.name
        this.idcard = data.data.idcard
        this.disabled = true
      }
    })
    var url = location.href
    var obj = {
      title: '至真健康', // 分享标题
      desc: '人人精气神，必备久宗丹',
      linkUrl: location.href + '&inviteCode=' + Vue.cookie.get('inviteCode'),
      img: 'https://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    }
    sdk.getJSSDK(url, obj)
  },
  methods: {
    onSave () {
      var regName = /^[\u4e00-\u9fa5]{2,30}$/
      var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (!regName.test(this.name)) {
        this.$toast('请输入正确姓名')
      } else if (!regIdNo.test(this.idcard)) {
        this.$toast('请输入正确的身份证号码')
      } else {
        this.$http({
          url: this.$http.adornUrl('/h5/other/fetchSysConfig'),
          method: 'get',
          params: {
          }
        }).then(({data}) => {
          if (data.code === 'ok') {
            if (data.data.certFee > 0) {
              this.$http({
                url: this.$http.adornUrl('/h5/pay/fetchPayConfigs'),
                method: 'get',
                params: {
                  payType: 'REAL_NAME_VERITY'
                }
              }).then(({data}) => {
                if (data.code === 'ok') {
                  this.$http({
                    url: this.$http.adornUrl('/h5/user/saveUserCert'),
                    method: 'post',
                    params: {
                      name: this.name, idcard: this.idcard, payMethod: data.data.payMethod
                    }
                  }).then(({data}) => {
                    if (data.code === 'ok') {
                      this.$toast('认证成功')
                      this.$router.go(-1)
                    }
                  })
                }
              })
            } else {
              this.$http({
                url: this.$http.adornUrl('/h5/user/saveUserCert'),
                method: 'post',
                params: {
                  name: this.name, idcard: this.idcard, payMethod: ''
                }
              }).then(({data}) => {
                if (data.code === 'ok') {
                  this.$toast('认证成功')
                  this.$router.go(-1)
                }
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell:not(:last-child)::after{
  left:0px;
}
.app{
  width: 100%;
  height: 100vh;
  background: #fff;
}
.cont{
  padding: 0 .3rem ;
  .name{
    font-size: .36rem;
  }
}
.h2{
  font-size: .56rem;
  padding: .7rem 0 .6rem 0
}
.info{
  font-size: .32rem;
  line-height: 1.5
}
.btn{
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 1.2rem;
  line-height: 1.2rem;
  color: #fff;
  background:#38CBCE;
  font-size: .4rem;
  text-align: center;
}
</style>
