<template>
  <div class="page">
     <!-- <van-nav-bar v-if="isShow" title="详情"  left-text="" left-arrow fixed @click-left="onClickLeft" >
   </van-nav-bar> -->
   <div class="hader">
     <div class="back" @click="onClickLeft"><img :src="require('@/assets/arr.png')" alt="" srcset=""></div>
     <div class="share" @click="onClickShare" v-if='share'><img :src="require('@/assets/a.png')" alt="" srcset=""></div>
   </div>
  <van-swipe @change="onChange" :auto="3000" class="banner" indicator-color="#38CBCE">
  <van-swipe-item v-for="(item,index) in imgUrl1" :key="index">
          <img :src="item" :alt="item">
  </van-swipe-item>
  </van-swipe>
  <!-- 标题 -->
  <div class="text">
    <div class="text-index">
      <div class="">
       <div class="price"><span class="yen">￥</span>{{dataList.salePrice < 10000 ? dataList.salePrice:parseFloat((dataList.salePrice / 10000)) + '万' }}  <span class="m">￥{{dataList.marketPrice}}</span> </div>
      </div>
      <div >
        已卖出{{dataList.saleNumber || 0}}件
      </div>
    </div>
    <div class="text-index1">
      <div class="title">{{dataList.goodsName}}</div>
    </div>

  </div>
  <!-- 详情 -->
  <div class="cont">
    <div class="detail">
      <p class="detail-1">商品详情</p>
      <p class="detail-2"></p>
      <p class="detail-3">PRODUCT   DETAILS</p>
    </div>
   <div class="tetCont" v-if='dataList.goodsDetailImgs'>
     <p style="font-size:.37rem; line-height: 2">商品信息</p>
     <p>{{dataList.goodsDetail}}</p>
   </div>
  </div>
  <div class="img"   >
    <img :src="item" :alt="item" v-for="(item,index) in imgUrl2" :key="index">
  </div>
  <div class="box">
    <div class="home" @click="onClickLeft">
      <van-icon name="wap-home-o" class="home-o"/>
      <p class="homeText">首页</p>
    </div>
    <div class="btn" @click="payMent"> 立即购买</div>
  </div>

  <van-popup v-model="show" round position="bottom" :style="{ height: '3.6rem' }">
   <p class="dao">分享到</p>
   <div class="wrap">
    <div class="items" @click="onClickFir">
      <img :src="require('@/assets/wei.png')" alt="">
      <p class="items-text">微信好友</p>
    </div>
    <div class="items" @click="onClickFir">
      <img :src="require('@/assets/wei1.png')" alt="">
      <p class="items-text">朋友圈</p>
    </div>
    <div class="items" @click="onClickFir">
      <img :src="require('@/assets/qq.png')" alt="">
      <p class="items-text">QQ好友</p>
    </div>
    <div class="items" @click="onClickFir">
      <img :src="require('@/assets/qq1.png')" alt="">
      <p class="items-text">QQ空间</p>
    </div>
   </div>
  </van-popup>
  <div class="show" v-if="showShare" @click="onclickHide">
    <div class="share">
       <img class="fenxiang" :src="require('@/assets/shareArr.png')" alt="">
      <div class="textShare">
        <p>点击右上角“ ... ”</p>
        <p>分享给朋友吧！</p>
      </div>
      </div>
  </div>
  </div>
</template>

<script>
import sdk from '../sdk'
import Vue from 'vue'
export default {
  data () {
    return {
      imgUrl1: [require('@/assets/morenPro1.png')],
      imgUrl2: [require('@/assets/morenPro1.png')],
      current: 0,
      show: false,
      showShare: false,
      share: true,
      dataList: [],
      falg: false,
      isShow: false
    }
  },
  created () {
    this.$cookie.set('id', this.$route.query.id)
    this.list()
    if (this.$route.query.inviteCode) {
      this.$cookie.set('inviteCode ', this.$route.query.inviteCode)
    }
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.includes('micromessenger')) {
      this.share = true
    } else {
      this.share = false
    }
  },
  mounted () {
    // 监听页面滚动事件
    // window.addEventListener('scroll', this.handleScroll)
    // 第二种方法
    if (window.performance.navigation.type === 1) {
    } else {
      this.falg = true
    }
  },
  methods: {
    payMent () {
      this.$router.push({path: '/payMent', query: {id: this.dataList.id, goodsName: this.dataList.goodsName, goodsCoverImg: this.dataList.goodsCoverImg, totalPrice: this.dataList.salePrice, orderNo: this.dataList.orderNo, status: this.dataList.goodsType}})
    },
    list () {
      this.$http({
        url: this.$http.adornUrl('/h5/mall/fetchGoodsById'),
        method: 'get',
        params: {goodsId: this.$route.query.id}
      }).then(({data}) => {
        this.dataList = data.data
        this.imgUrl1 = data.data.goodsImgs.split(',')
        this.imgUrl2 = data.data.goodsDetailImgs.split(',')
        document.title = this.dataList.goodsName
      })
    },
    // handleScroll () {
    //   if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 150) {
    //     this.isShow = true
    //   } else {
    //     this.isShow = false
    //   }
    // },
    onClickShare () {
      this.show = true
    },
    onclickHide () {
      this.showShare = false
    },
    onClickFir () {
      var url = location.href
      var url1 = 'http://h5.zzjk99.com/zzShop/index.html#/shopDetails'
      var url2 = '?id=' + this.$route.query.id
      var url3 = '&inviteCode=' + Vue.cookie.get('inviteCode')
      var obj = {
        title: this.dataList.goodsName, // 分享标题
        desc: '人人精气神，必备久宗丹',
        linkUrl: url1 + url2 + url3,
        img: this.dataList.goodsCoverImg// 分享内容显示的图片
      }
      sdk.getJSSDK(url, obj)
      this.show = false
      this.showShare = true
    },
    onChange (index) {
      this.current = index
    },
    onClickLeft () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
.banner{
  height: 9rem;
  img{
    min-width: 100%;
    max-width: 100%;
    height: 100%;
  }
}
.page{
  position: relative;
}
.hader{
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 99;
  height: 1rem;
  line-height: 1rem;
  width: 95%;
  padding: .2rem;
  .back,.share{
    img{
      width: 65%;
    }
  }
  .share{
    text-align: right
  }
}
.custom-indicator{
      position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    color: #fff;
    font-size: 12px;
    border-radius: 10px;
    background: #969799;
}
.box{
  position: fixed;
  bottom: 0;
  height: 1.2rem;
  display: flex;
  justify-content: space-around;
  width: 100%;
  text-align: center;
  .home{
    width: 25%;
    background: #fff;
    color: #808080;
    font-size: .26rem;
    .home-o{
      margin-top: .2rem;
      font-size: .5rem;
    }
  }
}
.btn{
  width: 75%;
  line-height: 1.2rem;
  background: #38CBCE;
  color: #fff;
  font-size: .4rem;
}
.text{
  padding:.2rem .3rem ;
  background: #fff;
  .price{
          color: #EF0F0F;
          font-size: .48rem;
          font-weight: bold;
          .yen{
            display: inline-block;
            font-size: .2rem;
          }
          .m{
            text-decoration: line-through;
            color: #808080;
            font-size: .23rem;
            font-weight: 400
          }
    }
    .text-index{
      font-size: .3rem;
      color: #B3B3B3;
      line-height: 1.5;
      display: flex;
      justify-content: space-between;
      margin-bottom: .2rem;
    }
    .text-index1{
      display: flex;
      justify-content: space-between;
      .title{
        width: 85%;
        font-size: .38rem;
         color: #404040;
         font-weight: 400;
         line-height: 1.5;
          overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
      }
      .share-iocn{
        width: 1rem;
        text-align: center;
        img{
          width:  70%;
        }
      }
    }
}
.cont{
  padding:.2rem .3rem ;
  background: #fff;
  margin-top: .2rem;
  .detail{
    text-align: center;
    padding-bottom: .3rem;
    border-bottom: 1px solid #f5f5f5;
    .detail-1{
      font-size: .37rem;
      margin-bottom: 5px;
    }
    .detail-2{
      height: 3px;
      width: .66rem;
      background: #38CBCE;
      border-radius: 2px;
      margin: auto
    }
    .detail-3{
      margin-top: 5px;
      font-size: .24rem;
      color: #B3B3B3;
    }
  }
  .tetCont{
    padding: .25rem .3rem;
    border-radius: 10px;
    font-size: .32rem;
    color: #404040;
    line-height: 1.5
  }
}
.show{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: hsla(0,0%,5%,.7) no-repeat;
 .share{
  margin-top: .5rem;
  color: #fff;

  .textShare{
    float:right;
    line-height: 1.5;
     font-size: .42rem;
  }
  .fenxiang{
    float: right;
    margin-left: .5rem;
    width: 2rem;
  }
 }
}

.img{
  width: 100%;
  margin-bottom: 1.15rem;
  img{
    width: 100%;
  }
}
.van-nav-bar .van-icon{
  color: #404040;
  font-size: .55rem;
}
.van-nav-bar{
  height: 1.17rem;
  line-height: 1.17rem;
}
.van-nav-bar__title{
   color: #404040;
}
.dao{
 margin-top: .5rem;
 margin-left: .3rem;
 margin-bottom: .4rem
}
.wrap{
  display: flex;
  justify-content: space-around;
  text-align: center;
  .items{
    font-size: .3rem;
    img{
      width: 50%;
    }
    .items-text{
      line-height: 1.5
    }
  }
}
</style>
