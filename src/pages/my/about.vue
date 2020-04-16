<template>
  <div class="app">
    <h3 class="h3">关于我们</h3>
    <p class="desc">湖南至真健康管理有限公司，拥有独立的自主产品。专业从事中医药、养生产品推广和销售，至真健康在多名医学院士、教授、博士牵头组成的核心研发团队带领下，在“辨证论治”的传统中医理论基础上，传承中医养生文化精髓，深入挖掘古代“治未病”的技法，提炼膏摩法养生的精髓，推出一系列药食同源且能有效调理的产品，包括疏通经络主攻肾经的自主产品一一道家久宗丹、中医药透皮吸收膏体一一国家非遗级的筋骨膏等，对肾气提升、滋阴壮阳以及滑膜炎、半月板损伤、类风湿、颈肩腰腿疼等身体不适有着明显的调理作用。产品一经推出，获得广泛市场好评，获得消费者广泛认可。是一家秉承十九大“大健康产业”发展战略，以先进的营销模式和理念为基础，推进大健康产业和从业人员的快速发展，从而实现市场合伙人健康和财富双丰收的目标与理想!</p>
  </div>
</template>
<script>
import Vue from 'vue'
import sdk from './../sdk'
export default {
  created () {
    var url = location.href
    var obj = {
      title: '至真健康', // 分享标题
      desc: '人人精气神，必备久宗丹',
      linkUrl: location.href + '&inviteCode=' + Vue.cookie.get('inviteCode'),
      img: 'https://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    }
    sdk.getJSSDK(url, obj)
  }
}
</script>

<style lang="less" scoped>
.app{
  width: 93%;
  margin: .3rem auto
}
.h3{
  text-align: center;
  font-size: .48rem;
  line-height: 3
}
.desc{
  text-indent: 2em;
  line-height: 1.5;
  font-size: .38rem;
}
</style>
