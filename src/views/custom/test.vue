<template>
<div  class="fc-table-box">
<table border="1" cellpadding="0" class="fc-table">
  <thead class="header row">
    <th  class="cell index"></th>
    <th v-for="head in tableData" :key="head.formId"  class="cell" :class="{required: head.required}">
      <div class="title" :title="head.label">
        <i class="required-label">*</i>
        {{head.label}}
      </div>
    </th>
  </thead>
  <tbody class="body">
    <tr v-for="(row, index) in formData" :key="index" class="row">
      <td class="cell index">
        <span class="index-num">{{index + 1}}</span>
        <el-popconfirm title="确定删除该行数据吗？" @onConfirm="removeRow(index)">
          <i slot="reference" class="el-icon-delete delete-btn" v-if="formData.length > 1"></i>
        </el-popconfirm>
      </td>
      <td v-for="(cell, cidx) in row" :key="cidx"  class="cell">
        
        <!-- 单选框组 多选框组 下拉选择 需要自行添加options -->
        <!-- 单选框组 多选框组 都替换成下拉 -->
        <template v-if="['el-select', 'el-checkbox-group','el-radio-group'].includes(cell.tag)">
          <el-select v-model="cell.value" placeholder="请选择" :multiple="cell.tag === 'el-checkbox-group' || getConfById(cell.formId).multiple">
            <el-option
              v-for="(opt, oindex) in cell.options" 
              :key="oindex"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>
          <!-- <component 
          :is="cell.tag" 
          v-model="cell.value" 
          v-bind="getConfById(cell.formId)">
            <component 
            v-for="(opt, oindex) in cell.options" 
            :is="cell.tag === 'el-select' ? 'el-option' : cell.tag.replace('-group', '')" 
            :label="opt.label" 
            :key="oindex" 
            :value="opt.value" />
          </component> -->
        </template>
        <template v-else-if="cell.tag === 'el-upload'">
          <el-upload
            v-bind="getConfById(cell.formId)"
            :file-list="[]">
            <i class="el-icon-upload2"></i> 上传
          </el-upload> 
        </template>
        <component v-else :is="cell.tag" v-model="cell.value" v-bind="getConfById(cell.formId)"></component>
      </td>
    </tr>
  </tbody>
</table>
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
      const getUseableProp = config => useableProps.find(t => t.tag === config.tag)
      this.tableData = conf.map(t => {
        const useable = getUseableProp(t)
        const res = useable ? useable.props.reduce((r, key) => (r[key] = t[key], r), {}) : t
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
  }
};
</script>
<style lang="stylus" scoped>
.fc-table{
  margin 10px
  border-collapse:collapse;
  
  .row, .cell{
    border 1px solid #e5e5e5
  }

  .body{
    .row{
      &:hover{
        .delete-btn{
          left 50%
          margin-left -8px
        }
        .index-num{
          visibility hidden
        }
      }
    }

    .cell{
      vertical-align top
      position relative

      > div{
        min-height  40px
        position relative
        width 100%
      }

      &::before{
        content ""
        position absolute
        top -1px
        left -1px
        right -1px
        bottom -1px
        opacity 0
        border 1px solid #4097ef
        transition opacity .5s
      }

      &:hover::before{
        opacity 1
      }
    }
  }

  .header{
    .cell{
      line-height 40px
      padding 0 14px
      background #f5f5f5
      .title{
        max-width 6rem
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
      }

      .required-label{
        display none
        color #da5858
      }

      &.required .required-label{
        display inline
      }
    }
  }

  .index{
    vertical-align middle !important
    padding-left 14px
    padding-right 14px
    overflow hidden

    .delete-btn{
      position absolute
      left -20px
      cursor pointer
    }
  }
}

.fc-table >>> {
  .el-input__inner, .el-textarea__inner{
    border none
    line-height 1
    min-width 110px
    padding-left 10px
    padding-right 10px
  }

  .el-upload--text{
    padding-top 6px
    height 100%
    width 100%
  }
}
</style>
