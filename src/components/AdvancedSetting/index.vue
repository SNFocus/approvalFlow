<template>
  <div class="setting-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"
      label-position="top">
      <el-form-item label="审批人去重" prop="autoRepeat">
        <el-select v-model="formData.autoRepeat" placeholder="请选择去重类型" :style="{width: '100%'}">
          <el-option v-for="(item, index) in autoRepeatOptions" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
        <el-checkbox v-model="formData.myAuditAutoPass">发起人审批时自动通过</el-checkbox>
      </el-form-item>
      <el-form-item label="全局审抄送人" prop="approver">
        <el-button  plain size="mini">选择抄送人</el-button>
      </el-form-item>
      <el-form-item label="审批意见填写提示" prop="remarkTip">
        <el-input v-model="formData.remarkTip" type="textarea" placeholder="请输入" :maxlength="100"
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
        autoRepeat: undefined,
        remarkTip: undefined,
        myAuditAutoPass: false
      },
      rules: {
      
        autoRepeat: [{
          required: true,
          message: '请选择选择分组',
          trigger: 'change'
        }],
      },
      autoRepeatOptions: [{
        "label": "去重",
        "value": 1
      }, {
        "label": "不去重",
        "value": 2
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

