<template>
<el-form ref="elForm" :model="formData" :rules="rules" size="small"  label-width="100px" >
      <el-form-item  label="多选框组" prop="field1"   >
        <el-checkbox-group v-model="formData.field1"   size="medium" >
<el-checkbox v-for="(item, index) in field1Options" :key="index" :label="item.value" :disabled="item.disabled" >{{item.label}}</el-checkbox>
</el-checkbox-group>
      </el-form-item>
      <el-form-item  style="text-align:right;">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
  components: {},
  props: [],
  data () {
    return {
      tableRefs: {},
      formData: {
        field1: [],
      },
      rules: {
        "field1": [],
      },
      
      field1Options: [{"label":"选项一","value":"选项一"},{"label":"选项二","value":"选项二"}],
      
    }
  },
  computed: {
    // 为了验证时能获取到表单数据
    vmFormData(){
      return this.formData
    }
  },
  watch: {},
  created () {
    window._previewVm = this
    
  },
  mounted () {},
  methods: {
    submitForm() {
          if (!this.checkTableData()) console.log('false')
          console.log(this.formData)
          this.$refs['elForm'].validate(valid => {
            if(!valid) return
            console.log(this.formData)
            // TODO 提交表单
          })
        },
resetForm() {
          this.$refs['elForm'].resetFields()
        },
checkTableData() {
          let valid = true
          Object.keys(this.tableRefs).forEach(vModel => {
            const res = this.$refs[vModel].submit()  // 返回false或表单数据
            res ? (this.formData[vModel] = res) : (valid = false)
          })
          return valid
        },
  }
}
</script>
