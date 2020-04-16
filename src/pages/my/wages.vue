<template>
  <div>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="min-height: 100vh;">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
  <err v-if="dataInfo.length == 0"/>
   <van-collapse v-model="activeName" accordion v-else>
    <van-collapse-item v-for='item in dataInfo' :key='item.id' :title="item.month" :name="item.id" :value='item.totalSalary== "" ? "--" :parseInt(item.totalSalary)' size='large'>
      <div class="flie">
        <div class="c-1">
          <p class="mun">{{item.performanceAward== "" ? "--" :parseInt(item.performanceAward)}}</p>
          <p class="desc">费用补贴</p>
        </div>
        <div class="c-1">
          <p class="mun">{{item.teamAward== "" ? "--" :parseInt(item.teamAward)}}</p>
          <p class="desc">绩效奖金</p>
       </div>
        <div class="c-1">
          <p class="mun">{{item.baseAward== "" ? "--" :parseInt(item.baseAward)}}</p>
          <p class="desc">责任底薪</p>
        </div>
      </div>
    </van-collapse-item>
   </van-collapse>
    </van-list>
   </van-pull-refresh>
  </div>
</template>
<script>
import err from '@/components/err'
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      activeName: '1',
      dataInfo: [],
      finished: false,
      page: 1,
      hasNext: false,
      loading: false,
      isLoading: false
    }
  },
  components: {
    err
  },
  created () {
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
    this.list(this.page)
  },
  methods: {
    list (page) {
      this.$http({
        url: this.$http.adornUrl('/h5/account/fetchMySalaryList'),
        method: 'get',
        params: {
          page: page, limit: 20
        }
      }).then(({data}) => {
        for (let i = 0; i < data.data.content.length; i++) {
          data.data.content[i].month = data.data.content[i].month.toString().substr(0, 4) + '年' + data.data.content[i].month.toString().substr(4, 6) + '月税前工资'
        }
        if (data.data.hasNext === true) {
          this.hasNext = true
        }
        this.dataInfo = data.data.content
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
            url: this.$http.adornUrl('/h5/account/fetchMySalaryList'),
            method: 'get',
            params: {page: this.page, limit: 20}
          }).then(({data}) => {
            if (data.code === 'ok') {
              for (let i = 0; i < data.data.content.length; i++) {
                data.data.content[i].month = data.data.content[i].month.toString().substr(0, 4) + '年' + data.data.content[i].month.toString().substr(4, 6) + '月税前工资'
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
.van-cell{
  padding: 15px 16px !important;
}
.flie{
padding: .2rem 0;
display: flex;
justify-content: space-around;
text-align: center;
.mun{
  color: #404040;
font-size: .42rem;
font-weight: bold;
}
.desc{
  font-size: .37rem;
  color: #808080;
}
}

.van-cell__value{
  color: #404040;
}
</style>
