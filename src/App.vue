<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  // mounted () {
  //   document.body.addEventListener('touchmove', e => {
  //     return false
  //   }, false)
  //   this.time = setInterval(() => {
  //     this.$http({
  //       url: this.$http.adornUrl('/h5/other/fetchUserMsgUnReadCount'),
  //       method: 'get'
  //     }).then(({data}) => {
  //       if (data.code === 'ok') {
  //         // console.log('233')
  //         if (data.data > 0) {
  //           this.$cookie.set('info', 1)
  //           this.actives = true
  //         }
  //       }
  //     })
  //   }, 10000)
  // }
}
</script>

<style>
body{
  height: 100%;
  margin: 0;
  background: #F5F5F5;
  color: #404040;
  font-family:PingFang SC, PingFang-SC-Regular,ArialMT;
}
*{
  margin: 0;
  padding: 0;
}
ul{
  list-style: none;
  padding: 0;
}
a{
  color: #404040;
}
</style>
