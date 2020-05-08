<template>
  <div>
    <el-date-picker v-model="timeRange" v-bind="{...$props, ...$attrs}" v-on="$listeners" ></el-date-picker>
    <div v-if="showDuration" class="explain-text">时长: {{duration}}</div>
  </div>
</template>
<script>
import { timeCalculate } from '@/assets/utils' 
export default {
  model:{
    prop: 'value',
    event: 'change'
  },
  props:["cmpType", "showDuration","tag", "tagIcon", "defaultValue", "labelWidth", "range-separator", "start-placeholder", "end-placeholder", "clearable", "format", "value-format", "regList", "changeTag", "proCondition", "asSummary", "formId", "renderKey", "layout", "value"],
  name: 'fc-date-duration',
  data(){
    return {
      timeRange: this.value,
      duration: ''
    }
  },
  watch:{
    'timeRange':{
      handler:  function(val){
        let res = ''
        if (Array.isArray(this.timeRange)) {
          const [start, end] = this.timeRange.slice(0, 2).map( c => new Date(c).getTime())
          res = timeCalculate(start, end)
        }
        this.duration = res
        this.$emit('change', val)
      },
      immediate: true
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