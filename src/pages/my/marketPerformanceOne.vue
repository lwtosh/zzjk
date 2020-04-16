<template>
  <div>
    <div class="header">
      <div class="inte">
       <div class="text">
           <h5 class="mun">{{teamAmountA== null ? '--' :parseInt(teamAmountA)}}</h5>
           <p class="title">一部总业绩</p>
       </div>
      </div>
    </div>
    <div class="cont">
       <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="height: 100vh;">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <err v-if="dataInfo.length == 0"/>
          <ul class="integral-ul" v-else>
            <li class="integral-li" v-for='item in dataInfo' :key='item.id'>
              <div class="left">
                <p class="desc">{{item.operInfo}}</p>
                <p class="time">{{item.occurTime }}</p>
              </div>
              <div class="right" v-if='item.teamAmount  > 0'>+{{parseInt(item.teamAmount)}}</div>
              <div class="right" style="color:#404040" v-else>{{parseInt(item.teamAmount)}}</div>
            </li>
          </ul>
          </van-list>
        </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import sdk from './../sdk'
import err from '@/components/err'
import { getDate } from '@/utils/date'
export default {
  data () {
    return {
      isLoading: false,
      page: 1,
      finished: false,
      loading: false,
      hasNext: false,
      teamAmountA: '',
      dataInfo: []
    }
  },
  components: {
    err
  },
  created () {
    var url = location.href
    var obj = {
      title: '至真健康', // 分享标题
      desc: '人人精气神，必备久宗丹',
      linkUrl: location.href + '&inviteCode=' + Vue.cookie.get('inviteCode'),
      img: 'https://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    }
    sdk.getJSSDK(url, obj)
    this.list(this.page)
  },
  methods: {
    list (page) {
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchMyPerformanceDetail'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.teamAmountA = data.data.teamAmountA
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchUserTeamAmountLogs'),
        method: 'get',
        params: {
          page: page, limit: 20, teamType: 1
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
            url: this.$http.adornUrl('/h5/account/fetchUserTeamAmountLogs'),
            method: 'get',
            params: {page: this.page, limit: 20, teamType: 1}
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
  background: url('../../assets/yejiBig3.png') no-repeat;
  background-size: 100% 100%;
  border-radius: 0;
  .text{
    text-align: center;
    padding-top:1.65rem;
    color: #fff;
      .title{
        font-size: .34rem;
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
