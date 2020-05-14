const approverNodeComfirm = () => {
  const assigneeType = this.approverForm.assigneeType
  let content = ''
  if ( ['optional', 'myself'].includes( assigneeType ) ) {
    content = this.assigneeTypeOptions.find( t => t.value === assigneeType ).label
  } else if ( 'director' === assigneeType ) {
    content = this.directorLevel === 1 ? '直接主管' : `第${this.directorLevel}级主管`
  } else {
    content = this.getInitatorLabel( 'approver' )
  }
  const formOperates = this.approverForm.formOperates.map( t => ( { formId: t.formId, formOperate: t.formOperate } ) )
  this.approverForm.approvers = this.orgCollection[assigneeType]
  Object.assign( this.properties, this.approverForm, { formOperates } )
  this.$emit( "confirm", this.properties, content )
  this.visible = false;
}



export const testProp = {
  children: [
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
        "minRows": 1
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
  ]
}

// forceProp 强制使用的属性 用于覆盖用户或者默认设置
export const useableProps = [
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "type",
      "label",
      "tag",
      "clearable",
      "maxlength",
      "readonly",
      "disabled",
      "required",
      "regList"
    ],

    "tag": "el-input"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "step-strictly",
      "disabled",
      "required",
      "regList"
    ],
    "forceProp": {
      "controls": false
    },
    "tag": "el-input-number"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "disabled",
      "required",
      "regList"
    ],
    "forceProp": {
      "controls": false
    },
    "tag": "fc-amount"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "clearable",
      "disabled",
      "required",
      "filterable",
      "multiple",
      "options",
      "regList"
    ],
    "tag": "el-select"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "defaultValue",
      "props",
      "show-all-levels",
      "disabled",
      "clearable",
      "filterable",
      "required",
      "options",
      "dataType",
      "separator",
      "regList"
    ],
    "tag": "el-cascader"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "optionType",
      "border",
      "size",
      "disabled",
      "required",
      "options",
      "regList"
    ],
    "tag": "el-radio-group"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "defaultValue",
      "optionType",
      "border",
      "size",
      "disabled",
      "required",
      "options",
      "regList"
    ],
    "tag": "el-checkbox-group"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "defaultValue",
      "disabled",
      "required",
      "min",
      "max",
      "step",
      "show-stops",
      "range",
      "regList"
    ],
    "tag": "el-slider"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "defaultValue",
      "tabList",
      "buttonType",
      "title",
      "searchable",
      "maxNum",
      "tagConfig",
      "disabled",
      "required",
      "regList"
    ],
    "tag": "fc-org-select"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "defaultValue",
      "disabled",
      "clearable",
      "required",
      "picker-options",
      "format",
      "value-format",
      "regList"
    ],
    "tag": "el-time-picker"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "showDuration",
      "defaultValue",
      "disabled",
      "clearable",
      "required",
      "is-range",
      "range-separator",
      "format",
      "value-format",
      "regList"
    ],
    "tag": "fc-time-duration"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "defaultValue",
      "type",
      "disabled",
      "clearable",
      "required",
      "format",
      "value-format",
      "readonly",
      "regList"
    ],
    "tag": "el-date-picker"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "showDuration",
      "defaultValue",
      "type",
      "range-separator",
      "disabled",
      "clearable",
      "required",
      "format",
      "value-format",
      "readonly",
      "regList"
    ],
    "tag": "fc-date-duration"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "cmpType",
      "label",
      "tag",
      "action",
      "defaultValue",
      "disabled",
      "required",
      "accept",
      "name",
      "auto-upload",
      "showTip",
      "fileSize",
      "sizeUnit",
      "list-type",
      "multiple",
      "regList"
    ],
    "forceProp": {
      "list-type": "text"
    },
    "tag": "el-upload"
  }
]