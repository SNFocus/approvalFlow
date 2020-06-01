<template>
  <div class="fc-calculate">
    <el-input v-model="innerValue" readonly></el-input>
    <div class="explain-text" v-if="showChinese">大写：{{chinese}}</div>
  </div>
</template>
<script>
import { getAmountChinese, mergeNumberOfExps, validExp, toRPN, calcRPN, debounce } from '@/assets/utils'
export default {
  model:{
    prop: 'value',
    event: 'change'
  },
  props:[
    "value",
    "tag",
    "showChinese",
    "formId",
    "formData",
    "expression"
  ],
  name: 'fc-calculate',
  data(){
    return {
      innerValue: this.value,
      RPN_EXP: toRPN(mergeNumberOfExps(this.expression))
    }
  },
  computed:{
    chinese(){
      return this.showChinese ? getAmountChinese(this.innerValue) : ''
    }
  },
  methods:{
    /**
     * 获取指定组件的值
     */
    getFormVal(vModel){
      try {
        if(vModel.indexOf('.') > -1){
          let [tabelVModel, cmpVModel] = vModel.split('.')
          return this.formData[tabelVModel]
            .reduce((sum , c) => sum + (c[cmpVModel] || 0) , 0)
        }
        return this.formData[vModel] || 0
      } catch (error) {
        console.warn('计算公式出错, 可能包含无效的组件值', error)
        return 0
      }
    },
    /**
     * 计算表达式
     */
    execRPN(){
      const temp = this.RPN_EXP.map(t => typeof t === 'object' ? this.getFormVal(t.vModel) : t )
      this.innerValue = calcRPN(temp)
      this.$emit('change', this.innerValue)
    }
  },
  watch:{
    formData:{
      handler: function(val){
        if(!val) return
        if (!this.computeExps) { // formData更新可能比较频繁
          this.computeExps = debounce(this.execRPN, 500)
        }
        this.computeExps()
      },
      deep: true,
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