<template>
  <el-form
    ref="elForm"
    :model="formData"
    :rules="rules"
    size="small"
    label-width="100px"
  >
    <el-divider content-position="left">行容器</el-divider>
    <el-row
      class="form-container"
      v-for="(row_form_item, index) in formData.row1"
      :key="'row1' + index"
      :gutter="15"
    >
      <el-form-item
        :label="'金额' + (index == 0 ? '' : index)"
        :prop="`row1[${index}]['field4']`"
      >
        <fc-amount
          v-model="formData.row1[index]['field4']"
          placeholder="请输入金额"
          controls-position="right"
          :showChinese="true"
        ></fc-amount>
      </el-form-item>
      <el-form-item
        :label="'数字输入框' + (index == 0 ? '' : index)"
        :prop="`row1[${index}]['field3']`"
      >
        <el-input-number
          v-model="formData.row1[index]['field3']"
          placeholder="数字输入框"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :label="'组织机构' + (index == 0 ? '' : index)"
        :prop="`row1[${index}]['field2']`"
      >
        <fc-org-select
          v-model="formData.row1[index]['field2']"
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
    </el-row>
    <el-form-item class="container-add-btn">
      <el-button @click="addRowComponent('row1')">添加</el-button>
      <div class="line"></div>
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
        row1: [{ field4: undefined, field3: undefined, field2: null }],
      },
      rules: {
        "row1[0]['field4']": [
          { required: true, message: "请输入金额", trigger: "change" },
        ],
        "row1[0]['field3']": [
          { required: true, message: "数字输入框", trigger: "blur" },
        ],
        "row1[0]['field2']": [
          {
            validator: (rule, value, callback) => {
              debugger;
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
        return this.formData.row1[0]["field2"];
      },
      function(newVal, oldVal) {
        this.$refs["elForm"].validateField("row1[0]['field2']", () => {});
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
