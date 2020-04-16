<template>
  <div class="app">
    <div class="codeText">
      <img src="~@/assets/codeText.png" alt="">
    </div>
    <div class="code">
      <div class="code-box" v-if='dataInfo'>
        <img class="er" :src="dataInfo.qrcode" alt="">
        <p>我的邀请码：<span style="font-size:.38rem;font-weight:bold;">{{dataInfo.inviteCode}}</span></p>
        <div class="like" @click="onClickShare">立即邀请好友 <img class="icon" src="../../assets/arr2.png" alt=""></div>
      </div>
       <div class="code-box" v-else>
        <img class="er1" src="~@/assets/code1.png" alt="">
        <div class="dec">
          <div class="p1">抱歉，您尚无邀请资格</div>
          <div class="p2">购买任意商品即可获得邀请资格</div>
        </div>
        <div class="like" @click="onClickShare1">立即获取资格 <img class="icon" src="../../assets/arr2.png" alt=""></div>
        <!-- <img class="yao" src="../../assets/getCode.png" alt=""  @click="onClickShare1"> -->
      </div>
    </div>
    <van-popup v-model="show" round position="bottom" :style="{ height: '3.6rem' }">
   <p class="dao">分享到</p>
   <div class="wrap">
    <div class="items" @click="onClickWhart">
      <img :src="require('@/assets/wei.png')" alt="">
      <p class="items-text">微信好友</p>
    </div>
    <div class="items" @click="onClickWhart">
      <img :src="require('@/assets/wei1.png')" alt="">
      <p class="items-text">朋友圈</p>
    </div>
    <div class="items"  @click="onClickWhart">
      <img :src="require('@/assets/qq.png')" alt="">
      <p class="items-text">QQ好友</p>
    </div>
    <div class="items"  @click="onClickWhart">
      <img :src="require('@/assets/qq1.png')" alt="">
      <p class="items-text">QQ空间</p>
    </div>
    </div>
   </van-popup>
    <div class="show" v-if="showShare" @click="onclickHide">
     <div class="share">
        <img class="fenxiang" :src="require('@/assets/shareArr.png')" alt="">
       <div class="textShare">
         <p>点击右上角“ ... ”</p>
         <p>分享给朋友吧！</p>
       </div>
       </div>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue'
import sdk from './../sdk'
import wx from 'weixin-js-sdk'
export default {
  data () {
    return {
      show: false,
      showShare: false,
      dataInfo: ''
    }
  },
  created () {
    this.list()
    if (this.$route.query.inviteCode) {
      this.$cookie.set('inviteCode', this.$route.query.inviteCode)
    }
  },
  methods: {
    list () {
      this.$http({
        url: this.$http.adornUrl('/h5/user/fetchMyInviteInfo'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.dataInfo = data.data
          this.$cookie.set('inviteCode', data.data.inviteCode)
          if (!this.dataInfo.qrcode) {
            wx.hideMenuItems({
              menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:facebook', 'menuItem:share:QZone']
            })
          }
        }
      })
    },
    onClickShare () {
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.includes('micromessenger')) {
        this.show = true
      } else {
        this.$toast('请到微信中打开分享')
      }
    },
    // 分享微信
    onClickWhart () {
      this.show = false
      this.showShare = true
      var url = location.href
      var obj = {
        title: '我的邀请码', // 分享标题
        desc: '人人精气神，必备久宗丹',
        linkUrl: location.href + '?inviteCode=' + this.dataInfo.inviteCode,
        img: 'http://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
      }
      sdk.getJSSDK(url, obj)
    },
    onclickHide () {
      this.showShare = false
    },
    onClickShare1 () { this.$router.replace('/') }
  }
}
</script>

<style lang="less" scoped>
.app{
  width: 100%;
  height: 100vh;
  background: url('../../assets/codeBg.png') no-repeat;
  background-size: 100% 100%;
}
.codeText{
  padding-top: 2.28rem;
  width: 7.41rem;
  height: 1.78rem;
  margin: auto;
  img{
    width: 100%;
    height: 100%;
  }
}
.code{
    height: 9rem;
    margin-top: 1rem;
    background: url(../../assets/codeRed.png) left no-repeat;
    background-size: 89% 90%;
  .code-box{
    width: 4.2rem;
    margin: auto;
    font-size: .34rem;
    padding-top: 1.1rem;
    text-align: center;
    .er{
      height: 3.6rem;
      width: 3.6rem;
    }
    .er1{
      height: 2.88rem;
      width: 3.7rem;
    }
    .like{
      line-height: 1rem;
      background: #FFB846;
      font-size: .36rem;
      text-align: center;
      border-radius: 30px;
      margin-top: .5rem;
      .icon{
        width: 0.26rem;
        height: 0.26rem;
        vertical-align: 0px;
      }
    }
    .dec{
      .p1{
         color: #404040;
        font-size: .4rem;
        font-weight:500;
        line-height: 2
      }
      .p2{
        font-size: .36rem;
        color: #999;
        white-space: nowrap
      }
    }
    .yao{
      height: 1.62rem;
      width: 1.6rem;
      margin-top: .15rem;
    }
  }
}
.show{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: hsla(0,0%,5%,.7) no-repeat;
 .share{
  margin-top: .5rem;
  color: #fff;

  .textShare{
    float:right;
    line-height: 1.5;
     font-size: .42rem;
  }
  .fenxiang{
    float: right;
    margin-left: .5rem;
    width: 2rem;
  }
 }
}
.dao{
 margin-top: .5rem;
 margin-left: .3rem;
 margin-bottom: .4rem
}
.wrap{
  display: flex;
  justify-content: space-around;
  text-align: center;
  .items{
    font-size: .3rem;
    img{
      width: 50%;
    }
    .items-text{
      line-height: 1.5
    }
  }
}
</style>
