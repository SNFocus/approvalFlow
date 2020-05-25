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
export default {
  data(){
    return{
      containerWidth: 66
    }
  },
  mounted() {
    // defaultData 可以将默认formData覆盖到data中
    let { jsCode, htmlCode, cssCode } = this.$route.params.formData
    loadStyle(cssCode)
    let Form = Vue.extend(loadVueOption(jsCode, htmlCode, {}))
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
