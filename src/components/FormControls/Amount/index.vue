<template>
  <div class="fc-amount">
    <el-input-number :style="{width: width}" v-model="innerValue" v-bind="$props" v-on="$listeners"></el-input-number>
    <div class="explain-text" v-if="showChinese">大写：{{chinese}}</div>
  </div>
</template>
<script>
import {getAmountChinese} from '@/assets/utils'
export default {
  model:{
    prop: 'value',
    event: 'change'
  },
  props:["cmpType", "tag","tagIcon", "precision", "labelWidth", "step-strictly", "controls", "controls-position", "regList", "changeTag", "proCondition", "showChinese", "formId", "renderKey", "layout", "width"],
  name: 'fc-amount',
  data(){
    return {
      innerValue: this.value
    }
  },
  computed:{
    chinese(){
      return this.showChinese ? getAmountChinese(this.innerValue) : ''
    }
  },
  watch:{
    innerValue(val){
     val && this.$emit('change', +val.toFixed(2))
    },
    value(val){
      this.innerValue = val
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