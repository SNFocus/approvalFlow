<template>
<div>
    <table border="1">
  <tr class="header">
    <th  class="cell"></th>
    <th v-for="head in tableData" :key="head.formId"  class="cell">{{head.label}}</th>
  </tr>
  <tr v-for="(row, index) in formData" :key="index" class="row">
    <td class="cell">
      <span class="index">{{index}}</span>
    </td>
    <td v-for="(cell, cidx) in row" :key="cidx"  class="cell">
      <template v-if="cell.tag === 'el-upload'">
        <!-- <el-upload
          multiple
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="3"
          :file-list="fileList">
          <i class="el-icon-plus" v-if="cell['list-type'] === 'picture-card'"></i>
          <el-button size="small" type="primary" icon="el-icon-upload">{{cell.buttonText}}</el-button>
          <div slot="tip" class="el-upload__tip">只能上传不超过 {{cell.fileSize}}{{cell.sizeUnit}} 的{{cell.accept}}文件</div>
        </el-upload> -->
      </template>
      <component v-else :is="cell.tag" v-model="cell.value" v-bind="getConfById(cell.formId)"></component>
    </td>
  </tr>
</table>
<el-button @click="submit">ok</el-button>
<el-button @click="addRow">add</el-button>
</div>
</template>
<script>
import { commonComponents } from '../../components/DynamicForm/components/generator/config'
let temp = { 
       "cmpType": "common",
       "label": "组织机构",
       "tag": "fc-org-select",
       "tagIcon": "dept",
       "defaultValue": null,
       "tabList": ["dep"],
       "buttonType": "input",
       "title": "组织机构",
       "searchable": true,
       "maxNum": 99,
       "tagConfig": { 
         "type": "info",
        "closable": true,
        "disable-transitions": false,
        "hit": false,
        "size": "small",
        "effect": "light" 
       },
       "span": 24,
       "labelWidth": 0,
       "disabled": false,
       "required": true,
       "regList": [],
       "changeTag": true,
       "proCondition": true,
       "asSummary": false,
       "formId": 1,
       "renderKey": 1589333002916,
       "layout": "colFormItem",
       "vModel": "field1" 
      }
export default {
  props:{
    config: {
      type: Object,
      default: ()=>({children: [
  {
    "cmpType": "common",
    "label": "发生日期",
    "tag": "el-date-picker",
    "tagIcon": "date",
    "placeholder": "请选择发生日期",
    "defaultValue": null,
    "type": "date",
    "span": 24,
    "labelWidth": 0,
    "style": {
      "width": "100%"
    },
    "disabled": false,
    "clearable": true,
    "required": false,
    "format": "yyyy-MM-dd",
    "value-format": "yyyy-MM-dd",
    "readonly": false,
    "regList": [],
    "changeTag": true,
    "proCondition": false,
    "asSummary": false,
    "formId": 6,
    "renderKey": 1589353163672,
    "layout": "colFormItem",
    "vModel": "field6"
  },
  {
    "cmpType": "common",
    "label": "单据张数",
    "tag": "el-input-number",
    "tagIcon": "number",
    "placeholder": "单据张数",
    "span": 24,
    "labelWidth": 0,
    "step-strictly": false,
    "controls-position": "right",
    "disabled": false,
    "required": false,
    "regList": [],
    "changeTag": true,
    "proCondition": true,
    "formId": 3,
    "renderKey": 1589353159010,
    "layout": "colFormItem",
    "vModel": "field3"
  },
  {
    "cmpType": "common",
    "label": "报销金额",
    "tag": "fc-amount",
    "tagIcon": "amount",
    "placeholder": "请输入报销金额",
    "span": 24,
    "labelWidth": 0,
    "step-strictly": false,
    "controls-position": "right",
    "disabled": false,
    "required": true,
    "regList": [],
    "changeTag": true,
    "proCondition": true,
    "showChinese": true,
    "formId": 2,
    "renderKey": 1589353158092,
    "layout": "colFormItem",
    "vModel": "field2"
  },
  {
    "cmpType": "common",
    "label": "费用明细",
    "tag": "el-input",
    "tagIcon": "textarea",
    "type": "textarea",
    "placeholder": "请输入费用明细",
    "span": 24,
    "labelWidth": 0,
    "autosize": {
      "minRows": 4,
      "maxRows": 4
    },
    "style": {
      "width": "100%"
    },
    "maxlength": null,
    "show-word-limit": false,
    "readonly": false,
    "disabled": false,
    "required": false,
    "regList": [],
    "changeTag": true,
    "proCondition": false,
    "asSummary": false,
    "formId": 5,
    "renderKey": 1589353161055,
    "layout": "colFormItem",
    "vModel": "field5"
  },
  {
    "cmpType": "common",
    "label": "单行输入框",
    "tag": "el-input",
    "tagIcon": "input",
    "placeholder": "请输入单行输入框",
    "span": 24,
    "labelWidth": 0,
    "style": {
      "width": "100%"
    },
    "clearable": true,
    "prepend": "",
    "append": "",
    "prefix-icon": "",
    "suffix-icon": "",
    "maxlength": null,
    "show-word-limit": false,
    "readonly": false,
    "disabled": false,
    "required": false,
    "regList": [],
    "changeTag": true,
    "proCondition": false,
    "asSummary": false,
    "formId": 4,
    "renderKey": 1589353160196,
    "layout": "colFormItem",
    "vModel": "field4"
  },
  {
    "cmpType": "common",
    "label": "报销凭证",
    "tag": "el-upload",
    "tagIcon": "upload",
    "action": "https://jsonplaceholder.typicode.com/posts/",
    "defaultValue": null,
    "labelWidth": 0,
    "disabled": false,
    "required": true,
    "accept": "",
    "name": "file",
    "auto-upload": true,
    "showTip": false,
    "buttonText": "点击上传附件",
    "fileSize": 10,
    "sizeUnit": "MB",
    "list-type": "picture-card",
    "multiple": false,
    "regList": [],
    "changeTag": true,
    "proCondition": false,
    "asSummary": false,
    "formId": 1,
    "span": 24,
    "renderKey": 1589353156899,
    "layout": "colFormItem",
    "vModel": "field1"
  }
]})
    }
  },
  data() {
    return {
      formData:[],
      tableData: []
    };
  },
  created(){
    this.tableData = this.config.children
    this.formData = [this.getEmptyData()]
  },
  methods:{
    getConfById(formId){
      const res = this.tableData.find(t => t.formId === formId)
      console.log(formId, res.tag)
      return res
    },
    getEmptyData(){
      return this.tableData.map((t) => {
        let res = {
        tag: t.tag,
        key: t.vModel,
        formId: t.formId,
        value: t.defaultValue
      }
      if(t.tag === 'el-upload'){
        Object.assign(res, t)
      }
      return res
    })
    },
    submit(){
      console.log(this.formData)
    },
    addRow(){
      this.formData.push(this.getEmptyData())
    },
  }
};
</script>
