<template>
<div  class="fc-table-box">
  <el-table :data="formData" border class="fc-table" @cell-click="focusInput" v-bind="config.tableConf || {}">
      <el-table-column width="50" align="center">
        <!-- 序号 -->
        <template slot-scope="scope">
          <div class="row-action">
            <span class="index">
              {{scope.$index + 1}}
            </span>
            <el-popconfirm title="确定删除该行数据吗？" @onConfirm="removeRow(scope.$index)">
              <i slot="reference" class="el-icon-delete delete-btn"></i>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
      <!-- 组件列 -->
      <el-table-column
        v-for="(head, cindex) in tableData"
        :key="head.formId"
        :min-width="head['min-width']"
        :label="head.label">
         <template slot="header">
           <span style="color: #f56c6c;" v-if="head.required">*</span>
           {{head.label}}
         </template>
        <template slot-scope="scope">
          <div >
             <!-- 单选框组 多选框组 下拉选择 需要自行添加options -->
             <!-- 单选框组 多选框组 都替换成下拉 -->
              <template v-if="['el-select', 'el-checkbox-group','el-radio-group'].includes(head.tag)">
                <el-select  
                v-model="formData[scope.$index][cindex].value" placeholder="请选择" 
                :multiple="head.tag === 'el-checkbox-group' || getConfById(head.formId).multiple"
                @change="onFormDataChange(scope.$index, cindex)"
                >
                  <el-option
                    v-for="(opt, oindex) in head.options" 
                    :key="oindex"
                    :label="opt.label"
                    :value="opt.value">
                  </el-option>
                </el-select>
              </template>
              <!-- 上传 -->
              <template v-else-if="head.tag === 'el-upload'">
                <el-upload
                  style="position: relative;"
                  v-bind="getConfById(head.formId)"
                  :file-list="[]">
                  <i class="el-icon-upload2"></i> 上传
                </el-upload> 
              </template>
              <!-- 其他 -->
              <component 
                v-else 
                :is="head.tag" 
                v-model="formData[scope.$index][cindex].value" 
                v-bind="getConfById(head.formId)"
                @change="onFormDataChange(scope.$index, cindex)">
              </component>
              <div class="error-tip" v-show="!formData[scope.$index][cindex].valid">
                不能为空
              </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="actions">
      <el-button @click="addRow" type="text">
        <i class="el-icon-plus"></i>
        添加
        </el-button>
    </div>
      <el-button @click="submit">OK</el-button>
</div>
</template>
<script>
import { testProp, useableProps } from './config'
// useableProps —— 需要的组件属性 很多属性在表格中没用 需要过滤
export default {
  name: "fc-input-table",
  props:{
    config: {
      type: Object,
      default: ()=> testProp
    },
  },

  data() {
    return {
      formData:[],
      tableData: []
    };
  },

  created(){
    this.tableData = this.filterProps()
    this.formData = [this.getEmptyRow()]
  },

  methods:{
    /**
     * @event cell-click Table 单元格点击事件
     * 点击单元格 聚焦单元格中的input
     */
    focusInput(row, column, cell, event){
      const child = cell.querySelector('.cell').firstElementChild
      const input = child && child.querySelector('input')
      input && input.focus()
    },
    /**
     * 过滤不需要的组件配置， 表格中的组件需要统一样式
     */
    filterProps(){
      const conf = this.config.children
      if (!conf) return []
      const getUseableProp = item => useableProps.find(t => t.tag === item.tag)
      return conf.map(t => {
        const useable = getUseableProp(t)
        const res = useable ? useable.props.reduce((r, key) => (r[key] = t[key], r), {}) : t
        return useable.forceProp ? Object.assign({}, res, useable.forceProp) : res
      })
    },
    
    onFormDataChange(rowIndex, colIndex){
      const data = this.formData[rowIndex][colIndex]
      data.required && (data.valid = this.checkData(data))
    },
    /**
     * 校验单个表单数据
     * @param {CmpConfig} 组件配置对象
     */
    checkData({ tag, value}){
      if([null, undefined, ''].includes(value)) return false
      if(tag === 'fc-org-select') return this.checkOrgData(value)
      if(Array.isArray(value)) return value.length > 0
      return true
    },
    /**
     * 对组织机构部门控数据单独校验
     */
    checkOrgData(data){
      const isArray = Array.isArray
      if(typeof data !== 'object' || isArray(data)) return false
      let count = 0
      for(let key in data){
        count += isArray(data[key]) ? data[key].length : 0
      }
      return count > 0
    },
    /**
     * 校验表格数据必填项
     */
    submit(){
      let res = true
      const checkCol = col => col.required && !this.checkData(col) && (res = col.valid = false) 
      this.formData.forEach(row => row.forEach(checkCol))
      return res ? this.formData : false
    },
    /**
     * 根据formid获取完整组件配置
     */
    getConfById(formId){
      return this.tableData.find(t => t.formId === formId)
    },
    /**
     * 获取默认行数据
     */
    getEmptyRow(){
      return this.tableData.map((t) => ({
        tag: t.tag,
        formId: t.formId,
        value: t.defaultValue,
        options: t.options, // 下拉 单选 多选
        valid: true,
        required: t.required
      }))
    },

    removeRow (index) {
      this.formData.splice(index, 1)
    },
 
    addRow () {
      this.formData.push(this.getEmptyRow())
    },
    /**
     * 对表格进行合计
     */
    getSummaries (param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' 元';
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
      }
  }
};
</script>
<style lang="stylus" scoped>
.fc-table-box
  padding 1rem
  .row-action
    .el-icon-delete
      display none
      cursor pointer
  
  .actions
    text-align center
    border 1px solid #EBEEF5
    border-top none
  
.fc-table-box >>> 
  .el-table__row:hover
    .index
      display none
    
    .el-icon-delete
      display inline
    
  .el-input__inner, .el-textarea__inner
    border none
    line-height 1
    padding-right 10px
    text-align left
  
  .el-upload--text
    padding-top 6px
    height 100%
    width 100%

  .input-box
    border none !important
    min-height 40px !important

  .el-date-editor:not(.el-range-editor)
    width 120px

  .el-table .el-table__body
    td
      padding 0
      background #FFF !important
      .error-tip 
        font-size 12px
        padding-left 6px
        color #f56c6c
      
    td:not(:first-child)
      vertical-align top
      &::after, &::before
        content ""
        width 10px
        height 10px
        background white
        position absolute
        border 2px solid transparent
        transition border-color .3s

      &::after
        border-top none
        border-right none
        left 0
        bottom 0

      &::before
        border-bottom none
        border-left none
        right 0
        top 0

      &:hover
        &::after, &::before
          border-color red

        
  .fc-org-select
    position relative

  .el-slider
    padding-left 10px
  
</style>
