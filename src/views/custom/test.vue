<template>
<el-form ref="elForm" :model="formData" :rules="rules" size="small"  label-width="100px" >
      <el-row v-for="(row_form_item, index) in formData.row101" :key="index"    :gutter="15">
      <el-form-item  :label="'计数' + (index == 0 ? '' : index)" :prop="'row101['+index+'].field103'"   :rules="[{ required: true,  message: '计数', trigger: 'blur' }]">
        <el-input-number v-model="formData.row101[index]['field103']" placeholder="计数"    controls-position=right   ></el-input-number>
      </el-form-item>
<el-form-item  :label="'上传' + (index == 0 ? '' : index)" :prop="'row101['+index+'].field102'"   :rules="undefined">
        <el-upload ref="row101[index]['field102']" :file-list="field102fileList" :action="field102Action"   :before-upload="field102BeforeUpload"    >
<el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
</el-upload>
      </el-form-item>
    </el-row>
    <el-form-item  >
        <el-button @click="addRowComponent('row101')">添加</el-button>
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
      formData: {
        row101: [{field103: undefined,field102: null}],
      },
      rules: {
        field103: [{ required: true,  message: '计数', trigger: 'blur' }],
      },
      field102Action: 'https://jsonplaceholder.typicode.com/posts/',
      field102fileList: [],
      
      
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    submitForm() {
          this.$refs['elForm'].validate(valid => {
            if(!valid) return
            // TODO 提交表单
          })
        },
resetForm() {
          this.$refs['elForm'].resetFields()
        },
addRowComponent(rowCmpName) {
          this.formData[rowCmpName].forEach(t => this.formData[rowCmpName].push(Object.assign({}, t)))
      },
field102BeforeUpload(file) {
    let isRightSize = file.size / 1024 / 1024 < 2
    if(!isRightSize){
      this.$message.error('文件大小超过 2MB')
    }
    return isRightSize
  },
  }
}
</script>