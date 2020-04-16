<template>
  <div>
    <van-cell-group>
      <van-field v-model="message" rows="2" label-width='100px' autosize clearable label="问题/意见描述" type="textarea"  maxlength="300"
      placeholder="烦请您如实填写反馈的内容/意见或者建议，以便我们更好的 为您解决问题" show-word-limit style="margin-bottom:10px;"/>
    </van-cell-group>
    <van-cell-group>
      <van-field v-model="ipnoe" autosize  label-width='100px' label="联系方式(选填)" clearable type="tel"  maxlength="11" placeholder="请留下您的联系方式,我们可能联系您!" style="margin-bottom:10px;"/>
    </van-cell-group>
    <div class="btn" @click="onSave">提交</div>
  </div>
</template>
<script>
import Vue from 'vue'
import sdk from './../sdk'
export default {
  data () {
    return {
      message: '',
      ipnoe: ''
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
  },
  methods: {
    onSave () {
      if (this.message === '') {
        this.$toast('请填写反馈的内容/意见或者建议')
      } else {
        // this.$http({
        //   url: this.$http.adornUrl('/user/userOpinion'),
        //   method: 'post',
        //   params: {
        //     content: this.message, ipnoe: this.ipnoe
        //   }
        // }).then(({data}) => {
        //   if (data.code === 'ok') {
        this.$toast('谢谢您的建议')
        this.$router.go(-1)
        //   }
        // })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell{
  display: block
}
.van-field__body,.van-field__control{
  padding: .2rem 0;
}
.label{
   width:100px;
}
.btn{
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 1.2rem;
  line-height: 1.2rem;
  color: #fff;
  background:#38CBCE;
  font-size: .4rem;
  text-align: center;
}
</style>
