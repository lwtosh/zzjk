<template>
  <div>
    <!-- 导航底部 -->
    <div >
      <van-tabbar v-model="active" route>
  <van-tabbar-item   replace to="/">
    <span>首页</span>
    <img
      slot="icon"
      slot-scope="props"
      :src="props.active ? require('@/assets/tab1Active.png'): require('@/assets/tab1.png')"
    >
  </van-tabbar-item>
  <van-tabbar-item icon="search"  replace to="/info">
    <span>消息</span>
    <img
      slot="icon"
      slot-scope="props"
      v-if='actives === true'
      :src="props.active ? require('@/assets/tab2Active.png'): require('@/assets/tab2.png')"
    >
    <img
      slot="icon"
      slot-scope="props"
      v-else
      :src="props.active ? require('@/assets/infoActive.png'): require('@/assets/infos.png')"
    >
  </van-tabbar-item>
  <van-tabbar-item icon="setting-o"  replace to="/order">
    <span>订单</span>
    <img
      slot="icon"
      slot-scope="props"
      :src="props.active ? require('@/assets/tab3Active.png'): require('@/assets/tab3.png')"
    >
  </van-tabbar-item>
  <van-tabbar-item icon="setting-o"  replace to="/my">
    <span>个人中心</span>
    <img
      slot="icon"
      slot-scope="props"
      :src="props.active ? require('@/assets/tab4Active.png'): require('@/assets/tab4.png')"
    >
  </van-tabbar-item>
</van-tabbar>
    </div>

  </div>
</template>

<script>
export default {
  name: 'BottomTab',
  props: ['actives'],
  data () {
    return {
      active: 0
      // actives: false
    }
  },
  mounted () {
    this.time = setInterval(() => {
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
    }, 10000)
  },
  methods: {
    onchange (name, idnex) {
    }
  }
}
</script>

<style lang="less" scoped>
 .nav-bar {
    position: fixed;
    bottom: 0;
    display: flex;
    width: 100%;
    justify-content: space-around;
    background: #fff;
    font-size: 16px;

    img{
      width: .8rem;
      height: .8rem;
    }
  }
  .van-tabbar-item--active{
    color: #38CBCE;
  }
  .van-tabbar{
    height: 1.3rem;
  }
  .van-tabbar-item__icon img{
    width: .5rem;
    height: .5rem;
  }
</style>
