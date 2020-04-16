<template>
  <div>
     <van-cell-group>
         <div @click="ares" class="ares">
           <p class="label">银行名称:</p>
           <p class="orgen">{{name || '请选择银行'}}</p>
           </div>
         <van-field v-model="addInfo.bankNo"  label="银行卡号:" type='number'  placeholder="请输入银行卡号" maxlength='19'/>
         <van-field v-model="addInfo.phone"  label="预留手机号:" type='number'  maxlength='11' placeholder="请输入银行预留手机号码"/>
      </van-cell-group>
      <p class="info">注意:添加的银行卡，需实名认证的名称的银行卡。</p>
      <div class="new1" @click="onSave">确认添加</div>
      <van-popup v-model="show1" position="bottom" :style="{ height: '35%' }">
       <van-picker show-toolbar :columns="columns" @cancel="show1 = false" @confirm="onConfirm"/>
    </van-popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show1: false,
      columns: [],
      name: '请选择银行',
      addInfo: {
        bankId: '',
        bankNo: '',
        phone: ''
      }
    }
  },
  created () {
    this.$http({
      url: this.$http.adornUrl('/h5/account/fetchBankConfigs'),
      method: 'get'
    }).then(({data}) => {
      if (data.code === 'ok') {
        for (var i = 0; i < data.data.length; i++) {
          this.columns.push({text: data.data[i].bankName, id: data.data[i].id})
        }
      }
    })
  },
  methods: {
    onConfirm (value) {
      this.name = value.text
      this.addInfo.bankId = value.id
      this.show1 = false
    },
    onAddrCancel () {
      this.show1 = false
    },
    ares () {
      this.show1 = true
    },
    onSave () {
      var regIdNo = /^(13[0-9]|14[4579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (this.name === '') {
        this.$toast('请选择银行卡')
      } else if (this.addInfo.bankNo.toString().length < 15 || this.addInfo.bankNo.toString().length > 19) {
        this.$toast('请输入正确银行卡号')
      } else if (!regIdNo.test(this.addInfo.phone)) {
        this.$toast('请输入正确的手机号码')
      } else {
        this.$http({
          url: this.$http.adornUrl('/h5/account/addUserBank'),
          method: 'post',
          params: this.addInfo
        }).then(({data}) => {
          if (data.code === 'ok') {
            this.$emit('hidden')
            // this.list()
          } else {
            this.$toast(data.message)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.van-cell-group{
  margin-top: 1rem
}
.van-cell-group,.van-cell{
  background: #fff;
}
.new1{
   height: 1.12rem;
   line-height: 1.12rem;
   width:92%;
   margin: auto;
   text-align: center;
   color: #fff;
   background: #38CBCE;
   border-radius: 25px;
   font-size: .4rem;
   margin-top: 1.5rem;
 }
 .ares{
   height: 1.3rem;
   line-height: 1.3rem;
   display: flex;
   border-bottom: 1px solid #f5f5f5;
   font-size: .34rem;
   .label{
     text-align: left;
     padding-left: .5rem;
     width: 30%;
   }
   .orgen{
     width: 91%;
   }
 }
 .info{
   padding: .3rem;
  font-size: .32rem;
  line-height: 1.5
}
</style>
