<template>
  <div>
   <div class="cont">
     <!-- 联系人卡片 -->
     <div class="contact" @click="onClickadd">
       <van-icon name="location-o"  class="icon-lo"/>
       <div class="contactVal" v-if="this.addresssInfo.consignee == null || this.addresssInfo.consignee == ''">
         <div style="color:#404040;margin-top:.2rem;">请添加收货地址</div>
       </div>
       <div class="contactVal" v-else>
         <div style="color:#404040;">{{addresssInfo.consignee}}   {{addresssInfo.phone}}</div>
         <div class="color:#999">{{addresssInfo.province}}{{addresssInfo.county}}{{addresssInfo.city}}{{addresssInfo.address}}</div>
       </div>
       <van-icon name="arrow" class="icon-lo arr"/>
     </div>
     <div class="card">
       <img :src="dataInfo.goodsCoverImg" alt="" class="cardImg">
       <div class="card-index">
          <div class="title">{{dataInfo.goodsName}}</div>
          <div class="x">X{{dataInfo.value}}</div>
          <div class="card-foot">
              <div class="price"><span class="yen">￥</span>{{dataInfo.totalPrice}}</div>
              <!-- <van-stepper style="margin-top: 0.9rem;height: 0.65rem" v-model="value"  button-size="24px"/> -->
              <div class="sterpper" v-if='dataInfo.status == 1'>
                <span class="dele" @click="dele">-</span>
                <span class="value">{{dataInfo.value}}</span>
                <span class="add" @click="add">+</span>
              </div>
          </div>
       </div>
     </div>
     <div class="total">实际付款：￥{{dataInfo.status == 1 ? dataInfo.totalPrice* dataInfo.value : dataInfo.totalPrice}}</div>
    </div>
     <div class="mode">
       <div class="modeTitle">选择支付方式</div>
       <van-radio-group v-model="radio">
         <van-cell-group>
           <div style="position: relative;">
             <img :src="require('@/assets/pay1.png')" class="iconPay" >
             <van-cell title="余额" clickable @click="radio = '3'">
              <van-radio slot="right-icon" name="3" checked-color="#38CBCE" />
            </van-cell>
           </div>
           <div style="position: relative;"  v-for='item in lists' :key='item.id'>
             <img :src="item.iconUrl" class="iconPay" >
             <van-cell :title="item.payName" clickable @click="radio = item.payMethod">
              <van-radio slot="right-icon" :name="item.payMethod" checked-color="#38CBCE" />
            </van-cell>
           </div>
          </van-cell-group>
         </van-radio-group>
     </div>
     <van-button class="btnPay" @click="confirm"  :disabled='disabled'>确认付款</van-button>
     <van-action-sheet v-model="show1" title="确认支付金额" :style="{ height: '5.8rem' }" @close='onClose'>
     <div class='box-pay' style="text-align: center;margin-bottom: .2rem;font-size:.56rem">
        <span class='tet'>￥</span> {{dataInfo.status == 1 ? dataInfo.totalPrice* dataInfo.value : dataInfo.totalPrice}}</div>
      <div class='item-1'>订单号：
        <span class='tet'>{{orderNo}}</span>
      </div>
      <div class='item-1' style="margin-bottom: 50rpx;">支付方式：
        <span class='tet' v-if="radio == 3">余额支付</span>
      </div>
     <div class='btn-agement' @click='payment'>支付</div>
    </van-action-sheet>
  </div>
</template>

<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import sdk from './../sdk'
export default {
  data () {
    return {
      radio: '',
      show1: false,
      disabled: false,
      value: 1,
      lists: [],
      addresssInfo: {consignee: '', phone: '', province: '', id: ''},
      dataInfo: {value: 1},
      orderId: '',
      orderNo: ''
    }
  },
  created () {
    if (this.$route.query.goodsCoverImg) {
      this.dataInfo.goodsCoverImg = this.$route.query.goodsCoverImg
      // this.dataInfo.totalPrice = this.$route.query.totalPrice
      this.dataInfo.id = this.$route.query.id
      this.dataInfo.status = this.$route.query.status
      this.dataInfo.marketPrice = this.$route.query.marketPrice
      this.dataInfo.goodsName = this.$route.query.goodsName
      this.dataInfo.orderNo = this.$route.query.orderNo
    }
    if (this.$route.query.addressId) {
      this.addresssInfo.consignee = this.$route.query.addressContact
      this.addresssInfo.phone = this.$route.query.addressPhone
      this.addresssInfo.province = this.$route.query.address
      this.addresssInfo.id = this.$route.query.addressId
    }
    if (this.$route.query.item1) {
      this.addresssInfo = this.$route.query.item1
    }
    if (this.$route.query.value) {
      this.dataInfo.value = this.$route.query.value
    }
    // if (this.$route.query.marketPrice) {
    //   this.dataInfo.totalPrice = this.$route.query.marketPrice * this.dataInfo.value
    // } else {
    this.dataInfo.totalPrice = this.$route.query.totalPrice
    // }
    if (this.$route.query.number) {
      this.dataInfo.value = this.$route.query.number
    }
    this.list()
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
  },
  methods: {
    // 换地址
    onClickadd () {
      this.$router.push({path: '/address?value=' + this.dataInfo.value, query: this.$route.query, mode: 'con'})
    },
    dele () { if (this.dataInfo.value > 1) { this.dataInfo.value-- } },
    add () { this.dataInfo.value++ },
    list () {
      // 判断地址是否为空
      if (this.addresssInfo.consignee == null || this.addresssInfo.consignee === '') {
        this.$http({
          url: this.$http.adornUrl('/h5/user/fetchUserDefaultAddress'),
          method: 'get'
        }).then(({data}) => {
          if (data.code === 'ok') {
            if (data.data) {
              this.addresssInfo = data.data
            }
          } else if (data.code === 'B19' || data.code === 'UNDEFINED') {
          } else {
            this.$toast(data.message)
          }
        })
      }
      this.$http({
        url: this.$http.adornUrl('/h5/pay/fetchPayConfigs'),
        method: 'get',
        params: {payType: 'MALL_ORDER_MONEY'}
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.lists = data.data
        }
      })
    },
    confirm () {
      if (this.addresssInfo.consignee == null || this.addresssInfo.consignee === '') {
        this.$toast('你还没有添加地址哦~')
      } else if (this.radio === '') {
        this.$toast('请选择支付方式')
      } else if (this.radio === '3') {
        this.payMon()
      } else if (this.radio === 'ALIH5') {
        this.payZhifubao()
      } else if (this.radio === 'WXGZH') {
        this.payWhat()
      }
    },
    // 余额
    payMon () {
      if (this.dataInfo.orderNo) {
        this.$http({
          url: this.$http.adornUrl('/h5/order/payOrder'),
          method: 'post',
          params: {orderId: this.orderId ? this.orderId : this.dataInfo.id, addressId: this.addresssInfo.id, payMethod: 'BALANCE'}
        }).then(({data}) => {
          if (data.code === 'ok') {
            this.$router.replace('/pay')
          } else {
            this.$toast(data.message)
          }
        })
      } else {
        this.$http({
          url: this.$http.adornUrl('/h5/order/createOrder'),
          method: 'post',
          params: {goodsId: this.orderId ? this.orderId : this.dataInfo.id, addressId: this.addresssInfo.id, remark: '', number: this.dataInfo.value}
        }).then(({data}) => {
          if (data.code === 'ok') {
            this.orderNo = data.data.orderNo
            this.orderId = data.data.id
            this.show1 = true
          } else {
            this.$toast(data.message)
          }
        })
      }
    },
    onClose () {
      this.orderNo = ''
      this.orderId = ''
    },
    // 支付宝
    payZhifubao () {
      this.disabled = true
      if (this.dataInfo.orderNo) {
        this.zhifu()
      } else {
        this.$http({
          url: this.$http.adornUrl('/h5/order/createOrder'),
          method: 'post',
          params: {goodsId: this.orderId ? this.orderId : this.dataInfo.id, addressId: this.addresssInfo.id, remark: '', number: this.dataInfo.value}
        }).then(({data}) => {
          if (data.code === 'ok') {
            this.orderNo = data.data.orderNo
            this.orderId = data.data.id
            this.zhifu()
          } else {
            this.$toast(data.message)
          }
        })
      }
    },
    // 微信
    payWhat () {
      this.disabled = true
      if (this.dataInfo.orderNo) {
        this.weixin()
      } else {
        this.$http({
          url: this.$http.adornUrl('/h5/order/createOrder'),
          method: 'post',
          params: {goodsId: this.orderId ? this.orderId : this.dataInfo.id, addressId: this.addresssInfo.id, remark: '', number: this.dataInfo.value}
        }).then(({data}) => {
          if (data.code === 'ok') {
            this.orderNo = data.data.orderNo
            this.orderId = data.data.id
            this.weixin()
          } else {
            this.$toast(data.message)
          }
        })
      }
    },
    zhifu () {
      this.$http({
        url: this.$http.adornUrl('/h5/order/payOrder'),
        method: 'post',
        params: {orderId: this.orderId ? this.orderId : this.dataInfo.id, addressId: this.addresssInfo.id, payMethod: this.radio}
      }).then(({data}) => {
        if (data.code === 'ok') {
          window.location.href = data.data.h5Url
        } else {
          this.$toast(data.message)
        }
      })
      if (this.disabled === true) {
        setTimeout(() => {
          this.disabled = false
        }, 5000)
      }
    },
    // 微信
    weixin () {
      this.$http({
        url: this.$http.adornUrl('/h5/order/payOrder'),
        method: 'post',
        params: {orderId: this.orderId ? this.orderId : this.dataInfo.id, addressId: this.addresssInfo.id, payMethod: this.radio}
      }).then(({data}) => {
        if (data.code === 'ok') {
          wx.ready(function () {
            wx.chooseWXPay({
              appId: data.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
              timestamp: data.data.timeStamp, // 必填，生成签名的时间戳
              nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
              signType: data.data.signType,
              package: data.data.package,
              paySign: data.data.paySign,
              success: function (res) {
                this.disabled = false
                location.href = 'http://h5.zzjk99.com/zzShop/index.html#/pay'
              },
              complete: function (res) {
              },
              cancel: function (res) {
                this.disabled = false
              },
              fail: function (res) {
                this.disabled = false
              }
            })
          })
          wx.error(function (res) {
            this.disabled = false
          })
        } else {
          this.$toast(data.message)
        }
      })
      if (this.disabled === true) {
        setTimeout(() => {
          this.disabled = false
        }, 5000)
      }
    },
    payment () {
      this.$http({
        url: this.$http.adornUrl('/h5/order/payOrder'),
        method: 'post',
        params: {orderId: this.orderId, addressId: this.addresssInfo.id, payMethod: 'BALANCE'}
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.$router.replace('/pay')
        } else {
          this.$toast(data.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar .van-icon{
  color: #404040;
  font-size: .55rem;
}
.van-cell__title, .van-cell__value{
  margin-left: .75rem
}
.iconPay{
  position: absolute;
  left: 0;
  top:.3rem;
  width: .6rem;
  height: .6rem;
  border-radius: 50%;
  z-index: 999;
}
.cont{
  margin: auto;
  background: #fff;
  border-radius: 10px;
  padding: 0 10px;
}
.contact{
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: .45rem;
    overflow: hidden;
    color: #404040;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    .contactVal{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #969799;
    flex: 1;
    font-size: .34rem;
    vertical-align: middle;
   }
   .icon-lo{
    min-width: 1em;
    height: 24px;
    font-size: .6rem;
    line-height: 24px;
    margin-right: 5px;
    color: #38CBCE;
    margin-top: 10px;
    }
   .arr{
     color: #999999;
     font-size: 16px;
   }
}
.contact::before{
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: .1rem;
  width: 100%;
  margin: auto;
  background: repeating-linear-gradient(-45deg,#38CBCE 0,#38CBCE 20%,transparent 0,transparent 25%,#38CBCE 0,#38CBCE 45%,transparent 0,transparent 50%);
  background: -webkit-repeating-linear-gradient(-45deg,#38CBCE 0,#38CBCE 20%,transparent 0,transparent 25%,#38CBCE 0,#38CBCE 45%,transparent 0,transparent 50%);
  background-size: 2.1rem;
}

.card{
  padding: .3rem 0;
  display: flex;
  border-bottom: 1px solid #f5f5f5;
  .cardImg{
    width: 2.4rem;
    height: 2.4rem;
    margin-right: .15rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .card-index{
    width: 75%;
    position: relative;
    .title{
      font-size: .38rem;
         color: #404040;
         margin-top: 10px;
         font-weight: 400;
         line-height: 1.5;
          overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        margin-bottom: .2rem;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
    }
    .card-foot{
      display: flex;
      justify-content: space-between;
      .sterpper{
        margin-top: .85rem;
        background: #fff;
        width: 2rem;
        display: flex;
        text-align: center;
        color: #333;
        .dele,.add{
          width: 27%;
          font-size: .4rem;
          line-height: 1.7;
          border: 1px solid #f5f5f5;
        }
        .value{
          flex: 1;
          font-size: .35rem;
          line-height: 1.7;
          border: 1px solid #f5f5f5;
        }
      }
    }
    .price{
        color: #EF0F0F;
        font-size: .48rem;
        font-weight: 400;
        margin-top: .9rem;
        .yen,.fu{
          font-weight: 400;
          display: inline-block;
          font-size: .2rem;
        }
        .fu{
          color: #404040
        }
    }
    .x{
      position: absolute;
      left: 5px;
      top:1.3rem;
      color: #BFBFBF;
      font-size: .3rem;
    }
  }
}
.total{
  color: #404040;
  font-size: .32rem;
  // text-align: right;
  height: 1.12rem;
  line-height: 1.12rem
}
.mode{
  // width: 100%;
  background: #fff;
  margin: auto;
  color: #404040;
  margin-top: .3rem;
  padding: .3rem 10px 0;
  border-radius: 10px;
  .modeTitle{
    font-size: .34rem;
  }
  .van-cell{
     padding: 0;
     height: 1.2rem;
     line-height: 1.2rem;
    //  position: relative;
  }
  [class*=van-hairline]::after{
    border:none
  }
}
.btnPay{
  position: fixed;
   bottom: 0;
   width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
  text-align: center;
  color: #fff;
  font-size: .4rem;
  background: #38CBCE;
}
.van-radio__icon--round .van-icon,.van-radio__icon .van-icon{
  background-color: #999;
  color: #fff;
}
.btn{
  position: fixed;
  bottom: 0;
  height: 1.2rem;
  width: 100%;
  text-align: center;
  line-height: 1.2rem;
  background: #EF0F0F;
  color: #fff;
  font-size: .4rem;
}
.text{
  height: 3.37rem;
  overflow-y: scroll;
  padding:0 .49rem;
  font-size: .32rem;
  color: #404040;

}
.van-checkbox{
  display: inline-flex;
}
.van-checkbox__icon{
  display: inline-block;
  height:0;
}
.van-popup__close-icon{
  font-size: 30px;
}
.order {
  width: 100%;
  margin-top: 0.25rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.29rem;
  .number {
    color: #999;
    }
    .order-text {
    color: #38CBCE;
    font-size: 0.32rem;
  }
  }
.item-1{
  font-size: .32rem;
  color: #808080;
  line-height: 3;
  padding: 0 .5rem;
  border-bottom: 1px solid #F5F5F5
}
.tet{
  color: #808080;
  font-size: .32rem;
}
.btn-agement{
  background:#38CBCE;
  color: #fff;
  text-align: center;
  line-height: 1.2rem;
  font-size: .32rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 999;
}
</style>
