<template>
  <div class="fc-amount">
    <el-input-number v-model="innerValue" v-bind="$props" v-on="$listeners"></el-input-number>
    <div class="explain-text" v-if="showChinese">大写：{{chinese}}</div>
  </div>
</template>
<script>
import {getAmountChinese} from '@/assets/utils'
export default {
  props:[
    "tag",
    "showChinese",
    "formId",
    "formData",
    "expression"
  ],
  name: 'fc-calculate',
  data(){
    return {
      innerValue: this.value
    }
  },
  computed:{
    chinese(){
      return this.showChinese ? getAmountChinese(this.innerValue) : ''
    }
  }
}
</script>
<style lang="stylus" scoped>
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
</style>