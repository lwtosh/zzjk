<template>
  <div>
    <div class="header">
      <div class="inte">
       <div class="text" v-if='userId === otherId'>
           <img class="userDa" v-if='dataInfo.avatar' :src="dataInfo.avatar" alt="">
           <img class="userDa" v-else src="~@/assets/userDa.png" alt="">
           <p class="title">{{dataInfo.nickName}}(ID:{{dataInfo.id}})</p>
       </div>
       <div class="text2" v-else >
           <img class="userDa" style="float: left;" v-if='dataInfo.avatar' :src="dataInfo.avatar" alt="">
           <img class="userDa" style="float: left;" v-else src="~@/assets/userDa.png" alt="">
           <div style="float: left;margin-top:.18rem;margin-left:.2rem">
              <p class="title" >{{dataInfo.nickName}}</p> <p>ID:{{dataInfo.id}}</p>
           </div>
           <div class="banck" @click="onBack">返回首页</div>
       </div>
      </div>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad">
      <div class="main">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="暂无数据"
          @load="onLoad"
        >
          <err v-if="dataList.length == 0"/>
          <div class="list" v-else>
            <p class="title1" v-if='userId === otherId'>我的的伙伴列表</p>
            <p class="title1" v-else>TA的伙伴列表</p>
            <ul class="listUl">
              <li class="listUl-li" v-for="(item,index) in dataList" :key="index" @click="onClickUser(item.id)">
                <div>
                  <img v-if='item.avatar' class="useravr" :src="item.avatar" alt="">
                  <img class="useravr" v-else :src="require('@/assets/userMin.png')" alt="">
                </div>
                <div class="user">
                  <div class="user-left">
                    <div class="name">{{item.nickName}}</div>
                    <div class="tel">ID:{{item.id}}</div>
                  </div>
                  <div v-if='userId === otherId'>
                    <div class="user-right" v-if='item.locParentTeamType == 0'>
                      <van-button color="#38CBCE" size="small" @click.stop="onClick(item.id)" style="margin-left:.2rem">设置部门</van-button>
                    </div>
                    <div class="user-right" v-if='item.locParentTeamType == 1' >市场一部</div>
                    <div class="user-right" v-if='item.locParentTeamType == 2'>市场二部</div>
                  </div>

                </div>
              </li>
            </ul>
          </div>
        </van-list>
      </div>
      </van-list>
    </van-pull-refresh>
    <van-overlay :show="show" @click="show = false" >
      <div class="wrap" >
        <div class="box" @click.stop>
        <div class="set">设置市场部门</div>
        <div class="box1">
          <van-radio-group v-model="radio" checked-color='#38CCCF' >
          <van-cell-group>
             <van-cell title="市场一部" clickable @click="radio = '1'">
              <van-radio slot="right-icon" name="1" />
             </van-cell>
              <van-cell title="市场二部" clickable @click="radio = '2'">
                <van-radio slot="right-icon" name="2" />
               </van-cell>
           </van-cell-group>
          </van-radio-group>
          <div class="bnt" @click="onClick2">确 定</div>
        </div>

      </div>
      </div>

    </van-overlay>

  </div>
</template>

<script>
import Vue from 'vue'
import sdk from './../sdk'
import err from '@/components/err'
export default {
  data () {
    return {
      loading: false,
      show: false,
      dataInfo: '',
      finished: false,
      isLoading: false,
      page: 1,
      hasNext: false,
      otherId: '',
      radio: '',
      delId: '',
      dataList: []
    }
  },
  components: {
    err
  },
  created () {
    if (Vue.cookie.get('userId')) {
      this.userId = Vue.cookie.get('userId')
      this.otherId = Vue.cookie.get('userId')
    }
    var url = location.href
    var obj = {
      title: '至真健康', // 分享标题
      desc: '人人精气神，必备久宗丹',
      linkUrl: location.href + '&inviteCode=' + Vue.cookie.get('inviteCode'),
      img: 'https://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    }
    sdk.getJSSDK(url, obj)
    this.list(this.userId, 1)
  },
  methods: {
    list (userId, page) {
      this.$http({
        url: this.$http.adornUrl('/h5/user/fetchTinyUser'),
        method: 'get',
        params: {
          userId: userId
        }
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.dataInfo = data.data
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/user/fetchUserSubList'),
        method: 'get',
        params: {
          userId: userId, page: page, limit: 20
        }
      }).then(({data}) => {
        if (data.code === 'ok') {
          if (data.data.hasNext === true) {
            this.hasNext = true
          }
          this.dataList = data.data.content
        }
      })
    },
    onClickUser (id) {
      this.otherId = id
      this.list(id, 1)
    },
    onClick (id) {
      this.delId = id
      this.show = true
    },
    onBack () { this.$router.replace('/') },
    onClick2 () {
      if (this.radio === '') {
        this.$toast('请选择市场部门')
      } else {
        this.$http({
          url: this.$http.adornUrl('/h5/user/allotUserPart'),
          method: 'post',
          params: {
            userId: this.delId, targetTeam: this.radio
          }
        }).then(({data}) => {
          if (data.code === 'ok') {
            this.show = false
            this.onRefresh()
          }
        })
      }
    },
    onRefresh () {
      this.onLoad()
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
            url: this.$http.adornUrl('/h5/user/fetchUserSubList'),
            method: 'get',
            params: {page: this.page, limit: 20, userId: this.userId === this.otherId ? this.userId : this.otherId}
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
.header{
  background: #fff;
}
.van-button--small{
  border-radius: 20px;
}
.inte{
  width: 100%;
  height: 4.18rem;
  background: url('~@/assets/partner.png') no-repeat;
  background-size: 100% 100%;
  .text,.text2{
    text-align: center;
    padding-top:.9rem;
    color: #fff;
      .title{
        font-size: .34rem;
        line-height: 2
      }
      .userDa{
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
     }
  }
  .text2{
    text-align: left;
    padding: .9rem .3rem 0 .3rem;
  }
}
.title1{
line-height: 2.5;
font-size: .37rem
}
.list {
  padding: 0.3rem;
  background: #fff;
  .listUl-li {
    padding: 0.3rem 0.3rem 0 .3rem;
    margin-bottom: 10px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    .useravr{
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .user{
      margin-left: .3rem;
      display: flex;
      width: 100%;
      justify-content: space-between;
      .user-left{
        .name{
          font-size: .32rem
        }
        .tel{
          font-size: .32rem;
          color: #999;
        }
      }
      .user-right{
         font-size: .32rem
      }

    }
  }
}
.listUl-li:last-child{
  border-bottom: 0;
}
.wrap{
    display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .box{
     width: 80%;
     background: #fff;
  }
  .box1{
    padding: 0 .3rem;
  }
   .set{
     height: 1.3rem;
    line-height: 1.3rem;
    background: #38CCCF;
    text-align: center;
    font-size: .37rem;
    color: #fff;
   }
.bnt{
  height: 1rem;
  line-height: 1rem;
  background: #38CCCF;
  text-align: center;
  border-radius: 20px;
  font-size: .37rem;
  margin-bottom: .4rem;
   color: #fff;
}
}
.banck{
  float: right;
  padding: .15rem .3rem;
  border:1px solid #fff;
  margin-top: .5rem;
  border-radius: 20px;
}
</style>
