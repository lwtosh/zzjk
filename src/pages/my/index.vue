<template>
  <div class="page">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="height: 100vh;">
      <div class="hader">
          <div class="user">
              <div  class="ara" style="position: relative;" @click='onEdit'>
                  <img :src="dataInfo.avatar" alt="" v-if='dataInfo.avatar'>
                  <img src="../../assets/userDa.png" alt="" v-else>
                  <img src="~@/assets/edit.png" alt="" class="edit">
              </div>
           <div class="user-index" v-if='show'>
            <van-button color="#38CBCE" plain size="small" @click="handleLogin">登录</van-button>
           </div>
           <div class="user-index" v-else>
            <div class="name">{{dataInfo.nickName}} <span class="icon-info" v-if='name && identity>0' >{{name}}</span> </div>
            <div class="id">ID:{{dataInfo.id}}</div>
           </div>
          </div>
          <div class="er" @click="onClick1" ><van-icon name="qr" size='40px' color="#fff"/> <p class="yaoText">推广码</p></div>
      </div>
      <div class="box">
        <div class="numder">
          <div class="c-1">
              <router-link to='/wages'>
              <p class="mon" v-if='show'>--</p>
              <p class="mon" v-else>{{dataInfo1.salary == null ?  '--' : parseInt(dataInfo1.salary)}}</p>
              <p class="numder-text">我的工资</p>
              </router-link>
          </div>
          <div class="c-1">
             <router-link to='/integral'>
              <p class="mon" v-if='show'>--</p>
              <p class="mon" v-else>{{dataInfo1.account.score == null ? '--' :parseInt(dataInfo1.account.score)}}</p>
              <p class="numder-text">我的积分</p>
              </router-link>
          </div>
          <div class="c-1">
               <router-link to='/commission'>
                <p class="mon" v-if='show == true'>--</p>
              <p class="mon" v-else>{{dataInfo1.account.money == null ? '--' :parseInt(dataInfo1.account.money)}}</p>
              <p class="numder-text">我的佣金</p>
              </router-link>
          </div>
          <div class="c-1">
               <router-link to='/performance'>
              <p class="mon" v-if='show'>--</p>
              <p class="mon" v-else>{{dataInfo1.teamPerformance == null ? '--' :parseInt(dataInfo1.teamPerformance)}}</p>
              <p class="numder-text">总业绩</p>
              </router-link>
          </div>
      </div>
      </div>

      <van-notice-bar color="#EF0F0F" background="#FFFFFF"  v-if='show == true'>
       你还没有登录哦~ 请点击上方登录
      </van-notice-bar>
      <div class="flie">
          <van-cell title="订单中心" is-link to='/order' >
              <img src="../../assets/f1.png" alt="" slot="icon" class="icon-f">
          </van-cell>
          <van-cell title="员工专区" is-link @click="handDetails" v-if='yuangong'>
              <img src="../../assets/f8.png" alt="" slot="icon" class="icon-f icon1">
          </van-cell>
          <van-cell title="收货地址" is-link to='/addressManage'>
              <img src="../../assets/f2.png" alt="" slot="icon" class="icon-f icon1">
          </van-cell>
          <van-cell title="我的推荐人" :value="dataInfo3" value-class='sss'>
              <img src="../../assets/f3.png" alt="" slot="icon" class="icon-f">
          </van-cell>
          <van-cell title="实名认证" is-link to='/realName'>
              <img src="../../assets/f5.png" alt="" slot="icon" class="icon-f">
          </van-cell>
          <van-cell title="意见反馈" is-link to='/opinion'>
              <img src="../../assets/f6.png" alt="" slot="icon" class="icon-f icon2">
          </van-cell>
          <van-cell title="关于我们" is-link  to='/about'>
              <img src="../../assets/f7.png" alt="" slot="icon" class="icon-f icon3">
          </van-cell>
      </div>
      <div class="clear" v-if='!show' @click="onclickOut">退出登录</div>
      <div class="hh"></div>
    <!-- 导航底部 -->
    </van-pull-refresh>
      <BottomTab :active='active' :actives='actives'/>
  </div>
</template>
<script>
import Vue from 'vue'
import BottomTab from '@/components/footer'
import {clearLoginInfo} from '@/utils/httpRequest'
// import sdk from './../sdk'
export default {
  data () {
    return {
      status: '',
      show: false,
      isLoading: false,
      dataInfo: {avatar: ''},
      dataInfo1: {account: {}},
      identity: '',
      actives: false,
      yuangong: false,
      active: 3,
      kf400: '',
      name: '',
      dataInfo3: ''
    }
  },
  components: {
    BottomTab
  },
  created () {
    this.list()
    if (!Vue.cookie.get('userId')) {
      this.show = true
    }
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
    // var url = location.href
    // var url1 = 'http://h5.zzjk99.com/zzShop/index.html#/?inviteCode='
    // var url2 = Vue.cookie.get('inviteCode')
    // var obj = {
    //   title: '至真健康', // 分享标题
    //   desc: '人人精气神，必备久宗丹',
    //   linkUrl: url1 + url2,
    //   img: 'http://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    // }
    // sdk.getJSSDK(url, obj)
  },
  methods: {
    list () {
      this.$http({
        url: this.$http.adornUrl('/h5/user/fetchTinyUser'),
        method: 'get',
        params: {
          userId: Vue.cookie.get('userId') || 0
        }
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.dataInfo = data.data
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchMyAccountData'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.dataInfo1 = data.data
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/mall/fetchReGoodsByUid'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok' && data.data) {
          this.yuangong = true
          this.goodsId = data.data.id
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/other/fetchSysConfig'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.kf400 = data.data.kf400
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/user/fetchMyParentByUid'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          if (data.data) {
            this.dataInfo3 = data.data.phone
          }
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/user/fetchMyIdentity'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.name = data.data.name
          this.identity = data.data.identity
        }
        if (data.code === 'B19' || data.code === 'UNDEFINED') {
          this.show = true
        }
      })
    },
    handDetails () {
      this.$router.push('/shopDetails?id=' + this.goodsId)
    },
    onClick1 () { this.$router.push('/code') },
    onclickOut () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定要退出登录吗？',
        confirmButtonColor: '#38CBCE'
      }).then(() => {
        clearLoginInfo()
        window.location.reload()
        this.$cookie.set('cancel', 1)
      }).catch(() => {
      })
    },
    handleLogin () {
      var url = '//h5.zzjk99.com/zzShop/index.html#/my'
      if (Vue.cookie.get('platform') === 'WXWEB') {
        window.location.href = '//api.zzjk99.com/to/toAuth?type=redirect&fromUrl=' + encodeURIComponent(url) + '?inviteCode=' + Vue.cookie.get('inviteCode')
      } else {
        this.$router.replace('/register?fromUrl=' + encodeURIComponent(location.href) + '&inviteCode=' + Vue.cookie.get('inviteCode'))
      }
    },
    onClickTel (phoneNumber) { window.location.href = 'tel:' + phoneNumber },
    onEdit () { this.$router.push('/editInfo') },
    onRefresh () {
      this.list()
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    }
  }
}
</script>
<style lang="less" scoped>
.sss{
  white-space: nowrap;
  flex: inherit
}
.page{
    width: 100%;
    background: #fff;
    margin-bottom: 1.3rem;
}

.hader{
    padding: 0 .3rem;
    height: 3.18rem;
    background: #38CBCE;
    padding-top: 1rem;
    display: flex;
    justify-content: space-between;
    .user{
       .ara{
            float: left;
             width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            .edit{
           position: absolute;
           width: .6rem;
           height: 0.6rem;
           bottom: 0;
           right: 0;
           img{
           width: 100%;
           height: 100%;
          }
        }
       }
       .user-index{
            float: left;
            margin-top: .3rem;
        margin-left: .2rem;
        color: #fff;
        .name{
          font-size: .42rem;
          font-weight: bold;
          .icon-info{
            padding: .05rem .13rem;
            margin-left: .15rem;
            background: #1C6567;
            font-size: .32rem;
            font-weight: 400;
            border-radius: 10px;
            background-size: 100% 100%;
          }
        }
        .id{
          font-size: .34rem;
        }
       }
    }
    .er{
        .yaoText{
            font-size: .32rem;
            color: #fff;
        }
    }
}
.box{
    width: 100%;
    margin: auto;
    background: url('../../assets/touying.png') no-repeat;
    background-size: 100% 111%;
    padding-bottom: .2rem;
}
.numder{
    width: 94%;
    margin: auto;
    background:#fff;
    border-radius: 10px;
    display: flex;
    justify-content: space-around;
    text-align: center;
    padding: .6rem 0;
    margin-top: -1rem;
    .mon{
        font-weight: bold;
        font-size: .44rem;
    }
    .numder-text{
        font-size: .3rem;
        color: #808080;
    }
}
.flie{
 .icon-f{
     width: 0.4rem;
     height: 0.34rem;
     margin-top: .12rem;
     margin-right: .12rem;
 }
 .icon1{
     width: .29rem;
     height: 0.3rem;
 }
 .icon2{
     width: .285rem;
     height: 0.29rem;
     margin-top: .13rem;
 }
 .icon3{
     width: .29rem;
     height: 0.29rem;
     margin-top: .13rem;
 }
}
.clear{
line-height: 1.3rem;
text-align: center;
width: 94%;
margin:.5rem auto;
font-size: .4rem;
color: #fff;
background: #38CBCE;
border-radius: 30px;
}
.hh{
  height: .3rem;
  width: 100%;
}
.van-cell{
  padding: 12px 16px;
}
</style>
