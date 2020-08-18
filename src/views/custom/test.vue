<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="small" label-width="100px">
        <el-col :span="24">
          <el-form-item label="组织机构" prop="field20" required>
            <fc-org-select
              v-model="formData.field20"
              :tabList="['dep']"
              title="组织机构"
              :searchable="true"
              :maxNum="1"
              :tagConfig="{'type':'info','closable':true,'disable-transitions':false,'hit':false,'size':'small','effect':'light'}"
              buttonType="button"
              :style="{width: '100%'}"
            ></fc-org-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="field2">
            <el-input
              v-model="formData.field2"
              placeholder="请输入姓名"
              clearable
              :style="{width: '100%'}"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="金额" prop="field21">
            <fc-amount
              v-model="formData.field21"
              placeholder="请输入金额"
              controls-position="right"
              :showChinese="true"
            ></fc-amount>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学历" prop="field3">
            <el-select
              v-model="formData.field3"
              placeholder="请选择学历"
              clearable
              :style="{width: '100%'}"
            >
              <el-option
                v-for="(item, index) in field3Options"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="field4">
            <el-radio-group v-model="formData.field4" size="medium">
              <el-radio
                v-for="(item, index) in field4Options"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工作经历" prop="field5">
            <fc-input-table
              ref="field5"
              :config="tableRefs['field5']"
              :value.sync="formData.field5"
            ></fc-input-table>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item style="text-align:right;">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-drawer :title="drawerTitle + '说明'" :visible.sync="drawerVisible">
      <pre style="padding-left: 1rem;">{{drawerText}}</pre>
    </el-drawer>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      tableRefs: {
        field5: {
          cmpType: "common",
          layout: "rowFormItem",
          rowType: "table",
          tagIcon: "row",
          tag: "fc-input-table",
          type: "table",
          justify: "start",
          align: "top",
          label: "工作经历",
          layoutTree: false,
          children: [
            {
              cmpType: "common",
              label: "日期范围",
              tag: "fc-date-duration",
              showDuration: false,
              tagIcon: "date-range",
              defaultValue: null,
              span: 24,
              labelWidth: 0,
              style: { width: "100%" },
              type: "daterange",
              "range-separator": "至",
              "start-placeholder": "开始日期",
              "end-placeholder": "结束日期",
              disabled: false,
              clearable: true,
              required: false,
              format: "yyyy-MM-dd",
              "value-format": "yyyy-MM-dd",
              readonly: false,
              regList: [],
              changeTag: true,
              proCondition: true,
              asSummary: false,
              formId: 6,
              renderKey: 1590647800330,
              layout: "colFormItem",
              vModel: "field6",
              isChild: true,
              isTableChild: true,
            },
            {
              cmpType: "common",
              label: "公司名称",
              tag: "el-input",
              tagIcon: "input",
              placeholder: "请输入公司名称",
              span: 24,
              labelWidth: 0,
              style: { width: "100%" },
              clearable: true,
              prepend: "",
              append: "",
              "prefix-icon": "",
              "suffix-icon": "",
              maxlength: null,
              "show-word-limit": false,
              readonly: false,
              disabled: false,
              required: true,
              regList: [],
              changeTag: true,
              proCondition: false,
              asSummary: false,
              formId: 7,
              renderKey: 1590647831276,
              layout: "colFormItem",
              vModel: "field7",
              isChild: true,
              isTableChild: true,
            },
            {
              cmpType: "common",
              label: "岗位",
              tag: "el-select",
              tagIcon: "select",
              placeholder: "请选择岗位",
              span: 24,
              labelWidth: 0,
              style: { width: "100%" },
              clearable: true,
              disabled: false,
              required: false,
              filterable: false,
              multiple: false,
              options: [
                { label: "前端", value: "前端" },
                { label: "后端", value: "后端" },
                { label: "其他", value: "其他" },
              ],
              regList: [],
              changeTag: true,
              proCondition: true,
              formId: 8,
              renderKey: 1590647845533,
              layout: "colFormItem",
              vModel: "field8",
              isChild: true,
              isTableChild: true,
            },
            {
              cmpType: "common",
              label: "附件",
              tag: "el-upload",
              tagIcon: "upload",
              action: "https://jsonplaceholder.typicode.com/posts/",
              defaultValue: [],
              labelWidth: 0,
              disabled: false,
              required: false,
              accept: "",
              name: "file",
              "auto-upload": true,
              showTip: false,
              buttonText: "点击上传附件",
              fileSize: 20,
              sizeUnit: "MB",
              "list-type": "text",
              multiple: false,
              regList: [],
              changeTag: true,
              proCondition: false,
              asSummary: false,
              formId: 9,
              span: 24,
              renderKey: 1590647866199,
              layout: "colFormItem",
              vModel: "field9",
              isChild: true,
              isTableChild: true,
            },
          ],
          actionText: "添加",
          tableConf: {},
          showDivider: false,
          "show-summary": false,
          formId: 5,
          span: 24,
          renderKey: 1590647776442,
          vModel: "field5",
          componentName: "row5",
          gutter: 15,
        },
      },
      drawerVisible: false,
      drawerTitle: "",
      drawerText: "",
      formData: {
        field20: { dep: [{ nodeId: 1, deptId: 1, deptName: "xxx公司" }] },
        field2: undefined,
        field21: 10,
        field3: undefined,
        field4: "男",
        field5: [{ field6: null, field7: null, field8: null, field9: [] }],
      },
      rules: {
        field20: [
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
            trigger: "input",
            type: "object",
          },
        ],
        field2: [],
        field21: [],
        field3: [{ required: true, message: "请选择学历", trigger: "change" }],
        field4: [],
      },
      field9Action: "https://jsonplaceholder.typicode.com/posts/",
      field9fileList: [],
      field3Options: [
        { label: "专科", value: "专科" },
        { label: "本科", value: "本科" },
        { label: "研究生", value: "研究生" },
        { label: "博士生", value: "博士生" },
      ],
      field4Options: [
        { label: "男", value: "男" },
        { label: "女", value: "女" },
      ],
      field8Options: [
        { label: "前端", value: "前端" },
        { label: "后端", value: "后端" },
        { label: "其他", value: "其他" },
      ],
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
      function () {
        return this.formData.field20;
      },
      function (newVal, oldVal) {
        this.$refs["elForm"].validateField("field20", () => {});
      }
    );
  },
  mounted() {},
  methods: {
    submitForm() {
      const isTableValid = this.checkTableData();
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        if (!isTableValid) return;
        this.$notify({
          title: "表单数据",
          message: "请在控制台中查看数据输出",
          position: "bottom-right",
        });
        console.log("表单数据", this.formData);
        // TODO 提交表单
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
      this.resetTableData();
    },
    resetTableData() {
      Object.keys(this.tableRefs).forEach((vModel) => {
        const res = this.$refs[vModel].reset();
      });
    },
    checkTableData() {
      let valid = true;
      Object.keys(this.tableRefs).forEach((vModel) => {
        const res = this.$refs[vModel].submit(); // 返回false或表单数据
        res ? (this.formData[vModel] = res) : (valid = false);
      });
      return valid;
    },
    showExplain(explainText, title) {
      if (!explainText) return;
      this.drawerTitle = title;
      this.drawerText = explainText;
      this.drawerVisible = true;
    },
    field9BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 20;
      if (!isRightSize) {
        this.$message.error("文件大小超过 20MB");
      }

      return isRightSize;
    },
  },
};
</script>