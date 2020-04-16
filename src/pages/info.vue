<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="err" v-if="infoList.length == 0">
        <img src="~@/assets/err.png" class="err" alt="" >
        <p>还没有数据哦~</p>
     </div>
    <div class="cont" v-else>
      <ul class="ul">
        <li class="li" v-for='item in infoList' :key='item.id'>
          <div class="info-hb" v-if='item.type == "ORDER"'>
            <img src="../assets/info1.png" alt="">
            <span class="title">{{item.title}}</span>
          </div>
          <div class="info-hb" v-else>
            <img src="../assets/info.png" alt="">
            <span class="title">{{item.title}}</span>
          </div>
          <div class="info-cont">{{item.content}}</div>
          <div class="time">{{item.sendTime}}</div>
        </li>
      </ul>
    </div>
       </van-list>
    </van-pull-refresh>
    <!-- 导航底部 -->
      <BottomTab :actives='actives' :active='active'/>

  </div>
</template>
<script>
import BottomTab from '@/components/footer'
import { getDate } from '@/utils/date'
import sdk from './sdk'
import Vue from 'vue'
export default {
  data () {
    return {
      isLoading: false,
      page: 1,
      finished: false,
      loading: false,
      hasNext: false,
      actives: false,
      active: 1,
      time: null,
      infoList: []
    }
  },
  components: {
    BottomTab
  },
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
    this.list(this.page)
  },
  methods: {
    list (page) {
      this.$http({
        url: this.$http.adornUrl('/h5/other/fetchUserMsgUnReadCount'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          if (data.data > 0) {
            this.actives = true
          }
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/other/fetchUserMessageList'),
        method: 'get',
        params: {
          page: page, limit: 20, type: ''
        }
      }).then(({data}) => {
        if (data.code === 'ok') {
          for (let i = 0; i < data.data.content.length; i++) {
            data.data.content[i].sendTime = getDate(data.data.content[i].sendTime, 'yyyy-MM-dd hh:mm:ss')
          }
          if (data.data.hasNext === true) {
            this.hasNext = true
          }
          this.infoList = data.data.content
        }
      })
    },
    onRefresh () {
      this.list(this.page)
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    onLoad () {
      setTimeout(() => {
        this.loading = false
        if (this.hasNext === true) {
          this.page = this.page + 1
          this.$http({
            url: this.$http.adornUrl('/h5/other/fetchUserMessageList'),
            method: 'get',
            params: {page: this.page, limit: 20, type: ''}
          }).then(({data}) => {
            if (data.code === 'ok') {
              for (let i = 0; i < data.data.content.length; i++) {
                data.data.content[i].sendTime = getDate(data.data.content[i].sendTime, 'yyyy-MM-dd hh:mm:ss')
                this.infoList.push(data.data.content[i])
              }
              if (data.data.hasNext === true) {
                this.hasNext = true
              } else {
                this.hasNext = false
              }
            }
          })
        } else {
          this.finished = true
        }
      }, 500)
    }
  },
  beforeDestory () {
    clearInterval(this.time)
  }
}
</script>
<style lang="less" scoped>
.van-nav-bar .van-icon{
  color: #fff;
  font-size: .55rem;
}
.van-nav-bar{
  height: 1.17rem;
  line-height: 1.17rem;
}
.van-nav-bar__title{
   color: #fff;
}
.err{
    margin: 1.5rem auto 0;
    text-align: center;
    img{
      width: 80%;
    }
  }
.cont{
  // margin-top: 1.2rem;
  margin-bottom: 1.3rem;
  .ul{
    .li{
    padding:  .2rem .5rem;
    background: #fff;
    border-bottom: 1px solid #eee;
    .info-hb{
      img{width:.32rem ;height: .3rem;}
      .title{
        font-weight: bold;
        font-size: .34rem;
      }
    }
    .info-cont{
      padding: .3rem 0 .3rem .32rem;
      font-size: .32rem;
    }
    .time{
     padding-left:  .32rem;
     color: #BFBFBF;
      font-size: .3rem;
    }
   }
  }

}
</style>
