<template>
  <el-form
    ref="elForm"
    :model="formData"
    :rules="rules"
    size="small"
    label-width="100px"
  >
    <el-form-item label="组织机构" prop="field1">
      <fc-org-select
        v-model="formData.field1"
        :tabList="['dep']"
        title="组织机构"
        :searchable="true"
        :maxNum="99"
        :tagConfig="{
          type: 'info',
          closable: true,
          'disable-transitions': false,
          hit: false,
          size: 'small',
          effect: 'light',
        }"
        :buttonType="button"
      ></fc-org-select>
    </el-form-item>
    <el-form-item style="text-align:right;">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        field1: null,
      },
      rules: {
        field1: [
          {
            validator: (rule, value, callback) => {
              const val = eval("window._previewVm.vmFormData." + rule.field);
              const tabList = ["dep"];
              let count = 0;
              tabList.forEach((key) => {
                val && Array.isArray(val[key]) && (count += val[key].length);
              });
              if (count > 0) {
                callback();
              } else {
                callback(new Error("组织机构不能为空"));
              }
            },
            trigger: "change",
            type: "object",
          },
        ],
      },
    };
  },
  computed: {
    // 为了验证时能获取到表单数据
    vmFormData() {
      return this.formData;
    },
  },
  watch: {},
  created() {
    window._previewVm = this;
    this.$watch(
      function() {
        return this.formData.field1;
      },
      function(newVal, oldVal) {
        this.$refs["elForm"].validateField("field1", () => {});
      }
    );
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        console.log(this.formData);
        // TODO 提交表单
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    addRowComponent(rowCmpName) {
      const rowData = this.formData[rowCmpName];
      rowData.push(Object.assign({}, rowData[0]));
    },
  },
};
</script>
