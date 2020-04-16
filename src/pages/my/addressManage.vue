<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="height: 100vh;">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <err v-if="addInfo.length == 0"/>
    <div class="list" v-else>
      <van-radio-group v-model="radio"  @change="isDetails(radio)">
      <ul v-for="item in addInfo" :key="item.id">
       <van-swipe-cell :on-close="onClose" :name='item.id'>
        <li>
          <div class="left">
            <div class="user">{{item.consignee}}  {{item.phone}}</div>
             <div class="address"><span v-if="item.isDefault == 1">默认</span>{{item.province}}{{item.county}}{{item.city}}{{item.address}}</div>
          </div>
          <div class="right" @click="onClickEdit(item)"><img src="~@/assets/editAdd.png" alt=""></div>
        </li>
        <template slot="right">
             <van-button square color="#38CBCE" text="删除"/>
            </template>
       </van-swipe-cell>
      </ul>
      </van-radio-group>
    </div>
      </van-list>
     </van-pull-refresh>
    <div class="new" @click="add">新增收获地址</div>
  </div>
</template>
<script>
import err from '@/components/err'
import addOrEdit from './addOrEdit'
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      radio: '',
      show: false,
      isLoading: false,
      page: 1,
      finished: false,
      loading: false,
      hasNext: false,
      dataInfo: {},
      addInfo: [],
      mode: 'insert'
    }
  },
  watch: {
    radio (newval) {
    }
  },
  created () {
    this.list(this.page)
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
    addOrEdit,
    err
  },
  methods: {
    list (page) {
      this.$http({
        url: this.$http.adornUrl('/h5/user/fetchUserAddressList'),
        method: 'get',
        params: {
          page: page, limit: 20
        }
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.addInfo = data.data
          const defaultData = data.data.find(item => item.isDefault === 1)
          this.radio = defaultData.id
          if (data.data.hasNext === true) {
            this.hasNext = true
          }
        }
      })
    },
    // 新增
    add () {
      this.mode = 'insert'
      // this.show = true
      this.$router.push('/addOrEdit')
    },
    // 编辑
    onClickEdit (item) {
      this.mode = 'edit'
      this.dataInfo = item
      // this.show = true
      this.$router.push({path: '/addOrEdit?item=', query: {item: item}})
    },
    close () {
      this.dataInfo = {}
      this.list()
    },
    onRefresh () {
      this.list()
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    // 删除
    onClose (clickPosition, instance, detail) {
      switch (clickPosition) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          this.$dialog.confirm({
            message: '确定删除吗？'
          }).then(() => {
            this.onclickDel(detail.name)
          })
          break
      }
    },
    onclickDel (id) {
      this.$http({
        url: this.$http.adornUrl('/h5/user/delUserAddress'),
        method: 'post',
        params: {id: id}
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.list()
        }
      })
    },
    onLoad () {
      setTimeout(() => {
        this.loading = false
        if (this.hasNext === true) {
          this.page = this.page + 1
          this.$http({
            url: this.$http.adornUrl('/h5/user/fetchUserAddressList'),
            method: 'get',
            params: {page: this.page, limit: 20}
          }).then(({data}) => {
            if (data.code === 'ok') {
              for (let i = 0; i < data.data.length; i++) {
                this.addInfo.push(data.data[i])
              }
              const defaultData = data.data.find(item => item.isDefault === 1)
              this.radio = defaultData.id
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
.van-button{
  height: 80px;
}
.list{
  background: #fff;

  ul{
  }
 li{
   padding: .35rem;
   display: flex;
   border-bottom: 1px solid #f5f5f5;
   justify-content: space-between;
   .left{
     width: 80%;
   }
   .user{
     font-size: .37rem;
     margin-bottom: .2rem;
   }
   .address{
     font-size: .32rem;
     color: #999;
       span{
           display: inline-block;
           width: 1rem;
           line-height: 1.4;
           text-align: center;
           color: #fff;
           font-size: .28rem;
           background: #38CBCE;
           border-radius: 12px;
           margin-right: 5px;
         }
   }
   .moren{
     display: flex;
     justify-content: space-between;
     margin-top: .25rem;
     .right{
       .btn{
         display: inline-block;
         width: 1.47rem;
         line-height: .6rem;
         font-size: .32rem;
         color: #737373;
         border-radius: 5px;
         border:1px solid #999;
         text-align: center;
         margin-left: 10px;
       }
     }
   }
   .right{
     width: 0.53rem;height: .53rem;
     margin-top: 15px;
     img{
       width: 100%;
       height: 100%;
     }
   }
 }

}
.new{
   height: 1.12rem;
   line-height: 1.12rem;
   width:100%;
   text-align: center;
   color: #fff;
   background: #38CBCE;
   font-size: .4rem;
   position: fixed;
   bottom: 0;
 }
</style>
