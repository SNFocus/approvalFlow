<template>
<div  class="fc-table-box">
  <el-table :data="formData" border class="fc-table">
      <el-table-column
        fixed="left"
        width="50"
        align="center">
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
      <el-table-column
        v-for="(head, cindex) in tableData"
        :key="head.formId"
        :min-width="head['min-width']"
        :label="head.label">
        <template slot-scope="scope">
        <!-- 单选框组 多选框组 下拉选择 需要自行添加options -->
        <!-- 单选框组 多选框组 都替换成下拉 -->
        <template v-if="['el-select', 'el-checkbox-group','el-radio-group'].includes(formData[scope.$index][cindex].tag)">
          <el-select  v-model="formData[scope.$index][cindex].value" placeholder="请选择" :multiple="formData[scope.$index][cindex].tag === 'el-checkbox-group' || getConfById(formData[scope.$index][cindex].formId).multiple">
            <el-option
              v-for="(opt, oindex) in formData[scope.$index][cindex].options" 
              :key="oindex"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>
        </template>
        <!-- 上传 -->
        <template v-else-if="formData[scope.$index][cindex].tag === 'el-upload'">
          <el-upload
            style="position: relative;"
            v-bind="getConfById(formData[scope.$index][cindex].formId)"
            :file-list="[]">
            <i class="el-icon-upload2"></i> 上传
          </el-upload> 
        </template>
        <!-- 其他 -->
        <component 
          v-else 
          :is="formData[scope.$index][cindex].tag" 
          v-model="formData[scope.$index][cindex].value" 
          v-bind="getConfById(formData[scope.$index][cindex].formId)">
        </component>
        </template>
      </el-table-column>
    </el-table>

    
  
<!-- <table border="1" cellpadding="0" class="fc-table" cellspacing="0">
  <thead class="header row">
    <th  class="cell index" width="50"></th>
    <th v-for="head in tableData" :key="head.formId"  class="cell" :class="{required: head.required}">
      <div class="title" :title="head.label">
        <i class="required-label">*</i>
        {{head.label}}
      </div>
    </th>
  </thead>
  <tbody class="body">
    <tr v-for="(row, index) in formData" :key="index" class="row">
      <td class="cell index" width="50">
        <span class="index-num">{{index + 1}}</span>
        <el-popconfirm title="确定删除该行数据吗？" @onConfirm="removeRow(index)">
          <i slot="reference" class="el-icon-delete delete-btn" v-if="formData.length > 1"></i>
        </el-popconfirm>
      </td>
      <td v-for="(cell, cidx) in row" :key="cidx"  class="cell">
        
        单选框组 多选框组 下拉选择 需要自行添加options 
        单选框组 多选框组 都替换成下拉 
        <template v-if="['el-select', 'el-checkbox-group','el-radio-group'].includes(cell.tag)">
          <el-select v-model="cell.value" placeholder="请选择" :multiple="cell.tag === 'el-checkbox-group' || getConfById(cell.formId).multiple">
            <el-option
              v-for="(opt, oindex) in cell.options" 
              :key="oindex"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>
        </template>
        <template v-else-if="cell.tag === 'el-upload'">
          <el-upload
            v-bind="getConfById(cell.formId)"
            :file-list="[]">
            <i class="el-icon-upload2"></i> 上传
          </el-upload> 
        </template>
        <component 
        v-else 
        :is="cell.tag" 
        v-model="cell.value" 
        v-bind="getConfById(cell.formId)"></component>
      </td>
    </tr>
  </tbody>
</table> -->
<el-button @click="submit">ok</el-button>
<el-button @click="addRow">add</el-button>
</div>
</template>
<script>
import { commonComponents } from '../../components/DynamicForm/components/generator/config'
import { testProp, useableProps } from './config'
import schema from 'async-validator' // element-ui 表单验证用到的依赖
// useableProps 需要的组件属性 很多属性在表格中没用 需要过滤
export default {
  props:{
    config: {
      type: Object,
      default: ()=> testProp
    }
  },
  data() {
    return {
      formData:[],
      tableData: []
    };
  },
  created(){
    this.filterProps()
    this.formData = [this.getEmptyData()]
  },
  methods:{
    filterProps(){
      if (!this.config.children) return [] 
      const conf = this.config.children
      const getUseableProp = item => useableProps.find(t => t.tag === item.tag)
      this.tableData = conf.map(t => {
        const useable = getUseableProp(t)
        const res = useable ? useable.props.reduce((r, key) => (r[key] = t[key], r), {}) : t
        if(t.tag === 'fc-org-select'){
          console.log(useable, Object.assign({}, res, useable.forceProp))
        }
        return useable.forceProp ? Object.assign({}, res, useable.forceProp) : res
      })
    },

    getConfById(formId){
      return this.tableData.find(t => t.formId === formId)
    },

    getEmptyData(){
      return this.tableData.map((t) => ({
        tag: t.tag,
        key: t.vModel,
        formId: t.formId,
        value: t.defaultValue,
        options: t.options
      }))
    },

    submit(){
      console.log(this.formData)
    },

    removeRow(index){
      this.formData.splice(index, 1)
    },

    addRow(){
      this.formData.push(this.getEmptyData())
    },

    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        console.log(columns, data)
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
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
.fc-table-box{
  padding 1rem
  .row-action{
    .el-icon-delete{
      display none
      cursor pointer
    }
    
  }

       
}

.fc-table-box >>> {
  .el-table__row.hover-row{
    .index{
      display none
    }
    .el-icon-delete{
      display inline
    }
  }
  .el-input__inner, .el-textarea__inner{
    border none
    line-height 1
    padding-right 10px
    text-align left
  }

  .el-upload--text{
    padding-top 6px
    height 100%
    width 100%
  }

  .input-box{
    border none !important
    min-height 40px !important
  }

  .el-date-editor:not(.el-range-editor){
    width 120px
  }

  .el-table .el-table__body{
    td{
      padding 0
      background #FFF !important
    }
    td:not(:first-child){
      vertical-align top
      .cell{
        padding 2px 0px 0px
        &::before{
          content ""
          position absolute
          top 1px
          left -1px
          right -1px
          bottom -1px
        }
        &:hover::before{
          border 1px solid #b5b5b5
        }
      }
    }
  }

  .fc-org-select{
    position relative
  }

  .el-slider{
    padding-left 10px
  }
}
</style>
