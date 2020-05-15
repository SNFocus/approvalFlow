<template>
  <div class="preview-container">
    <div id="customForm" style="margin: 50px auto;"></div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  mounted() {
    // defaultData 可以将默认formData覆盖到data中
    const defaultData = {}
    let { jsCode, htmlCode, cssCode } = this.$route.params.formData
    let main = eval(`(${jsCode.replace("export default", "")})`);
    const newData = Object.assign({}, main.data(), {formData: defaultData})
    main.data = function(){
      return newData
    }
    main.template = `<div style="padding:3rem 2rem;">${htmlCode}</div>`;
    let Form = Vue.extend(main);
    new Form().$mount("#customForm");
  }
};
</script>

<style lang="stylus" scoped>
.preview-container {
  max-width: 700px;
  margin: 1rem auto;
  border-radius: 6px;
  box-shadow: 0 0 15px rgba(0, 0, 0, .1);
}
</style>
