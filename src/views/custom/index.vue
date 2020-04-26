<template>
  <div class="preview-container">
    <div id="customForm" style="margin: 50px auto;"></div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  mounted() {
    let { jsCode, htmlCode, cssCode } = this.$route.params.formData
    let main = eval(`(${jsCode.replace("export default", "")})`);
    main.template = `<div style="padding: 2rem;">${htmlCode}</div>`;

    let Form = Vue.extend({
      components: {
        child: main
      },
      data() {
        return {};
      },
      template: `<div><child /></div>`
    });
    new Form().$mount("#customForm");
  }
};
</script>

<style lang="stylus" scoped>
.preview-container {
  text-align: left;
  width: 560px;
  margin: auto;

  >>> .el-row{
      margin-left: 0 !important;
      margin-right: 0 !important;
  }
}
</style>
