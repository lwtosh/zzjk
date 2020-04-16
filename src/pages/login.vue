<template>
  <div class="app">
    <div class="nav">
      <img  class="logo" src="~@/assets/logo.png" alt="">
       <!-- <div class="tl">请选择登录方式</div> -->
       <!-- <a class="weixin"  href="http://ppl-api-test.ppljg66.com/agent/login/toWx">微信登录</a > -->
       <a class="weixin" href="#"><img class="weixin-icon" src="~@/assets/weixin.png" alt=""> 微信登录</a>
       <div class="tel" @click="btn2"><img class="phone" src="~@/assets/iphone.png" alt=""> 手机号登录</div>
       <div class="agerr">注册登录即同意<span>《用户与隐私协议》</span> </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      url: ''
    }
  },
  methods: {
    btn2 () { this.$router.replace({ name: 'login' }) }
  }
}
</script>
<style scoped>
.app,body,html{
  width: 100%;
  height: 100vh;
  background: #fff;
}
 .nav{
   margin: auto;
   text-align: center;
   color: #fff;
   font-size: .42rem;
 }
.tl{
  font-size: 48px;
  color: #fff;
}
.weixin{
  width:80%;
  line-height: 1.3rem;
   height:1.58rem;
  margin: auto;
  background:url(~@/assets/btn2.png);
  background-size: 100% 100%;
  border-radius:10px;
  margin-bottom: 10px;
  display: block;
  color: #fff;
  text-decoration: none;
}
.tel{
 width:80%;
 height:1.58rem;
line-height:1.3rem;
margin: auto;
background:url(~@/assets/btn1.png);
background-size: 100% 100%;
border-radius:10px;
}
.agerr{
  font-size: .34rem;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: #404040;
}
span{
  color: #38CBCE;
  text-decoration:underline
  }
  .phone{
height: .5rem;
width: .37rem;
vertical-align:-4px;
  }
  .weixin-icon{
    width: 0.57rem;
    height: 0.46rem;
  }
.logo{
  width:2.66rem;
  height: 3.7rem;
  margin: 90px auto 4.8rem;
}
</style>
