<template>
  <div>
    <el-time-picker v-model="timeRange" v-bind="{...$props, ...$attrs}" v-on="$listeners" ></el-time-picker>
    <div v-if="showDuration" class="explain-text">时长: {{duration}}</div>
  </div>
</template>
<script>
import { timeCalculate } from '@/utils' 
const defaultVal = ['','']
export default {
  model:{
    prop: 'value',
    event: 'change'
  },
  props:["value", "cmpType", "showDuration", "tag", "tagIcon", "defaultValue", "labelWidth", "clearable", "is-range", "range-separator", "start-placeholder", "end-placeholder", "format", "value-format", "regList", "changeTag", "proCondition", "asSummary", "formId", "renderKey", "layout", "value"],
  name: 'fc-time-duration',
  data(){
    return {
      timeRange: this.value || this.defaultValue || defaultVal ,
      duration: ''
    }
  },
  watch:{
    'timeRange':{
      handler:  function(val){
        let res = ''
        if (Array.isArray(this.timeRange)) {
          const [start, end] = this.timeRange.slice(0, 2).map( c => new Date('2020/01/01 ' + c).getTime())
          res = timeCalculate(start, end)
        }
        this.duration = res
        this.$emit('change', val)
      },
      immediate: true
    },
    value (val) {
      if (!val) {
        this.timeRange = ['', '']
      } else if (Array.isArray(val) && this.timeRange + '' !== val + '') {
        this.timeRange = val
      }
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