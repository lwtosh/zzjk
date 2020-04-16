<template>
  <div>
    <!-- <div class="hader">
      <div class="h5">至真健康</div>
      <div class="yao" @click="onClick1">
        <van-icon name="qr" size='22px' />
        <p class="yaoText">邀请码</p>
      </div>
    </div> -->
   <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <!-- banner -->
    <div v-if="img.length == 0" class="box" >
      <img :src="require('@/assets/morenBanner.png')" alt="" style="width:100%"  class="banner" >
    </div>
    <div class="box"  v-else>
      <van-swipe indicator-color="#38CBCE" style="height: 5.5rem;" :autoplay="3000" >
        <van-swipe-item v-for="(item) in img" :key="item.id"  class="banner">
          <img :src="item.picUrl">
        </van-swipe-item>
      </van-swipe>
    </div>
      <van-notice-bar color="#404040" background="#FFFFFF" style="border-bottom: 1px solid #F5F5F5;">
        <template slot="left-icon">
          <van-icon name="volume" class="vol"/>
        </template>
       <van-swipe  style="height: 20px;width:350px" :show-indicators='false' vertical loop :autoplay="3000">
        <van-swipe-item v-for="(item) in onticeData" :key="item.id">
          <p>{{item.content}}</p>
        </van-swipe-item>
      </van-swipe>
      </van-notice-bar>
      <!-- 各类精选 -->
      <div class="section1">
        <div class="title">
          <h4 class="h4">精品推荐</h4>
        </div>
        <err v-if="dataList.length == 0"/>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="cont">
            <ul class="shopUl1" >
              <li class="shopUl-li1" v-for="(item,index) in dataList" :key="index" @click="handleDetils1(item.id)">
                <img :src="item.goodsCoverImg" alt="" class="shopImg">
                <div class="box-bd">
                  <div class="index-text">{{item.goodsName}}</div>
                <div class="price">
                  <span class="yen">&yen;</span> <span>{{item.salePrice}}</span>
                </div>
                </div>
               </li>
             </ul>
          </div>
        </van-list>
      </div>
      </van-pull-refresh>
    <!-- 导航底部 -->
      <BottomTab :actives='actives'/>
  </div>
</template>

<script>
import err from '@/components/err'
import BottomTab from '@/components/footer'
import sdk from './sdk'
import Vue from 'vue'
export default {
  data () {
    return {
      isLoading: false,
      loading: true,
      page: 1,
      finished: false,
      hasNext: false,
      active: 0,
      actives: false,
      img: [],
      shopBanner: [],
      dataList: [],
      onticeData: []
    }
  },
  components: {
    BottomTab, err
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
    this.list(this.page)
    if (this.$route.query.inviteCode) {
      this.$cookie.set('inviteCode ', this.$route.query.inviteCode)
    }
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
  mounted () {
    this.loading = false
  },
  methods: {
    list (page) {
      this.$http({
        url: this.$http.adornUrl('/h5/home/fetchBanners'),
        method: 'get',
        params: {
          type: 'INDEX'
        }
      }).then(({data}) => {
        this.img = data.data
      })
      this.$http({
        url: this.$http.adornUrl('/h5/other/fetchNoticeList'),
        method: 'get',
        params: {
          page: 1, size: 20
        }
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.onticeData = data.data
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/mall/fetchGoodsList'),
        method: 'get',
        params: {
          page: page, size: 20
        }
      }).then(({data}) => {
        for (var i = 0; i < data.data.content.length; i++) {
          if (data.data.content[i].salePrice > 10000) {
            data.data.content[i].salePrice = parseFloat((data.data.content[i].salePrice / 10000)) + '万'
          }
        }
        this.dataList = data.data.content
        if (data.data.hasNext === true) {
          this.hasNext = true
        }
      })
    },
    handleDetils1 (id) { this.$router.push('/shopDetails?id=' + id) },
    onClick1 () { this.$router.push('/code') },
    onRefresh () {
      this.list()
      setTimeout(() => {
        // this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    onLoad () {
      setTimeout(() => {
        this.loading = false
        if (this.hasNext === true) {
          this.page = this.page + 1
          this.$http({
            url: this.$http.adornUrl('/h5/mall/fetchGoodsList'),
            method: 'get',
            params: {page: this.page, size: 20}
          }).then(({data}) => {
            if (data.code === 'ok') {
              for (let i = 0; i < data.data.content.length; i++) {
                this.dataList.push(data.data.content[i])
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
.van-skeleton__row, .van-skeleton__title{
  // background-color: #fff;
}
.van-search--show-action {
    padding-right: 0;
    position: fixed;
    z-index: 99;
    top: 0;
    left: 50%;
    margin-left: -3.5rem;
    background: transparent;
}
.van-swipe__indicator {
    width: .4rem;
    height: 4px;
    background-color: #ebedf0;
    border-radius: 32%;
}
.van-search__content{
      background-color: transparent;
      border: 1px solid #f5f5f5;
}
.van-notice-bar__left-icon{
  color: #EF0F0F !important;
}
.van-swipe-item{
  // padding: 0 .3rem .4rem 0;
}
.hader{
height: 1.3rem;
line-height: 1.3rem;
background: #38CBCE;
padding: 0 .3rem;
display: flex;
color: #fff;
justify-content: space-between;
.h5{
font-size: .5rem;
font-weight: bold;
letter-spacing:2px;
}
.yao{
  text-align: center
}
.yaoText{
  margin-top: -.3rem;
  font-size: .3rem;
  line-height: 0;
}
}
.box{
    // padding: 0 .3rem;
    // background: #fff url(~@/assets/homeBg.png) no-repeat;
    // background-size: 100% 60%;
}
 .vol{
   color:#38CBCE !important
 }
 .banner {
    img {
      width: 100%;
      height: 100%;
      // border-radius: 10px;
    }
  }
  .err{
    width: 80%;
    margin: auto;
    padding: .2rem 0;
    text-align: center;
    img{
      height: 3rem;
    }
  }
  .section1{
   margin: auto;
  }
  .title{
    height: .4rem;
    line-height: .4rem;
    padding: .2rem .4rem;
    background:linear-gradient(0deg,rgba(245,245,245,1) 0%,rgba(255,255,255,1) 100%);
    .h4{
      display: inline-block;
      font-size: .4rem;
    }
    .more{
      float: right;
      font-size: .29rem;
      color: #404040;
    }
  }
  .shopBanner{
    height: 7.66rem;
  }
  .cont{
      width: 93%;
  //  margin: auto;
   margin: auto;
   margin-bottom: .2rem;
  }
  .shopUl1{
    display: flex;
    color: #404040;
    margin-top: 10px;
    justify-content: space-between;
    flex-wrap: wrap;
    .shopUl-li1{
      width: 49%;
      background: #fff;
      border-radius: 5px;
      position: relative;
      .shopImg{
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        width: 100%;
        height: 4.5rem;
      }
      .box-bd{
        padding: 0 .2rem;
        .index-text{
        padding: .15rem 0;
        font-size: .34rem;
        line-height: 1.5;
        height: .9rem;
         overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        }
        .price{
          color: #EF0F0F;
          font-size: .48rem;
          font-weight: bold;
          margin-bottom: 10px;
          .yen{
            display: inline-block;
            font-size: .2rem;
          }
          span{
            display: inline-block;
          }
          .qi{
            display: inline-block;
            font-size: .25rem;
            font-weight: normal;
            background: #FFE3EE;
            padding: .08rem;
            border-radius: 10px;
          }
        }
      }

    }
    .shopUl-li1{
      margin-bottom: 10px;
    }
  }
  .tip{
    padding: 0px 5px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: #F6A345;
    position: absolute;
    top: .5rem;
    left: 0;
  }
  .hot{
    background: #E41C11;
    color: #fff;
    font-size: .25rem;
  }
  .van-count-down, .van-divider{
    color: #fff;
    font-size: .25rem;
  }
  .van-tabs__nav{
    background:linear-gradient(0deg,rgba(255,255,255,1) 0%,rgba(245,245,245,1) 100%);
  }
</style>

<style scoped>
  /* @import 'css/style.css' */
</style>
