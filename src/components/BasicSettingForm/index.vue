<template>
  <div class="setting-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"
      label-position="top">
      <el-form-item label="审批名称" prop="flowName">
        <el-input v-model="formData.flowName" placeholder="请输入审批名称" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="选择分组" prop="flowGroup">
        <el-select v-model="formData.flowGroup" placeholder="请选择选择分组" clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in flowGroupOptions" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="谁可以发起审批" prop="approver">
        <el-button  plain size="mini">选择发起人</el-button>
      </el-form-item>
      <el-form-item label="模板图标" prop="icon">
        <i style="font-size: 2rem;vertical-align: middle; " class="iconfont el-icon-camera-solid"></i>
        &nbsp;
        <el-button  plain size="mini">选择图标</el-button>
      </el-form-item>
      <el-form-item label="审批说明" prop="flowRemark">
        <el-input v-model="formData.flowRemark" type="textarea" placeholder="请输入审批说明" :maxlength="100"
          show-word-limit :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        flowName: '',
        flowImg: '',
        flowGroup: undefined,
        flowRemark: undefined,
      },
      rules: {
        flowName: [{
          required: true,
          message: '请输入审批名称',
          trigger: 'blur'
        }],
        flowGroup: [{
          required: true,
          message: '请选择选择分组',
          trigger: 'change'
        }],
      },
      flowGroupOptions: [{
        "label": "假勤管理",
        "value": 1
      }, {
        "label": "人事管理",
        "value": 2
      }, {
        "label": "财务管理",
        "value": 3
      }, {
        "label": "业务管理",
        "value": 4
      }, {
        "label": "行政管理",
        "value": 5
      }, {
        "label": "法务管理",
        "value": 6
      }, {
        "label": "其他",
        "value": 7
      }],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
  }
}

</script>
<style lang="stylus" scoped>
.setting-container{
  width: 600px;
  height: 100%;
  margin: auto;
  background: white;
  padding: 16px;

  >>>.el-form--label-top .el-form-item__label{
    padding-bottom: 0;
  }
}
</style>>

