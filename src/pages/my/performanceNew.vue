<template>
  <div>
    <van-tabs v-model="active" sticky swipeable background="#fff" title-active-color='#38CBCE' color='#38CBCE' title-inactive-color='#404040' @change="onClick" :swipe-threshold='2.6' >
      <van-tab :title="item.time"  v-for="item in dataArr" :key='item.id' :name="item.month">
         <div class="header">
      <div class="inte">
       <div class="text">
           <h5 class="mun" v-if="addPerformance">{{addPerformance== null ? '--' :parseInt(addPerformance)}}</h5>
           <h5 class="mun" v-else>{{addPerformance== null ? '--' :parseInt(addPerformance)}}</h5>
           <p class="title">本月新增业绩</p>
       </div>
      </div>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="min-height: 100vh;">
       <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
     <err v-if="dataInfo.length == 0"/>
      <div class="cont">
          <ul class="integral-ul">
            <li class="integral-li" v-for="item in dataInfo" :key='item.id'>
              <div class="left">
                <p class="desc">{{item.operInfo}}</p>
                <p class="time">{{item.occurTime}}</p>
              </div>
              <div class="right" v-if='item.performance > 0'>+{{parseInt(item.performance)}}</div>
              <div class="right" style="color:#404040" v-else>{{parseInt(item.prePerformance)}}</div>
            </li>
          </ul>
       </div>
       </van-list>
      </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import err from '@/components/err'
import { getDate } from '@/utils/date'
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      active: '',
      dataArr: [],
      addPerformance: '',
      isLoading: false,
      finished: false,
      loading: false,
      page: 1,
      hasNext: false,
      month: '',
      dataInfo: []
    }
  },
  components: {
    err
  },
  created () {
    var data = new Date()
    data.setMonth(data.getMonth() + 1, 1)
    for (var i = 0; i < 12; i++) {
      data.setMonth(data.getMonth() - 1)
      var m = data.getMonth() + 1
      m = m < 10 ? '0' + m : m
      this.dataArr.push({time: data.getFullYear() + '年' + m + '月', month: data.getFullYear() + '' + m})
    }
    this.month = this.dataArr[0].month
    this.list(this.month, this.page)
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
  },
  methods: {
    list (month, page) {
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchPerformanceByMonth'),
        method: 'get',
        params: {
          page: page, limit: 20, month: month
        }
      }).then(({data}) => {
        this.addPerformance = data.data.addPerformance
      })
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchUserAddPerformanceLogs'),
        method: 'get',
        params: {
          page: page, limit: 20, month: month
        }
      }).then(({data}) => {
        if (data.code === 'ok') {
          for (let i = 0; i < data.data.content.length; i++) {
            data.data.content[i].occurTime = getDate(data.data.content[i].occurTime, 'yyyy-MM-dd hh:mm:ss')
          }
          if (data.data.hasNext === true) {
            this.hasNext = true
          }
          this.dataInfo = data.data.content
        }
      })
    },
    onClick (name) {
      this.month = name
      this.list(name, this.page)
    },
    onRefresh () {
      this.list(this.month, this.page)
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
            url: this.$http.adornUrl('/h5/account/fetchUserAddPerformanceLogs'),
            method: 'get',
            params: {page: this.page, limit: 20, month: this.month}
          }).then(({data}) => {
            if (data.code === 'ok') {
              for (let i = 0; i < data.data.content.length; i++) {
                data.data.content[i].occurTime = getDate(data.data.content[i].occurTime, 'yyyy-MM-dd hh:mm:ss')
                this.dataInfo.push(data.data.content[i])
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
  }
}
</script>

 <style lang="less" scoped>
.header{
  padding: .2rem;
  background: #fff;
  margin-bottom: 10px;
}
.inte{
  width: 100%;
  height: 4.4rem;
  background: url('../../assets/yejiBig1.png') no-repeat;
  background-size: 100% 100%;
  border-radius: 0;
  .text{
    text-align: center;
    padding-top:1.65rem;
    color: #fff;
      .title{
        font-size: .38rem;
      }
      .mun{
      font-size: .64rem;
     }

  }
}
.cont{
  background: #fff;
  padding:0 .3rem;
  margin-bottom: .5rem;
  .integral-ul{
   .integral-li{
     display: flex;
     padding: .3rem 0;
     border-bottom: 1px solid #F5F5F5;
     justify-content: space-between;
     .left{
       .desc{
         font-size: .36rem;
         line-height: 1.5
       }
       .time{
         color: #B3B3B3;
         font-size: .33rem
       }
     }
     .right{
       color: #38CBCE;
       font-size: .39rem;
     }
   }
  }
}
</style>
