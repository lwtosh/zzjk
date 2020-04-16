<template>
  <div>
    <div class="header">
      <div class="inte">
       <div class="text">
         <img src="~@/assets/jinbi.png" alt="">
         <h5 class="mun" v-if="score">{{score== '' ? '--' :parseInt(score)}}</h5>
         <h5 class="mun" v-else>{{score== '' ? '--' :parseInt(score)}}</h5>
       </div>
      </div>
    </div>
    <div class="cont">
      <van-tabs sticky swipeable background="#fff"  title-active-color='#38CBCE' color='#38CBCE' title-inactive-color='#404040'>
        <van-tab title="积分记录">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="min-height: 100vh;">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <err v-if="dataInfo.length == 0"/>
          <ul class="integral-ul" v-else>
            <li class="integral-li" v-for='item in dataInfo' :key='item.id'>
              <div class="left">
                <p class="desc">{{item.operInfo}}</p>
                <p class="time">{{item.occurTime}}</p>
              </div>
              <div class="right" v-if='item.score > 0'>+{{parseInt(item.score)}}</div>
              <div class="right" style="color:#404040" v-else>+{{parseInt(item.score)}}</div>
            </li>
          </ul>
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="积分说明">
          <div class="desc3">
            <h4 class="h4"> <span></span> 积分的获得</h4>
            <p class="desc-text " style="margin-bottom:20px;">会员所有收入保留6%进入积分账户。</p>
            <h4 class="h4"> <span></span> 积分的使用</h4>
            <p class="desc-text">用于后期商城两性产品的兑换，或用于旅游，产品换购，公司涉外交流活动，专业培训等，具体另行下文通告。</p>
          </div>
        </van-tab>
      </van-tabs>
    </div>
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
      score: '',
      isLoading: false,
      page: 1,
      finished: false,
      loading: false,
      hasNext: false,
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
      img: 'http://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    }
    sdk.getJSSDK(url, obj)
    this.list(this.page)
  },
  methods: {
    list (page) {
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchMyAccountData'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.score = data.data.account.score
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchScoreLogList'),
        method: 'get',
        params: {
          page: page, limit: 20
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
            url: this.$http.adornUrl('/h5/account/fetchScoreLogList'),
            method: 'get',
            params: {page: this.page, limit: 20}
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
  background: url('../../assets/integral.png') no-repeat;
  background-size: cover;
  .text{
    text-align: center;
    width: 2.5rem;
    margin: auto;
    padding-top:1.2rem;
    img{
     width: 1rem;
     height: 0.98rem;
    }
    .mun{
      font-size: .64rem;
      color: #fff;
    }
  }
}
.cont{
  background: #fff;
  padding:0 .3rem;
  min-height: 100vh;
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
  .desc3{
    height: 70vh;
    .h4{
      font-size: .37rem;
      line-height: 3;
      span{
        width: 3px;
        height: 0.3rem;
        border-radius: 8px;
        background: #38CBCE;
        display: inline-block;
      }
    }
    .desc-text{
      font-size: .32rem;
      line-height: 1.5;
    }
  }
}
</style>
