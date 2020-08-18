<template>
  <div class="preview-container" :style="{width: containerWidth + '%'}">
    <div id="customForm" style="margin: 50px auto;"></div>
    <div  class="width-slider">
      <el-slider v-model="containerWidth" :min="30" :max="96"></el-slider>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
let styleDom = null
const loadStyle = cssCode => {
  styleDom = document.createElement('style')
  styleDom.innerHTML = cssCode
  document.head.appendChild(styleDom)
}
const loadVueOption = (jsCode, htmlCode, defaultData) => {
  let main = eval(`(${jsCode.replace("export default", "")})`);
  const oldData = main.data()
  Object.assign(oldData.formData, defaultData)
  const newData = Object.assign({}, oldData , {/**other data */})
  main.data = function(){ return newData }
  main.template = `<div style="padding:3rem 2rem;">${htmlCode}</div>`
  return main
}

/**
 * 默认数据  预览已经填写过的表单时
 * 将以下数据合并到Vue实例中即可
 */
const defData = {
  // "field2": "22",
  // "field3": "本科",
  // "field4": "男",
  // "field5": [
  //   {
  //     "field6": [
  //       "2020-07-01",
  //       "2020-08-03"
  //     ],
  //     "field7": "212",
  //     "field8": "后端",
  //     "field9": []
  //   }
  // ],
  // "field10": 21,
}
export default {
  data(){
    return{
      containerWidth: 66
    }
  },
  mounted() {
    // defaultData 可以将默认formData覆盖到data中
    const { jsCode, htmlCode, cssCode } = this.$route.params.formData
    loadStyle(cssCode)
    const OPTION = loadVueOption(jsCode, htmlCode, defData)
    const Form = Vue.extend(OPTION)
    new Form().$mount("#customForm")
  },
  beforeDestroy(){
    styleDom && styleDom.remove()
  }
}
</script>

<style lang="stylus" scoped>
.preview-container 
  margin 3rem auto 1rem
  border-radius 6px
  box-shadow 0 0 15px rgba(0, 0, 0, .1)
  .width-slider
    width  150px
    position absolute
    top 0
    right 2rem
</style>
