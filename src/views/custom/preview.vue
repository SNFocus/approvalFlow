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
    debugger
    main.template = `<div style="padding:3rem 2rem 1rem;">${htmlCode}</div>`;
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
  max-width: 700px;
  margin: 1rem auto;
  border-radius: 6px;
  box-shadow: 0 0 15px rgba(0, 0, 0, .1);
 
  >>> .el-row{
      margin-left: 0 !important;
      margin-right: 0 !important;
  }

  >>> .container-add-btn {
    .el-form-item__content {
      display: flex;
      align-items: center;

      .line{
        width: 80%;
        margin-left: 5%;
        height: 1px;
        background: #e5e5e5;
      }
    }
  }
}
</style>
