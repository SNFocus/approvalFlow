<template>
  <div class="preview-container">
    <div id="customForm" style="margin: 50px auto;"></div>
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
};
</script>

<style lang="stylus" scoped>
.preview-container 
  max-width 1000px
  min-width 700px
  margin 1rem auto
  border-radius 6px
  box-shadow 0 0 15px rgba(0, 0, 0, .1)
</style>
