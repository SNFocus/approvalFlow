<template>
  <el-form
    ref="elForm"
    :model="formData"
    :rules="rules"
    size="small"
    label-width="100px"
  >
    <el-form-item label="手机号" prop="mobile">
      <el-input
        v-model="formData.mobile"
        placeholder="请输入手机号"
        :maxlength="11"
        show-word-limit
        clearable
        prefix-icon="el-icon-mobile"
        :style="{ width: '100%' }"
      ></el-input>
    </el-form-item>
    <el-form-item label="组织机构" prop="field7">
      <fc-org-select
        v-model="formData.field7"
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
        mobile: "",
        field7: null,
      },
      rules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1(3|4|5|7|8|9)\d{9}$/,
            message: "手机号格式错误",
            trigger: "blur",
          },
        ],
        field7: [
          {
            validator: (rule, value, callback) => {
              const tabList = ["dep"];
              let count = 0;
              tabList.forEach((key) => {
                value &&
                  Array.isArray(value[key]) &&
                  (count += value[key].length);
              });
              if (count > 0) {
                callback();
              } else {
                callback(new Error("组织机构不能为空"));
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {
    "formData.field7": {
      handler: function(val) {
        this.$refs["elForm"].validateField(["field7"], () => {});
      },
    },
  },
  created() {},
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
