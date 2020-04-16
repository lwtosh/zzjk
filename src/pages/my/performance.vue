<template>
  <div>
     <div class="cont">
       <div class="flie">
        <div class="c-1" @click="onClick1">
          <p class="mun">{{infoList.addPerformance == null ? '--' :parseInt(infoList.addPerformance)}}</p>
          <p class="desc">本月新增业绩</p>
        </div>
        <div class="c-1" @click="onClick2">
          <p class="mun">{{infoList.basePerformance== null ? '--' :parseInt(infoList.basePerformance)}}</p>
          <p class="desc">本月责任底薪业绩</p>
        </div>
         <div class="c-1" @click="onClick3">
          <p class="mun">{{infoList.directCount}}</p>
          <p class="desc">我的伙伴</p>
         </div>
       </div>
       <div class="flie1">
        <div class="c-1" @click="onClick4">
          <p class="mun">{{infoList.teamAmountA== null ? '--' :parseInt(infoList.teamAmountA)}}</p>
          <p class="desc">市场一部总业绩</p>
        </div>
        <div class="c-2" @click="onClick5">
          <p class="mun">{{infoList.teamAmountB== null ? '--' :parseInt(infoList.teamAmountB)}}</p>
          <p class="desc">市场二部总业绩</p>
        </div>
       </div>
     </div>
     <div class="box" @click="onCLickBack" v-if="this.falg">
       <van-icon name="wap-home-o" class="home-o"/>
      <p class="homeText">回首页</p>
     </div>
  </div>
</template>
<script>
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      falg: false,
      infoList: {}
    }
  },
  mounted () {
    if (window.performance.navigation.type === 1) {
    } else {
      this.falg = true
    }
  },
  created () {
    var url = location.href
    var url1 = 'http://h5.zzjk99.com/zzShop/index.html#/'
    var url2 = '?inviteCode=' + Vue.cookie.get('inviteCode')
    var obj = {
      title: '至真健康', // 分享标题
      desc: '人人精气神，必备久宗丹',
      linkUrl: url1 + url2,
      img: 'http://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    }
    sdk.getJSSDK(url, obj)
    this.list()
  },
  methods: {
    list () {
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchMyPerformanceDetail'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.infoList = data.data
        }
      })
    },
    onClick1 () { this.$router.push('/performanceNew') },
    onClick2 () { this.$router.push('/basicSalaryPerformance') },
    onClick3 () { this.$router.push('/partner') },
    onClick4 () { this.$router.push('/marketPerformanceOne') },
    onClick5 () { this.$router.push('/marketPerformanceTwo') },
    onCLickBack () { this.$router.replace('/') }
  }
}
</script>
<style lang="less" scoped>
.cont{
  padding: .3rem;
}
.flie,.flie1{
padding: .9rem 0;
display: flex;
justify-content: space-around;
text-align: center;
background: url('../../assets/yeji1.png') no-repeat;
background-size: 100% 100%;
color: #fff;
.mun{
font-size: .6rem;
font-weight: bold;
}
.desc{
  font-size: .38rem;
}
}
.flie1{
  padding: 0;
  height: 3.2rem;
  background:none;
  margin-top: 10px;
  .c-1{
    width: 49%;
    padding-top: 1rem;
    background: url('../../assets/yeji2.png') no-repeat;
    background-size: 100% 100%;
  }
  .c-2{
    width: 49%;
    padding-top: 1rem;
    background: url('../../assets/yeji3.png') no-repeat;
    background-size: 100% 100%;
  }
}
.box{
   position: absolute;
   background: #c8c9cc;
   text-align: center;
   padding: .1rem 0;
   width: 1.5rem;
   right: 0;
   color: #fff;
   font-size: .34rem;
   border-radius: 10px 0 0 10px;
   z-index: 999;
   .home-o{
     font-size: .45rem;
   }
}
</style>
