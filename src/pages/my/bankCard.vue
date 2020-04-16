<template>
<div>
   <ul class="ul">
      <li class="li" v-for="item in dataList" :key='item.id' @click="onClickBank(item)">
         <div class="name1">{{item.bankName}}</div>
         <div class="name2">储蓄卡</div>
         <div class="no">{{item.bankNo}}</div>
         <div class="del" @click.stop="onClick(item.id)">解绑</div>
       </li>
      </ul>
     <div class="item" @click="onClickBid">
        <div class="add"><img :src='require("@/assets/icon-add.png")' alt=""></div>
          <div class="text">
            <p class="text-index1">添加提现银行卡</p >
             <p class="text-index2">最多绑定3张银行卡</p >
          </div>
       </div>
       <van-popup @close='close' v-model="show" closeable position="bottom" :style="{ height: '100%' ,background:'#f5f5f5'}">
       <addBank v-if="show" @hidden='show=false'></addBank>
       </van-popup>
     </div>
</template>
<script>
import addBank from './addBank'
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      dataList: [],
      show: false
    }
  },

  created () {
    this.list()
    var url = location.href
    var obj = {
      title: '至真健康', // 分享标题
      desc: '人人精气神，必备久宗丹',
      linkUrl: location.href + '&inviteCode=' + Vue.cookie.get('inviteCode'),
      img: 'https://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    }
    sdk.getJSSDK(url, obj)
  },
  components: {
    addBank
  },
  methods: {
    list () {
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchUserBanks'),
        method: 'get',
        params: {type: 1}
      }).then(({data}) => {
        if (data.code === 'ok') {
          for (var i = 0; i < data.data.length; i++) {
            var reg = /^(\d{4})\d+(\d{4})$/
            data.data[i].bankNo = data.data[i].bankNo.replace(reg, '**** **** **** $2')
          }
          this.dataList = data.data
        }
      })
    },
    onClickBank (item) {
      this.$router.replace({path: '/withdrawalsApply', query: {userBankId: item.id, bankName: item.bankName}})
    },
    close () {
      this.list()
    },
    onClick (id) {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定要解除该银行卡吗',
        confirmButtonColor: '#38CBCE'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/h5/account/delUserBank'),
          method: 'post',
          params: {id: id}
        }).then(({data}) => {
          if (data.code === 'ok') {
            this.$toast('解除成功')
            this.list()
          }
        })
      }).catch(() => {
      })
    },
    onClickBid () {
      if (this.dataList.length >= 3) {
        this.$toast('最多绑定3张银行卡哦！')
      } else {
        this.show = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ul{
   padding: .3rem;
   margin-bottom: 10px;
   background: #fff;
   .li{
      &:nth-of-type(odd){
       background: url('../../assets/card2.png') no-repeat;
    }
     height:2rem;
     padding: .3rem .2rem .3rem .6rem;
     color:#fff;
     margin-bottom:10px;
     position: relative;
     background: url('../../assets/card1.png') no-repeat;
     .name1{
       font-size: .37rem;
       font-weight:500;
       line-height: 1.5
       }
      .name2{
        font-size: .25rem;
        margin-bottom: 10px;
       }
       .no{
         font-size: .6rem
          }
        .del{
          position: absolute;
          right: .6rem;
          top:.8rem;
          padding: .1rem .3rem;
          border:2px solid #FFF043;
          color: #FFF043;
          border-radius:5px;
          font-size: .37rem;
          z-index: 999;
        }
    }
}
.item{
   padding: .45rem .3rem;
   background:#fff;
   display: flex;
   .add{
     width: 0.37rem;
     height: 0.37rem;
      img{
       vertical-align: -7px;
       width: 100%;
       height:100%;
   }
}
  .text{
   margin-left:.2rem;
   .text-index1{
     font-size:.37rem;
     color:#666;
     line-height:2;
    }
  }
}
</style>
