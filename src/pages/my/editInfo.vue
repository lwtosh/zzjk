<template>
  <div class="app">
    <div class="cont">
      <van-cell title="头像" style="line-height:40px">
         <template slot="default">
           <van-uploader :after-read="afterRead">
          <img class="userMin" v-if='avatar' :src="avatar" alt="">
          <img class="userMin" v-else :src=" require('@/assets/userMin.png')" alt="">
          <van-icon name="arrow" />
           </van-uploader>
          </template>
      </van-cell>
      <van-cell title="用户ID" :value="id" style="padding:13px 16px"/>
      <van-cell title="用户名" :value="nickname" style="padding:13px 16px" is-link @click="onClickName"/>
      <van-cell title="性别" is-link  :value='sex' style="padding:13px 16px" @click="Onsex"/>
    </div>
    <div class="btn" @click="onSave">保存</div>
    <van-popup v-model="show" position="bottom">
     <van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm"/>
   </van-popup>
   <van-dialog v-model="showName" title="" show-cancel-button @confirm='onconfirm' confirmButtonColor='#38CBCE'>
     <van-field v-model="nickname" clearable label="用户名" placeholder="请输入用户名"/>
    </van-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      show: false,
      name1: '',
      showName: false,
      avatar: '',
      columns: [{text: '女', id: 2}, {text: '男', id: 1}],
      nickname: '请输入用户名',
      sex: '',
      sexs: '',
      id: '',
      endpoint: ''
    }
  },
  created () {
    var url = location.href
    var obj = {
      title: '至真健康', // 分享标题
      desc: '人人精气神，必备久宗丹',
      linkUrl: location.href + '&inviteCode=' + Vue.cookie.get('inviteCode'),
      img: 'https://h5.zzjk99.com/zzShop/logo.png'// 分享内容显示的图片
    }
    sdk.getJSSDK(url, obj)
    this.list()
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
          this.nickname = data.data.nickName
          this.avatar = data.data.avatar
          if (data.data.sex === 1) {
            this.sex = '男'
          } else if (data.data.sex === 2) {
            this.sex = '女'
          } else {
            this.sex = ''
          }

          this.id = data.data.id
        }
      })
      this.$http({
        url: this.$http.adornUrl('/h5/auth/getAliStsRole'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          this.endpoint = data.data.endpoint + '/' + data.data.bucket + '/'
        }
      })
    },
    // 输入用户名
    onClickName () { this.showName = true },
    onconfirm () { this.showName = false },
    // 保存
    onSave () {
      if (this.nickname === '') {
        this.$toast('请输入你的昵称')
      } else {
        this.$http({
          url: this.$http.adornUrl('/h5/user/updateUser'),
          method: 'post',
          params: {
            avatar: this.avatar, nickname: this.nickname, sex: this.sexs
          }
        }).then(({data}) => {
          if (data.code === 'ok') {
            this.$toast('用户信息保存成功')
            this.$router.go(-1)
          }
        })
      }
    },
    name () {},
    Onsex () { this.show = true },
    onConfirm (value) {
      this.sex = value.text
      this.sexs = value.id
      this.show = false
    },
    // 上传头像
    afterRead (file) {
      this.$http({
        url: this.$http.adornUrl('/h5/auth/getAliStsRole'),
        method: 'get'
      }).then(({data}) => {
        if (data.code === 'ok') {
          var OSS = require('ali-oss')
          if (data.data.region.indexOf('oss-') === -1) {
            data.data.region = 'oss-' + data.data.region
          }
          var client = new OSS({
            region: data.data.region,
            accessKeyId: data.data.credential.accessKeyId,
            accessKeySecret: data.data.credential.accessKeySecret,
            stsToken: data.data.credential.securityToken,
            bucket: data.data.bucket,
            secure: true
          })
          var suffix = file.file.name.substring(file.file.name.lastIndexOf('.'), file.file.name.length)
          client.multipartUpload('user/' + new Date().getTime() + suffix, file.file).then((result) => {
            this.avatar = result.res.requestUrls[0].split('?')[0]
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.app{
  width: 100%;
  height: 100vh;
  background: #fff;
}
.cont{
  padding-top: .6rem;
}
.van-cell:not(:last-child)::after{
  right: 16px;
}
.userMin{
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  vertical-align: -17px;
}
.btn{
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 1.2rem;
  line-height: 1.2rem;
  color: #fff;
  background:#38CBCE;
  font-size: .37rem;
  text-align: center;
}
.van-field__control,.van-cell__value{
  text-align: right !important;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  // width: 120px;
  // height: 120px;
  background-color: #fff;
}
</style>
