<template>
<div>
  <div class="cont">
    <van-cell :title="title" is-link to="bankCard" :value='bankName'/>
      <div class="setion">
      <van-field v-model="money" placeholder="请输入整数" type='number' label="提现金额(元):"/>
        <div class="setion-bh">
          <div class="desc1">
             <p>可提现金额:￥{{this.mon.toFixed(2)}}</p >
             <p>手续费:￥{{this.base1.toFixed(2)}}</p >
             <p>实际到账金额: <span style="color:#EF0F0F">￥{{this.realMon.toFixed(2)}}</span></p >
          </div>
          <div class="desc2" @click="onClickApply">全部提现</div>
         </div>
         </div>
        <div class="zhuyi">注意： <p>银行卡（仅限储蓄卡）提现将在下个工作日内审核处理完成。每人每天只能提现一次（时间为9：00--17:00），最低{{bankWithdrawMinMoney}}元，最高{{bankWithdrawMaxMoney}}元（要求整百提现），按照渠道要求，银行卡提现每笔收取{{this.base}}元基础费用+{{this.rate*100}}%元手续费。</p> </div>
        <!-- <div class="btn" v-if='show'>提现</div> -->
        <div class="btn" style="background:#38CBCE" @click='onClick'>提现</div>
     </div>
  </div>
</template>
<script>
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      bankName: '',
      show: true,
      mon: '',
      userBankId: '',
      base: '',
      base1: 0,
      bankWithdrawMinMoney: '',
      bankWithdrawMaxMoney: '',
      bankWithdrawDesc: '',
      rate: '',
      rate1: '',
      title: '银行卡(添加银行卡)',
      realMon: 0,
      money: ''
    }
  },
  watch: {
    money (newValue, oldValue) {
      if (newValue) {
        this.realMon = newValue - (newValue * this.rate + this.base)
        this.base1 = (newValue * this.rate + this.base)
      } else if (newValue === '' || newValue === {}) {
        this.realMon = 0
        this.base1 = 0
      }
    }
  },
  created () {
    this.bankName = this.$route.query.bankName
    this.userBankId = this.$route.query.userBankId
    if (this.bankName) {
      this.title = '银行卡'
    }
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
        url: this.$http.adornUrl('/h5/account/fetchMyAccountData'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.mon = data.data.account.money
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/other/fetchSysConfig'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.bankWithdrawMaxMoney = data.data.bankWithdrawMaxMoney
          this.bankWithdrawMinMoney = data.data.bankWithdrawMinMoney
          this.bankWithdrawDesc = data.data.bankWithdrawDesc
          this.base = data.data.bankServiceCharge.base
          this.rate = data.data.bankServiceCharge.rate / 10000
        }
      })
    },
    onClick () {
      if (!this.userBankId) {
        this.$toast('请添加银行卡')
      } else if (this.money > this.bankWithdrawMaxMoney) {
        this.$toast('不能大于最高提现金额')
      } else if (this.money < this.bankWithdrawMinMoney) {
        this.$toast('不能小于最底提现金额')
      } else {
        this.$http({
          url: this.$http.adornUrl('/h5/account/withdraw2'),
          method: 'post',
          params: {
            userBankId: this.userBankId, money: parseInt(this.money)
          }
        }).then(({data}) => {
          if (data.code === 'ok') {
            this.$router.go('-2')
            this.$toast('提现成功')
          } else {
            this.$toast(data.message)
          }
        })
      }
    },
    onClickApply () { this.money = parseInt(this.mon) }
  }
}
</script>
<style lang="less" scoped>
.setion{
  margin-top: 10px;
  .setion-bh{
        display: flex;
        justify-content: space-between;
        padding: .3rem;
        background:#fff;
        font-size: .3rem;
        color:#666;
        line-height:1.6;
     .desc2{
       color:#EF0F0F;
      }
  }
}
.zhuyi{
   padding: .1rem .3rem;
   line-height: 1.5
}
.btn{
width:95%;
height:1.3rem;
margin:auto;
line-height:1.3rem;
text-align:center;
margin-top:2rem;
font-size: .37rem;
background:#BFBFBF;
border-radius:30px;
color:#fff;
}
</style>
