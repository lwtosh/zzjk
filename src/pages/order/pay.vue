<template>
  <div>
    <div class="cont">
      <img src="~@/assets/pays.png" alt="">
      <p>你已付款成功！</p>
      <div class="btn">
        <van-button @click="chack" plain size="small" style="margin-left:.2rem">查看订单</van-button>
        <van-button @click="back" plain  size="small" style="margin-left:.2rem">返回首页</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import sdk from './../sdk'
export default {
  created () {
    var url = location.href
    var url1 = 'http://h5.zzjk99.com/zzShop/index.html#/?inviteCode='
    var url2 = Vue.cookie.get('inviteCode')
    var obj = {
      title: '至真健康', // 分享标题
      desc: '人人精气神，必备久宗丹',
      linkUrl: url1 + url2,
      img: 'http://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    }
    sdk.getJSSDK(url, obj)
  },
  methods: {
    chack () {
      this.$router.replace('/order')
    },
    back () {
      this.$router.replace('/')
    }
  }
}
</script>
<style lang="less" scoped>
.cont{
  margin: 3.8rem auto 0;
  text-align: center;
  padding: 0 .5rem;
  img{
    width: 23%;
  }
  p{
    margin-top: .3rem;
    font-size: .34rem;
    color: #999999;
  }
  .btn{
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    .van-button--small{
      width: 3.5rem;
      height: 1.1rem;
      line-height: 1.1rem;
      border-radius: 40px;
      border:1px solid #BFBFBF;
      color: #999
    }
  }
}
</style>
