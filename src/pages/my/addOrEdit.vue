<template>
  <div class="app">
     <van-cell-group>
         <van-field v-model="addInfo.consignee"  label="收货人"  placeholder="请输入收货人姓名"/>
         <van-field v-model="addInfo.phone"  label="手机号" type='number' maxlength='11' placeholder="请输入收货人联系电话"/>
         <div @click="ares" class="ares">
           <p class="label">所在的</p>
           <p class="orgen">{{addInfo.orgen || '请选择省市区'}}</p>
           </div>
         <van-field v-model="addInfo.address"  label="详细地址" placeholder="如道路、门牌号、小区 楼栋号 单元室等"/>
         <van-field v-model="addInfo.postcode"  label="邮    编" type='number'  maxlength='6' placeholder="请输入邮政编码"/>
          <van-cell-group style="margin-top:0">
            <van-switch-cell  v-model="checked" title="设为默认地址" active-color='#38CBCE' @change='onchange'/>
         </van-cell-group>
      </van-cell-group>
      <div class="new1" @click="onSave">保存并使用</div>
      <van-popup v-model="show1" position="bottom" :style="{ height: '35%' }">
       <van-area
        :area-list="areaList"
        :columns-num="3"
        @confirm="onAddrConfirm"
        @cancel="onAddrCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import AreaList from './area'
export default {
  data () {
    return {
      show1: false,
      areaList: AreaList,
      checked: '',
      addInfo: {
        orgen: '请选择省市区',
        phone: '',
        isDefault: '',
        address: '',
        province: '',
        city: '',
        county: '',
        consignee: '',
        postcode: ''
      }
    }
  },
  watch: {
    'addInfo.isDefault' (newValue, oldValue) {
      if (newValue === 1) {
        this.checked = true
      } else {
        this.checked = false
      }
    }
  },
  created () {
    if (this.$route.query.item) {
      this.addInfo = this.$route.query.item
      this.addInfo.orgen = this.$route.query.item.province + this.$route.query.item.county + this.$route.query.item.city
    } else {

    }
  },
  methods: {
    onAddrConfirm (val) {
      this.show1 = false
      this.addInfo.orgen = val[0].name + ' ' + val[1].name + ' ' + val[2].name
      this.addInfo.county = val[1].name
      this.addInfo.province = val[0].name
      this.addInfo.city = val[2].name
    },
    onAddrCancel () {
      this.show1 = false
    },
    onchange (val) {
      if (val === false) {
        this.addInfo.isDefault = 0
      } else {
        this.addInfo.isDefault = 1
      }
    },
    ares () {
      this.show1 = true
    },
    onSave () {
      if (this.addInfo.consignee === '') {
        this.$toast('请输入名字')
      } else if (this.addInfo.phone.toString().length < 11) {
        this.$toast('请输入正确电话号码')
      } else if (this.addInfo.orgen === '') {
        this.$toast('请输入所在地')
      } else if (this.addInfo.address === '') {
        this.$toast('请输入详细地址')
      } else {
        if (!this.$route.query.item) {
          this.$http({
            url: this.$http.adornUrl('/h5/user/addUserAddress'),
            method: 'post',
            params: this.addInfo
          }).then(({data}) => {
            if (data.code === 'ok') {
              this.$router.go('-1')
            } else {
              this.$toast(data.message)
            }
          })
        } else {
          this.$http({
            url: this.$http.adornUrl('/h5/user/updateUserAddress'),
            method: 'post',
            params: this.addInfo
          }).then(({data}) => {
            if (data.code === 'ok') {
              this.$router.go('-1')
            } else {
              this.$toast(data.message)
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.app{
  background: #fff;
  height: 100vh;
}
.van-cell-group{
  // margin-top: 1rem
}
.van-cell-group,.van-cell{
  background: #fff;
}
.new1{
   height: 1.12rem;
   line-height: 1.12rem;
   width:100%;
   position: fixed;
   bottom: 0;
   text-align: center;
   color: #fff;
   background: #38CBCE;
   font-size: .4rem;
   margin-top: 1rem;
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
</style>
