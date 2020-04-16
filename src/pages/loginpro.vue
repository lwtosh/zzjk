<template>
   <div class="app">
    <div class="teet" >{{msg}}</div>
   </div>
</template>
<script>
export default {
  data () {
    return {
      param: {},
      msg: ' '
    }
  },
  created () {
    this.param = this.$route.query
    this.$cookie.set('id', this.param.id)
    this.$cookie.set('fromUrl', this.param.fromUrl)
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.includes('micromessenger')) {
      this.$cookie.set('platform ', 'WXWEB')
    } else {
      this.$cookie.set('platform ', 'WEB')
    }
    this.$http({
      url: this.$http.adornUrl('/h5/login/fetchLoginRespBySessionKey'),
      method: 'get',
      params: {
        sessionKey: this.param.sessionKey
      }
    }).then(({data}) => {
      if (data.code === 'ok') {
        this.msg = data.message
        if (data.data.isBindMobile === true) {
          this.$cookie.set('token ', data.data.token)
          this.$cookie.set('userId ', data.data.userId)
          if (this.param.fromUrl.indexOf('/register', '?fromUrl=') > 0) {
            var url = decodeURIComponent(this.$route.query.fromUrl).split('?fromUrl=')[1].split('#')[1]
            this.$router.replace(url)
          } else {
            if ((this.param.fromUrl && this.$route.query.fromUrl !== '' && this.param.fromUrl.indexOf('register') < 0 && this.$route.query.fromUrl.indexOf('h5.zzjk99.com/zzShop') > 0)) {
              url = decodeURIComponent(this.$route.query.fromUrl).split('#')[1]
              this.$router.replace(url)
            } else {
              this.$router.replace('/')
            }
          }
        }
        if (data.data.isNew === true) {
          this.$cookie.set('wxLoginId ', data.data.wxLoginId)
          location.href = '//h5.zzjk99.com/zzShop/index.html#/register?inviteCode=' + this.param.inviteCode
        }
      } else if (data.code === 'U46') {
        history.go(-1)
      } else if (data.code === 'U47') {
        window.location.href = '//h5.zzjk99.com/to/toAuth?type=redirect&fromUrl=' + encodeURIComponent(location.href) + '&inviteCode=' + this.param.inviteCode
      } else {
        this.msg = data.message
      }
    })
  }

}
</script>
<style scoped>
.app{
  margin: 80px auto;
}
.teet{
   font-size: 22px;
   font-size: #404040;
   text-align: center;
}
</style>
