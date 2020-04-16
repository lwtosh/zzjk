<template>
  <div>
    <div class="header">
      <div class="inte">
       <div class="text">
         <div class="com-left">
           <p class="title">我的佣金</p>
           <h5 class="mun" v-if="money">{{money== null ? '--' :parseInt(money)}}</h5>
           <h5 class="mun" v-else>--</h5>
         </div>
         <div class="com-right"> <router-link to='/withdrawalsApply' > 提现</router-link></div>
       </div>
      </div>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="min-height: 100vh;">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <err v-if="dataInfo.length == 0"/>
    <div class="cont" v-else>
        <ul class="integral-ul" >
            <li class="integral-li" v-for='item in dataInfo' :key='item.id'>
              <div class="left">
                <p class="desc">{{item.operInfo}}</p>
                <p class="time">{{item.occurTime}}</p>
              </div>
              <div class="right" v-if='item.money > 0'>+{{parseInt(item.money)}}</div>
              <div class="right" style="color:#404040" v-else>{{parseInt(item.money)}}</div>
            </li>
          </ul>
     </div>
      </van-list>
    </van-pull-refresh>
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
      money: '',
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
      img: 'https://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
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
          this.money = data.data.account.money
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchMoneyLogList'),
        method: 'get',
        params: {
          page: page, limit: 20
        }
      }).then(({data}) => {
        if (data.code === 'ok') {
          for (let i = 0; i < data.data.content.length; i++) {
            data.data.content[i].occurTime = getDate(data.data.content[i].occurTime, 'yyyy-MM-dd hh:mm:ss')
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
            url: this.$http.adornUrl('/h5/account/fetchMoneyLogList'),
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
a{
  color: #fff;
}
.inte{
  width: 100%;
  height: 4.4rem;
  background: url('../../assets/commission.png') no-repeat;
  background-size: 100% 100%;
  border-radius: 0;
  .text{
    padding: 0 .3rem ;
    width: 95%;
    padding-top:1.65rem;
    display: flex;
    color: #fff;
    justify-content: space-between;
    .com-left{
      .title{
        font-size: .38rem;
      }
      .mun{
      font-size: .64rem;
     }
    }
    .com-right{
      width: 2.45rem;
      height: 0.85rem;
      line-height: .85rem;
      text-align: center;
      background: #408499;
      border-radius: 20px;
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
