<template>
  <div>
    <el-cascader v-model="innerValue" v-bind="$props" v-on="$listeners"></el-cascader>
  </div>
</template>
<script>
import {getAmountChinese} from '@/assets/utils'
export default {
  model:{
    prop: 'value',
    event: 'change'
  },
  props:["cmpType", "tag", "tagIcon", "labelWidth", "step-strictly", "controls-position", "regList", "changeTag", "proCondition", "showChinese", "formId", "renderKey", "layout", "value"],
  name: 'fc-amount',
  data(){
    return {
      innerValue: this.value
    }
  },
  computed:{
    chinese(){
      return getAmountChinese(this.innerValue)
    }
  },
  watch:{
    innerValue(val){
      this.$emit('change', +val.toFixed(2))
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