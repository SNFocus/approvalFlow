<template>
<el-form ref="elForm" :model="formData" :rules="rules" size="medium"  label-width="100px" >
      <el-form-item  label="下拉选择1" prop="field8"   >
        <el-select v-model="formData.field8" placeholder="请选择下拉选择1"    clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in field8Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item  label="计数" prop="field3"   >
        <el-input-number v-model="formData.field3" placeholder="计数"    controls-position=right   ></el-input-number>
      </el-form-item>
<!-- 
      <el-row v-for="(row_form_item, index) in formData.row12" :key="index"    :gutter="15">
      <el-form-item  :label="'时间范围1' + (index == 0 ? '' : index)" :prop="'row12['+index+'].field14'"   :rules="[]">
        <el-time-picker v-model="formData.row12[index]['field14']" is-range format="HH:mm:ss" value-format="HH:mm:ss"  :style="{width: '100%'}"  start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至" clearable ></el-time-picker>
      </el-form-item>

      <el-form-item  :label="'日期范围1' + (index == 0 ? '' : index)" :prop="'row12['+index+'].field13'"   :rules="[]">
        <el-date-picker type="daterange" v-model="formData.row12[index]['field13']" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}"  start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" clearable  ></el-date-picker>
      </el-form-item>
    </el-row> -->

    <el-form-item  >
        <el-button @click="addRowComponent('row12')">添加</el-button>
    </el-form-item>
    
    <el-row v-for="(row_form_item, index) in formData.row5" :key="index"    :gutter="15">
      <el-form-item  :label="'时间范围' + (index == 0 ? '' : index)" :prop="'row5['+index+'].field6'"   :rules="[]">
        <el-time-picker v-model="formData.row5[index]['field6']" is-range format="HH:mm:ss" value-format="HH:mm:ss"  :style="{width: '100%'}"  start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至" clearable ></el-time-picker>
      </el-form-item>
      <el-form-item  :label="'单选框组' + (index == 0 ? '' : index)" :prop="'row5['+index+'].field7'"   :rules="[]">
        <el-radio-group v-model="formData.row5[index]['field7']" size="medium" >
          <el-radio v-for="(item, index) in field7Options" :key="index" :label="item.value" :disabled="item.disabled" >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-row>
    <el-form-item  >
        <el-button @click="addRowComponent('row5')">添加</el-button>
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
        field8: undefined,
        field3: undefined,
        row12: [{field14: null,field13: null}],
        row5: [{field6: null,field7: undefined}],
      },
      rules: {
        field8: [],
        field3: [],
        field14: [],
        field13: [],
        field6: [],
        field7: [],
      },
      field8Options: [{"label":"选项一","value":"选项一"},{"label":"选项二","value":"选项二"}],
      field7Options: [{"label":"选项一","value":"选项一"},{"label":"选项二","value":"选项二"}],
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
        console.log(this.formData)
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    addRowComponent(rowCmpName) {
      this.formData[rowCmpName].forEach(t => this.formData[rowCmpName].push(Object.assign({}, t)))
    },
  }
}
</script>