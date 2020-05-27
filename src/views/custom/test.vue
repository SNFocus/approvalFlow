<template>
<div>
  <el-form ref="elForm" :model="formData" :rules="rules" size="small"  label-width="100px" >
      <el-form-item  label="表格/明细" prop="field1"   >
        <fc-input-table ref="field1" :config="tableRefs['field1']"></fc-input-table>
      </el-form-item>
      <el-form-item  style="text-align:right;">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
  <el-drawer
    :title="drawerTitle + '说明'"
    :visible.sync="drawerVisible">
    <pre style="padding-left: 1rem;">{{drawerText}}</pre>
  </el-drawer>
</div>
</template>
<script>
export default {
  
  components: {},
  props: [],
  data () {
    return {
      tableRefs: {"field1":{"cmpType":"common","layout":"rowFormItem","rowType":"table","tagIcon":"row","tag":"fc-input-table","type":"default","justify":"start","align":"top","label":"表格/明细","layoutTree":false,"children":[{"cmpType":"common","label":"日期范围","tag":"fc-date-duration","showDuration":false,"tagIcon":"date-range","defaultValue":null,"span":24,"labelWidth":0,"style":{"width":"100%"},"type":"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","disabled":false,"clearable":true,"required":false,"format":"yyyy-MM-dd","value-format":"yyyy-MM-dd","readonly":false,"regList":[],"changeTag":true,"proCondition":true,"asSummary":false,"formId":2,"renderKey":1590564647136,"layout":"colFormItem","vModel":"field2","isChild":true,"childIndex":0},{"cmpType":"common","label":"附件","tag":"el-upload","tagIcon":"upload","action":"https://jsonplaceholder.typicode.com/posts/","defaultValue":[],"labelWidth":0,"disabled":false,"required":false,"accept":"","name":"file","auto-upload":true,"showTip":false,"buttonText":"点击上传附件","fileSize":20,"sizeUnit":"MB","list-type":"text","multiple":false,"regList":[],"changeTag":true,"proCondition":false,"asSummary":false,"formId":3,"span":24,"renderKey":1590564652172,"layout":"colFormItem","vModel":"field3","isChild":true,"childIndex":1}],"actionText":"添加","tableConf":{},"showDivider":false,"formId":1,"span":24,"renderKey":1590564645807,"vModel":"field1","componentName":"row1","gutter":15}},
      drawerVisible: false,
      drawerTitle: '',
      drawerText: '',
      formData: {
        field1Conf: {"cmpType":"common","layout":"rowFormItem","rowType":"table","tagIcon":"row","tag":"fc-input-table","type":"default","justify":"start","align":"top","label":"表格/明细","layoutTree":false,"children":[{"cmpType":"common","label":"日期范围","tag":"fc-date-duration","showDuration":false,"tagIcon":"date-range","defaultValue":null,"span":24,"labelWidth":0,"style":{"width":"100%"},"type":"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","disabled":false,"clearable":true,"required":false,"format":"yyyy-MM-dd","value-format":"yyyy-MM-dd","readonly":false,"regList":[],"changeTag":true,"proCondition":true,"asSummary":false,"formId":2,"renderKey":1590564647136,"layout":"colFormItem","vModel":"field2"},{"cmpType":"common","label":"附件","tag":"el-upload","tagIcon":"upload","action":"https://jsonplaceholder.typicode.com/posts/","defaultValue":[],"labelWidth":0,"disabled":false,"required":false,"accept":"","name":"file","auto-upload":true,"showTip":false,"buttonText":"点击上传附件","fileSize":20,"sizeUnit":"MB","list-type":"text","multiple":false,"regList":[],"changeTag":true,"proCondition":false,"asSummary":false,"formId":3,"span":24,"renderKey":1590564652172,"layout":"colFormItem","vModel":"field3"}],"actionText":"添加","tableConf":{},"showDivider":false,"formId":1,"span":24,"renderKey":1590564645807,"vModel":"field1","componentName":"row1","gutter":15},
field1: undefined,
field2: null,
field3: [],
      },
      rules: {
        "field2": [],
      },
      field3Action: 'https://jsonplaceholder.typicode.com/posts/',
      field3fileList: [],
      
      
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
    submitForm () {
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
checkTableData () {
          let valid = true
          Object.keys(this.tableRefs).forEach(vModel => {
            const res = this.$refs[vModel].submit()  // 返回false或表单数据
            res ? (this.formData[vModel] = res) : (valid = false)
          })
          return valid
        },
showExplain (explainText, title) {
        if(!explainText) return
        this.drawerTitle = title
        this.drawerText = explainText
        this.drawerVisible = true
      },
field3BeforeUpload(file) {
    let isRightSize = file.size / 1024 / 1024 < 20
    if(!isRightSize){
      this.$message.error('文件大小超过 20MB')
    }
    
    return isRightSize
  },
  }
}
</script>
