<template>
<div  class="fc-table-box">
  <el-table 
  :data="formData" 
  border 
  class="fc-table"
  @cell-click="focusInput" 
  v-bind="config.tableConf || {}"
  :show-summary="config['show-summary']"
  :summary-method="getSummaries">
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
        :prop="head.vModel">
         <template slot="header">
           <span style="color: #f56c6c;" v-if="head.required">*</span>
           {{head['label']}}
         </template>
        <template slot-scope="scope">
             <!-- 单选框组 多选框组 都替换成下拉 并添加options -->
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
                v-bind="getConfById(head.formId)" 
                :on-success="(res) => onUploadSuccess(res, formData[scope.$index][cindex])">
                  <span slot="default" >
                    已上传
                    {{formData[scope.$index][cindex].value.length}}
                  </span>
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
        </template>
      </el-table-column>
    </el-table>
    <div class="actions">
      <el-button @click="addRow" type="text">
        <i class="el-icon-plus"></i>
        {{ config.actionText }}
        </el-button>
    </div>
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
      default: ()=> {}
    },
  },

  data() {
    return {
      formData:[],
      tableData: [],
    };
  },

  created(){
    console.log(this.config)
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
      return res ? this.formData.map(row => row.reduce((p, c) => (p[c.vModel] = c.value, p), {})) : false
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
      return this.tableData.map((t) => {
        let res = {
          tag: t.tag,
          formId: t.formId,
          value: t.defaultValue,
          options: t.options, // 下拉 单选 多选
          valid: true,
          vModel: t.vModel,
          required: t.required
        }
        if(t.tag === 'el-upload') this.$set(res, 'value', t.defaultValue)
        return res
      })
    },

    removeRow (index) {
      this.formData.splice(index, 1)
    },
 
    addRow () {
      this.formData.push(this.getEmptyRow())
    },
    /**
     * 对表格进行合计 目前只支持数字，金额，滑块
     */
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      if(this.tableData.length + 1 !== columns.length) return []  // 防止多次加载
      // 获取数字相关组件的输入值
      const isNumCmp = tag => ['fc-amount','el-input-number', 'el-slider'].includes(tag)
      const getValue = (arr, key) => {
       const target =  arr.find(t => t.vModel === key)
       if (!target) return NaN
       if(isNumCmp(target.tag)) return target.value || 0
       return NaN
      }

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const sumVal = data.reduce((sum, d) => sum + getValue(d, column.property), 0)
        sums[index] = Number.isNaN(sumVal) ? '' : sumVal
      });
      
      return sums;
    },

    onUploadSuccess(response, target) {
      !Array.isArray(target.value) && (target.value = [])
      target.value.push(response)
    },
  }
};
</script>
<style lang="stylus" scoped>
.fc-table-box
  .row-action
    .el-icon-delete
      display none
      cursor pointer
  
  .actions
    text-align center
    border 1px solid #EBEEF5
    border-top none
  
.fc-table-box >>> 

  // 索引和删除按钮切换
  .el-table__row:hover
    .index
      display none
    .el-icon-delete
      display inline

  // 去除输入框边框
  .el-input__inner, .el-textarea__inner
    width 100%
    border none
    text-align left
    padding-right 10px
    padding-left 10px
  .el-date-editor
    .el-input__prefix
      left -10px
      top 1px
    .el-input__suffix
      top 1px
      right 0
  .el-input-number
    width 100%

  // 下载按钮
  .el-upload--text
    width 100%
    height 100%
    padding-top 6px
    white-space nowrap

  // 组织机构按钮
  .input-box
    border none !important
    min-height 40px !important
    padding-left 0 !important

  .el-table .el-table__body
    td
      padding 0
      background #FFF !important
      .error-tip 
        font-size 12px
        padding-left 6px
        color #f56c6c
      .cell > div
        width 100%
      
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

        .el-upload-list--text
          position fixed
          margin-top 4px
          z-index 9
        
  .fc-org-select
    position relative

  .el-slider
    padding-left 10px

  .el-upload-list--text
    position absolute
    margin-top 28px
    margin-left -6px
    background white
    box-shadow 2px 2px 8px 2px rgba(0, 0, 0, .1)
    max-width 200px
    transition margin-top .3s
    &:hover
      position fixed
      margin-top 4px
      z-index 9
</style>
