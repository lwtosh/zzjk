<template>
  <div class="page">
    <!-- 商品内容 -->
    <van-tabs v-model="active" sticky swipeable background="#fff" :swipe-threshold=6  title-active-color='#38CBCE' color='#38CBCE' title-inactive-color='#404040' @change="onClick">
      <van-tab :title="item.name"  v-for="item in list" :key='item.id' :name="item.id">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
         <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div class="err" v-if="shopBanner.length == 0">
          <img src="~@/assets/err.png" class="err" alt="" >
          <p>还没有数据哦~</p>
        </div>
        <div class="list" v-else>
           <ul class="listUl"  v-for="(item,index) in shopBanner"  :key="index">
              <li class="listUl-li">
                <div class="order">
                  <div class="number">订单号 <span style="color:#404040">{{item.orderNo}}</span></div>
                  <div class="order-text" v-if='item.status == 0'>待付款</div>
                  <div class="order-text" v-if='item.status == 2'>待收货</div>
                      <div class="order-text" v-if='item.status == 1 '>待发货</div>
                      <div class="order-text" v-if='item.status == 4'>已完成</div>
                      <div class="order-text" v-if='item.status == 3'>已送达</div>
                      <div class="order-text" v-if='item.status == -1'>已取消</div>
                </div>
                <div class="cont">
                  <img  :src="item.goods.goodsCoverImg" alt=""  class="shopImg">
                  <div class="cont-index">
                    <h4 class="h4">{{item.goods.goodsName}}</h4>
                    <div class="x">X{{item.number}}</div>
                    <div >
                      <div class="price"><span class="yen">￥</span>{{item.totalPrice}}</div>
                    </div>
                    </div>
                </div>
                <div class="foot" v-if='item.logisticsNo && item.status == 2' style="height:1.7rem;">
                  <div class="time time1" >
                    <p style="font-size:.32rem;line-height:1" >物流信息</p>
                    <div style="color:#808080;font-size:.32rem;margin-left:.3rem;line-height: 1.3">
                      <p>物流名称：{{item.logisticsName}}</p>
                      <p>物流单号：{{item.logisticsNo}} </p>
                      <p>发货时间：{{item.dispatchTime}}</p>
                    </div>
                  </div>
                   <div class="btn">
                    <van-button color="#38CBCE" @click='onClickComfire(item.id)' size="small" style="margin-left:.2rem">确认收货</van-button>
                   </div>
                </div>
                <div class="foot" v-else>
                  <div v-if="item.surplusTime >= 0 && item.status !== 3">
                    <van-count-down
                      class="time" :time="item.surplusTime * 1000"  millisecond format="付款剩余时间 HH:mm:ss"/>
                  </div>
                  <div class="time" v-if='item.status == -1' >取消时间 {{item.cancelTime}}</div>
                  <div class="time" v-if='item.status == 3' > <van-count-down
                      class="time" :time="item.surplusTime * 1000"  millisecond format="自动确认时间 HH:mm:ss"/></div>
                  <div class="time" v-if='item.status == 4' >完成时间 {{item.confirmTime }}</div>
                  <div class="time" v-if='(item.status == 1 || item.status == 2 )&& !item.logisticsNo'>提交时间  {{item.payTime}}</div>
                  <div class="btn">
                    <van-button color="#38CBCE" @click='onClickComfire(item.id)' v-if='item.status == 3' size="small" style="margin-left:.2rem">确认收货</van-button>
                    <van-button color="#38CBCE" @click="onClickShop(item.goods.id)" v-if='item.status == 4' size="small" style="margin-left:.2rem">再次购买</van-button>
                    <van-button color="#38CBCE" @click="onClickShop(item.goods.id)" v-if='item.status == -1' size="small" style="margin-left:.2rem" >重新购买</van-button>
                    <van-button color="#38CBCE" v-if='item.status == 0'  @click="onClickPay(item)" size="small" style="margin-left:.2rem">付款</van-button>
                  </div>
                </div>

              </li>
            </ul>
         </div>
         </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>

    <!-- 导航底部 -->
      <BottomTab :active='active' :actives='actives'></BottomTab>
  </div>
</template>

<script>
import BottomTab from '@/components/footer'
import { getDate } from '@/utils/date'
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      img: [],
      loading: false,
      finished: false,
      shopBanner: [],
      hasNext: false,
      page: 1,
      list: [{name: '全部', id: ' '}, {name: '待付款', id: '0'}, {name: '待收货', id: 123}, {name: '已完成', id: 4}, {name: '已取消', id: -1}],
      isLoading: false,
      show: false,
      showShare: false,
      actives: false,
      item: {},
      name: '',
      active: 2
    }
  },
  components: {
    BottomTab
  },
  created () {
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
    this.fromList()
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
    handleDetails (id) {
      this.$router.push({path: '/shopDetails', query: {id: id}})
    },
    fromList (status, page) {
      this.$http({
        url: this.$http.adornUrl('/h5/order/fetchUserOrders'),
        method: 'get',
        params: {page: page, limit: 20, status: status}
      }).then(({data}) => {
        if (data.code === 'ok') {
          for (let i = 0; i < data.data.content.length; i++) {
            data.data.content[i].orderTime = getDate(data.data.content[i].orderTime, 'yyyy-MM-dd hh:mm:ss')
            data.data.content[i].payTime = getDate(data.data.content[i].payTime, 'yyyy-MM-dd hh:mm:ss')
            data.data.content[i].confirmTime = getDate(data.data.content[i].confirmTime, 'yyyy-MM-dd hh:mm:ss')
            data.data.content[i].cancelTime = getDate(data.data.content[i].cancelTime, 'yyyy-MM-dd hh:mm:ss')
            data.data.content[i].dispatchTime = getDate(data.data.content[i].dispatchTime, 'yyyy-MM-dd hh:mm:ss')
          }
          if (data.data.hasNext === true) {
            this.hasNext = true
          }
          this.shopBanner = data.data.content
        }
      })
    },
    onClick (name, title) {
      this.name = name
      this.status = name
      this.fromList(name, 1)
    },
    // 付款
    onClickPay (item) {
      this.$router.push({path: '/payMent', query: {id: item.id, goodsName: item.goods.goodsName, goodsCoverImg: item.goods.goodsCoverImg, marketPrice: item.goods.marketPrice, totalPrice: item.totalPrice, orderNo: item.orderNo, addressContact: item.addressContact, addressPhone: item.addressPhone, number: item.number, addressId: item.addressId, address: item.address, curUrl: location.href}})
    },
    // 确认收货
    onClickComfire (id) {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定要收货吗？',
        confirmButtonColor: '#38CBCE'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/h5/order/completeOrder'),
          method: 'post',
          params: {orderId: id}
        }).then(({data}) => {
          this.fromList(this.name)
        })
      }).catch(() => {
      })
    },
    // 再次购买/重新购买
    onClickShop (id) { this.$router.push('/shopDetails?id=' + id) },
    onRefresh () {
      this.fromList(this.name, 1)
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
            url: this.$http.adornUrl('/h5/order/fetchUserOrders'),
            method: 'get',
            params: {page: this.page, limit: 20, status: this.status}
          }).then(({data}) => {
            if (data.code === 'ok') {
              for (let i = 0; i < data.data.content.length; i++) {
                data.data.content[i].orderTime = getDate(data.data.content[i].orderTime, 'yyyy-MM-dd hh:mm:ss')
                data.data.content[i].payTime = getDate(data.data.content[i].payTime, 'yyyy-MM-dd hh:mm:ss')
                data.data.content[i].confirmTime = getDate(data.data.content[i].confirmTime, 'yyyy-MM-dd hh:mm:ss')
                data.data.content[i].cancelTime = getDate(data.data.content[i].cancelTime, 'yyyy-MM-dd hh:mm:ss')
                data.data.content[i].dispatchTime = getDate(data.data.content[i].dispatchTime, 'yyyy-MM-dd hh:mm:ss')
                this.shopBanner.push(data.data.content[i])
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
.page{
  position: relative;

}
.van-notice-bar__left-icon, .van-notice-bar__right-icon,.van-icon-volume:before{
  color: #38CBCE
}
  .err{
    margin: 1.5rem auto 0;
    text-align: center;
    img{
      width: 80%;
    }
  }
  .list{
    margin-bottom: 1.5rem;
    .listUl-li {
    padding: 0.3rem 0.3rem 0 0.3rem;
    background: #fff;
    margin-bottom: 10px;
    .order {
  margin-bottom: 0.25rem;
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
    .cont {
      display: flex;
      border-bottom: 1px solid #f5f5f5;
      padding-bottom: .1rem;
      .shopImg {
        width: 2.4rem;
        height: 2.4rem;
        margin-right: 0.25rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .cont-index {
        position: relative;
        width: 80%;
        .h4 {
          font-size: 0.38rem;
          color: #404040;
          font-weight: 400;
          line-height: 1.3;
          margin: 0.1rem 0 0.6rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .x{
          position: absolute;
          left: 5px;
          top:1.15rem;
          color: #BFBFBF;
          font-size: .3rem;
        }
        .cash {
          font-size: 0.3rem;
          color: #999;
        }
        .price {
          color: #ef0f0f;
          font-size: 0.48rem;
          font-weight: bold;
          margin-top: 1rem;
          .yen {
            font-weight: 400;
            font-size: 0.25rem;
          }
          .fu {
            font-weight: 400;
            font-size: 0.3rem;
            color: #404040;
          }
        }
      }
    }
    .foot {
      height: 1.2rem;
      line-height: 1.2rem;
      display: flex;
      justify-content: space-between;
      .time {
        font-size: 0.29rem;
        line-height: 1.2rem;
        color: #999;
      }
      .time1{
        // height: 1.2;
        padding: .3rem 0;
         display: flex;
      }
    }
  }
  }
.van-notice-bar__left-icon,{
  color: #38CBCE !important;
}
.van-icon-volume:before{
   color: #38CBCE !important;
}
.van-tabs__line{
  background-color:#38CBCE !important
}
.van-button--small {
  border-radius: 20px;
}
</style>
