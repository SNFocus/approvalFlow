export const testProp = {
  children: [
    {
      "cmpType": "common",
      "label": "组织机构",
      "tag": "fc-org-select",
      "tagIcon": "dept",
      "defaultValue": null,
      "tabList": [
        "dep"
      ],
      "buttonType": "button",
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
      "style": {
        "width": "100%"
      },
      "span": 24,
      "labelWidth": 0,
      "disabled": false,
      "required": true,
      "regList": [],
      "changeTag": true,
      "proCondition": true,
      "asSummary": false,
      "formId": 15,
      "renderKey": 1589446182196,
      "layout": "colFormItem",
      "vModel": "field1"
    },
    {
      "cmpType": "common",
      "label": "单行输入框",
      "tag": "el-input",
      "tagIcon": "input",
      "placeholder": "请输入单行输入框单行输入框",
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
      "required": true,
      "regList": [],
      "changeTag": true,
      "proCondition": false,
      "asSummary": false,
      "formId": 1,
      "renderKey": 1589433230703,
      "layout": "colFormItem",
      "vModel": "field1"
    },
    {
      "cmpType": "common",
      "label": "级联选择",
      "tag": "el-cascader",
      "tagIcon": "cascader",
      "placeholder": "请选择级联选择",
      "defaultValue": [],
      "span": 24,
      "labelWidth": 0,
      "style": {
        "width": "100%"
      },
      "props": {
        "props": {
          "multiple": false
        }
      },
      "show-all-levels": true,
      "disabled": false,
      "clearable": true,
      "filterable": false,
      "required": true,
      "options": [
        {
          "id": 1,
          "value": "选项1",
          "label": "选项1",
          "children": [
            {
              "id": 2,
              "value": "选项1-1",
              "label": "选项1-1"
            }
          ]
        }
      ],
      "dataType": "static",
      "labelKey": "label",
      "valueKey": "value",
      "childrenKey": "children",
      "separator": "/",
      "regList": [],
      "changeTag": true,
      "proCondition": false,
      "asSummary": false,
      "formId": 6,
      "renderKey": 1589433236703,
      "layout": "colFormItem",
      "vModel": "field6"
    },
    {
      "cmpType": "common",
      "label": "单选框组",
      "tag": "el-radio-group",
      "tagIcon": "radio",
      "span": 24,
      "labelWidth": 0,
      "style": {},
      "optionType": "default",
      "border": false,
      "size": "medium",
      "disabled": false,
      "required": true,
      "options": [
        {
          "label": "选项一",
          "value": "选项一"
        },
        {
          "label": "选项二",
          "value": "选项二"
        }
      ],
      "regList": [],
      "changeTag": true,
      "proCondition": true,
      "formId": 7,
      "renderKey": 1589433237870,
      "layout": "colFormItem",
      "vModel": "field7"
    },
    {
      "cmpType": "common",
      "label": "时间范围",
      "tag": "fc-time-duration",
      "showDuration": false,
      "tagIcon": "time-range",
      "defaultValue": null,
      "span": 24,
      "labelWidth": 0,
      "style": {
        "width": "100%"
      },
      "disabled": false,
      "clearable": true,
      "required": true,
      "is-range": true,
      "range-separator": "至",
      "start-placeholder": "开始时间",
      "end-placeholder": "结束时间",
      "format": "HH:mm:ss",
      "value-format": "HH:mm:ss",
      "regList": [],
      "changeTag": true,
      "proCondition": true,
      "asSummary": false,
      "formId": 11,
      "renderKey": 1589433243456,
      "layout": "colFormItem",
      "vModel": "field11"
    },
    {
      "cmpType": "common",
      "label": "附件",
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
      "fileSize": 2,
      "sizeUnit": "MB",
      "list-type": "text",
      "multiple": false,
      "regList": [],
      "changeTag": true,
      "proCondition": false,
      "asSummary": false,
      "formId": 14,
      "span": 24,
      "renderKey": 1589433246351,
      "layout": "colFormItem",
      "vModel": "field14"
    },
    {
      "cmpType": "common",
      "label": "日期范围",
      "tag": "fc-date-duration",
      "showDuration": false,
      "tagIcon": "date-range",
      "defaultValue": null,
      "span": 24,
      "labelWidth": 0,
      "style": {
        "width": "100%"
      },
      "type": "daterange",
      "range-separator": "至",
      "start-placeholder": "开始日期",
      "end-placeholder": "结束日期",
      "disabled": false,
      "clearable": true,
      "required": true,
      "format": "yyyy-MM-dd",
      "value-format": "yyyy-MM-dd",
      "readonly": false,
      "regList": [],
      "changeTag": true,
      "proCondition": true,
      "asSummary": false,
      "formId": 13,
      "renderKey": 1589433245284,
      "layout": "colFormItem",
      "vModel": "field13"
    },
    {
      "cmpType": "common",
      "label": "日期选择",
      "tag": "el-date-picker",
      "tagIcon": "date",
      "placeholder": "请选择日期选择",
      "defaultValue": null,
      "type": "date",
      "span": 24,
      "labelWidth": 0,
      "style": {
        "width": "100%"
      },
      "disabled": false,
      "clearable": true,
      "required": true,
      "format": "yyyy-MM-dd",
      "value-format": "yyyy-MM-dd",
      "readonly": false,
      "regList": [],
      "changeTag": true,
      "proCondition": false,
      "asSummary": false,
      "formId": 12,
      "renderKey": 1589433244229,
      "layout": "colFormItem",
      "vModel": "field12"
    },
    {
      "cmpType": "common",
      "label": "时间选择",
      "tag": "el-time-picker",
      "tagIcon": "time",
      "placeholder": "请选择时间选择",
      "defaultValue": null,
      "span": 24,
      "labelWidth": 0,
      "style": {
        "width": "100%"
      },
      "disabled": false,
      "clearable": true,
      "required": true,
      "picker-options": {
        "selectableRange": "00:00:00-23:59:59"
      },
      "format": "HH:mm:ss",
      "value-format": "HH:mm:ss",
      "regList": [],
      "changeTag": true,
      "proCondition": false,
      "asSummary": false,
      "formId": 10,
      "renderKey": 1589433242556,
      "layout": "colFormItem",
      "vModel": "field10"
    },
    {
      "cmpType": "common",
      "label": "滑块",
      "tag": "el-slider",
      "tagIcon": "slider",
      "defaultValue": 0,
      "span": 24,
      "labelWidth": 0,
      "disabled": false,
      "required": true,
      "min": 0,
      "max": 100,
      "step": 1,
      "show-stops": false,
      "range": false,
      "regList": [],
      "changeTag": true,
      "proCondition": false,
      "asSummary": false,
      "formId": 9,
      "renderKey": 1589433239354,
      "layout": "colFormItem",
      "vModel": "field9"
    },
    {
      "cmpType": "common",
      "label": "多选框组",
      "tag": "el-checkbox-group",
      "tagIcon": "checkbox",
      "defaultValue": [],
      "span": 24,
      "labelWidth": 0,
      "style": {},
      "optionType": "default",
      "border": false,
      "size": "medium",
      "disabled": false,
      "required": true,
      "options": [
        {
          "label": "选项一",
          "value": "选项一"
        },
        {
          "label": "选项二",
          "value": "选项二"
        }
      ],
      "regList": [],
      "changeTag": true,
      "proCondition": false,
      "asSummary": false,
      "formId": 8,
      "renderKey": 1589433238533,
      "layout": "colFormItem",
      "vModel": "field8"
    },
    {
      "cmpType": "common",
      "label": "金额",
      "tag": "fc-amount",
      "tagIcon": "amount",
      "placeholder": "请输入金额",
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
      "formId": 4,
      "renderKey": 1589433233395,
      "layout": "colFormItem",
      "vModel": "field4"
    },
    {
      "cmpType": "common",
      "label": "下拉选择",
      "tag": "el-select",
      "tagIcon": "select",
      "placeholder": "请选择下拉选择",
      "span": 24,
      "labelWidth": 0,
      "clearable": true,
      "disabled": false,
      "required": true,
      "filterable": false,
      "multiple": false,
      "options": [
        {
          "label": "选项一",
          "value": "选项一"
        },
        {
          "label": "选项二",
          "value": "选项二"
        }
      ],
      "regList": [],
      "changeTag": true,
      "proCondition": true,
      "formId": 5,
      "renderKey": 1589433234458,
      "layout": "colFormItem",
      "vModel": "field5"
    },
    {
      "cmpType": "common",
      "label": "多行输入框1",
      "tag": "el-input",
      "tagIcon": "textarea",
      "type": "textarea",
      "placeholder": "请输入多行输入框1",
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
      "required": true,
      "regList": [],
      "changeTag": true,
      "proCondition": false,
      "asSummary": false,
      "formId": 2,
      "renderKey": 1589433231618,
      "layout": "colFormItem",
      "vModel": "field2"
    },
    {
      "cmpType": "common",
      "label": "数字输入框",
      "tag": "el-input-number",
      "tagIcon": "number",
      "placeholder": "数字输入框",
      "span": 24,
      "labelWidth": 0,
      "step-strictly": false,
      "controls-position": "right",
      "disabled": false,
      "required": true,
      "regList": [],
      "changeTag": true,
      "proCondition": true,
      "formId": 3,
      "renderKey": 1589433232346,
      "layout": "colFormItem",
      "vModel": "field3"
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
    "forceProp": {
      "min-width": 180
    },
    "tag": "el-input"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "label",
      "tag",
      "step-strictly",
      "disabled",
      "required",
      "regList"
    ],
    "forceProp": {
      "controls": false,
      "min-width": 180
    },
    "tag": "el-input-number"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "label",
      "tag",
      "disabled",
      "required",
      "regList"
    ],
    "forceProp": {
      "controls": false,
      "min-width": 120
    },
    "tag": "fc-amount"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
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
    "forceProp": {
      "min-width": 140
    },
    "tag": "el-select"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
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
    "forceProp": {
      "min-width": 170
    },
    "tag": "el-cascader"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
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
    "forceProp": {
      "min-width": 140
    },
    "tag": "el-radio-group"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
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
    "forceProp": {
      "min-width": 140
    },
    "tag": "el-checkbox-group"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
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
    "forceProp": {
      "min-width": 160
    },
    "tag": "el-slider"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
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
    "forceProp": {
      "buttonType": "input",
      "min-width": 100
    },
    "tag": "fc-org-select"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
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
    "forceProp": {
      "min-width": 120
    },
    "tag": "el-time-picker"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "label",
      "tag",
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
    "forceProp": {
      "min-width": 320
    },
    "tag": "fc-time-duration"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
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
    "forceProp": {
      "min-width": 150
    },
    "tag": "el-date-picker"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
      "label",
      "tag",
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
    "forceProp": {
      "min-width": 320
    },
    "tag": "fc-date-duration"
  },
  {
    "props": [
      "vModel",
      "defaultValue",
      "formId",
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
      "list-type": "text",
      "min-width": 80,
      "defaultValue": [],
    },
    "tag": "el-upload"
  }
]