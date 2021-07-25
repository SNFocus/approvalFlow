import PROVINCE from './province.js'

export const formConf = {
  formRef: 'elForm',
  size: 'small',
  labelPosition: 'right',
  labelWidth: 100,
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true
}

export const inputComponents = [{
  label: '单行输入框',
  tag: 'el-input',
  tagIcon: 'input',
  placeholder: '请输入',
  defaultValue: undefined,
  span: 24,
  labelWidth: null,
  style: { width: '100%' },
  clearable: true,
  prepend: '',
  append: '',
  'prefix-icon': '',
  'suffix-icon': '',
  maxlength: null,
  'show-word-limit': false,
  readonly: false,
  disabled: false,
  required: false,
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},
{
  label: '多行输入框',
  tag: 'el-input',
  tagIcon: 'textarea',
  type: 'textarea',
  placeholder: '请输入',
  defaultValue: undefined,
  span: 24,
  labelWidth: null,
  autosize: {
    minRows: 4,
    maxRows: 4
  },
  style: { width: '100%' },
  maxlength: null,
  'show-word-limit': false,
  readonly: false,
  disabled: false,
  required: false,
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},
//   {
//     label: '密码',
//     tag: 'el-input',
//     tagIcon: 'password',
//     placeholder: '请输入',
//     defaultValue: undefined,
//     span: 24,
//     'show-password': true,
//     labelWidth: null,
//     style: { width: '100%' },
//     clearable: true,
//     prepend: '',
//     append: '',
//     'prefix-icon': '',
//     'suffix-icon': '',
//     maxlength: null,
//     'show-word-limit': false,
//     readonly: false,
//     disabled: false,
//     required: false,
//     regList: [],
//     changeTag: true,
// proCondition: false,
// asSummary: false
//   },
{
  label: '数字输入框',
  tag: 'el-input-number',
  tagIcon: 'number',
  placeholder: '',
  defaultValue: undefined,
  style: { width: null },
  span: 24,
  labelWidth: null,
  min: undefined,
  max: undefined,
  step: undefined,
  'step-strictly': false,
  precision: undefined,
  'controls-position': 'right',
  disabled: false,
  required: false,
  regList: [],
  changeTag: true,
  proCondition: true
},
{
  label: '金额',
  tag: 'fc-amount',
  tagIcon: 'amount',
  placeholder: '请输入',
  defaultValue: undefined,
  style: { width: null },
  span: 24,
  labelWidth: null,
  min: undefined,
  max: undefined,
  step: undefined,
  'step-strictly': false,
  precision: undefined,
  'controls-position': 'right',
  disabled: false,
  required: false,
  regList: [],
  changeTag: true,
  proCondition: true,
  showChinese: true
}
]

export const selectComponents = [{
  label: '下拉选择',
  tag: 'el-select',
  tagIcon: 'select',
  placeholder: '请选择',
  style: { width: '100%' },
  defaultValue: undefined,
  span: 24,
  labelWidth: null,
  clearable: true,
  disabled: false,
  required: false,
  filterable: false,
  multiple: false,
  options: [{
    label: '选项一',
    value: '选项一'
  }, {
    label: '选项二',
    value: '选项二'
  }],
  regList: [],
  changeTag: true,
  proCondition: true
},
{
  label: '级联选择',
  tag: 'el-cascader',
  tagIcon: 'cascader',
  placeholder: '请选择',
  defaultValue: [],
  span: 24,
  labelWidth: null,
  style: { width: '100%' },
  props: {
    props: {
      multiple: false
    }
  },
  'show-all-levels': true,
  disabled: false,
  clearable: true,
  filterable: false,
  required: false,
  options: [{
    id: 1,
    value: '选项1',
    label: '选项1',
    children: [{
      id: 2,
      value: '选项1-1',
      label: '选项1-1'
    }]
  }],
  dataType: 'static',
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children',
  separator: '/',
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},
{
  label: '省市区',
  tag: 'el-cascader',
  tagIcon: 'area',
  placeholder: '请选择',
  defaultValue: [],
  span: 24,
  labelWidth: null,
  style: { width: '100%' },
  props: {
    props: {
      multiple: false,
    }
  },
  'show-all-levels': true,
  disabled: false,
  clearable: true,
  filterable: false,
  required: false,
  options: PROVINCE,
  dataType: 'static',
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children',
  separator: '/',
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},
{
  label: '单选框组',
  tag: 'el-radio-group',
  tagIcon: 'radio',
  defaultValue: undefined,
  span: 24,
  labelWidth: null,
  style: {},
  optionType: 'default',
  border: false,
  size: 'medium',
  disabled: false,
  required: false,
  options: [{
    label: '选项一',
    value: '选项一'
  }, {
    label: '选项二',
    value: '选项二'
  }],
  regList: [],
  changeTag: true,
  proCondition: true
},
{
  label: '多选框组',
  tag: 'el-checkbox-group',
  tagIcon: 'checkbox',
  defaultValue: [],
  span: 24,
  labelWidth: null,
  style: {},
  optionType: 'default',
  border: false,
  size: 'medium',
  disabled: false,
  required: false,
  options: [{
    label: '选项一',
    value: '选项一'
  }, {
    label: '选项二',
    value: '选项二'
  }],
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},
//   {
//     label: '开关',
//     tag: 'el-switch',
//     tagIcon: 'switch',
//     defaultValue: false,
//     span: 24,
//     labelWidth: null,
//     style: {},
//     disabled: false,
//     required: false,
//     'active-text': '',
//     'inactive-text': '',
//     'active-color': null,
//     'inactive-color': null,
//     'active-value': true,
//     'inactive-value': false,
//     regList: [],
//     changeTag: true,
// proCondition: false,
// asSummary: false
//   },
{
  label: '滑块',
  tag: 'el-slider',
  tagIcon: 'slider',
  defaultValue: null,
  span: 24,
  labelWidth: null,
  disabled: false,
  required: false,
  min: 0,
  max: 100,
  step: 1,
  'show-stops': false,
  range: false,
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},

{
  label: '组织机构',
  tag: 'fc-org-select',
  tagIcon: 'dept',
  defaultValue: null,
  tabList: ['dep'],
  buttonType: 'button',
  title: '组织机构',
  searchable: true,
  maxNum: 1,
  tagConfig: {
    type: 'info',
    closable: true,
    'disable-transitions': false,
    hit: false,
    color: undefined,
    size: 'small',
    effect: 'light'
  },
  style: { width: '100%' },
  span: 24,
  labelWidth: null,
  disabled: false,
  required: true,
  regList: [],
  changeTag: true,
  proCondition: true,
  asSummary: false
},


{
  // el-time-picker
  label: '时间选择',
  tag: 'el-time-picker',
  tagIcon: 'time',
  placeholder: '请选择',
  defaultValue: null,
  span: 24,
  labelWidth: null,
  style: { width: '100%' },
  disabled: false,
  clearable: true,
  required: false,
  'picker-options': {
    selectableRange: '00:00:00-23:59:59'
  },
  format: 'HH:mm:ss',
  'value-format': 'HH:mm:ss',
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},
{
  label: '时间范围',
  tag: 'fc-time-duration',
  showDuration: false,
  tagIcon: 'time-range',
  defaultValue: null,
  span: 24,
  labelWidth: null,
  style: { width: '100%' },
  disabled: false,
  clearable: true,
  required: false,
  'is-range': true,
  'range-separator': '至',
  'start-placeholder': '开始时间',
  'end-placeholder': '结束时间',
  format: 'HH:mm:ss',
  'value-format': 'HH:mm:ss',
  regList: [],
  changeTag: true,
  proCondition: true,
  asSummary: false
},
{
  label: '日期选择',
  tag: 'el-date-picker',
  tagIcon: 'date',
  placeholder: '请选择',
  defaultValue: null,
  type: 'date',
  span: 24,
  labelWidth: null,
  style: { width: '100%' },
  disabled: false,
  clearable: true,
  required: false,
  format: 'yyyy-MM-dd',
  'value-format': 'yyyy-MM-dd',
  readonly: false,
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},
{
  label: '日期范围',
  tag: 'fc-date-duration',
  showDuration: false,
  tagIcon: 'date-range',
  defaultValue: null,
  span: 24,
  labelWidth: null,
  style: { width: '100%' },
  type: 'daterange',
  'range-separator': '至',
  'start-placeholder': '开始日期',
  'end-placeholder': '结束日期',
  disabled: false,
  clearable: true,
  required: false,
  format: 'yyyy-MM-dd',
  'value-format': 'yyyy-MM-dd',
  readonly: false,
  regList: [],
  changeTag: true,
  proCondition: true,
  asSummary: false
},
{
  label: '评分',
  tag: 'el-rate',
  tagIcon: 'rate',
  defaultValue: 0,
  span: 24,
  labelWidth: null,
  style: {},
  max: 5,
  'allow-half': false,
  'show-text': false,
  'show-score': false,
  disabled: false,
  required: false,
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},
//   {
//     label: '颜色选择',
//     tag: 'el-color-picker',
//     tagIcon: 'color',
//     defaultValue: null,
//     labelWidth: null,
//     'show-alpha': false,
//     'color-format': '',
//     disabled: false,
//     required: false,
//     size: 'medium',
//     regList: [],
//     changeTag: true,
// proCondition: false,
// asSummary: false
//   },
{
  label: '附件',
  tag: 'el-upload',
  tagIcon: 'upload',
  action: 'https://jsonplaceholder.typicode.com/posts/',
  defaultValue: [],
  labelWidth: null,
  disabled: false,
  required: false,
  accept: '',
  name: 'file',
  'auto-upload': true,
  showTip: false,
  buttonText: '点击上传附件',
  fileSize: 20,
  sizeUnit: 'MB',
  'list-type': 'text',
  multiple: false,
  regList: [],
  changeTag: true,
  proCondition: false,
  asSummary: false
},
{
  label: '计算公式',
  type: 'calculate',
  tag: 'fc-calculate',
  showChinese: true,
  tagIcon: 'calculate',
  defaultValue: null,
  labelWidth: null,
  disabled: false,
  required: false,
  changeTag: true,
  expression: [],
  proCondition: true,
  asSummary: false
}
]
// 容器组件
export const layoutComponents = [{
  layout: 'rowFormItem',
  rowType: 'layout',
  tagIcon: 'row',
  type: 'default',
  justify: 'start',
  align: 'top',
  label: '布局容器',
  layoutTree: true,
  children: [],
  showDivider: true
},
{
  layout: 'rowFormItem',
  rowType: 'table',
  tagIcon: 'table',
  tag: 'fc-input-table',
  type: 'table', // list
  justify: 'start',
  align: 'top',
  label: '表格/明细',
  layoutTree: false,
  children: [],
  actionText: '添加',
  tableConf: {},
  'show-summary': true,
  defaultValue: []
}]

export const commonComponents = [...inputComponents, ...selectComponents, ...layoutComponents]
  .map( t => Object.assign( { cmpType: 'common' }, t ) )

const getConfigByTag = ( targetList, tag ) => targetList.find( t => t.tag === tag )
const copyConfigAsCustom = ( rowConf, childrenConf ) => {
  const clone = ( target, conf = {} ) => {
    const template = JSON.parse( JSON.stringify( target ) )
    return Object.assign( {}, template, { cmpType: 'custom' }, conf )
  }
  const defaultRow = clone( layoutComponents[0], rowConf )
  defaultRow.children = childrenConf.map( t => clone( t.target, t.config ) )
  return defaultRow
}
// 定制组件添加cmpType = custom
export const customMadeComponents = [
  copyConfigAsCustom( { label: '请假组件', explain: null }, [
    {
      target: getConfigByTag( selectComponents, 'el-select' ),
      config: {
        label: "请假类型",
        required: true,
        options: [
          {
            label: "病假",
            value: "病假"
          },
          {
            label: "事假",
            value: "事假"
          },
          {
            label: "婚假",
            value: "婚假"
          },
          {
            label: "丧假",
            value: "丧假"
          },
          {
            label: "产假",
            value: "产假"
          },
          {
            label: "年假",
            value: "年假"
          }
        ],
      }
    },
    {
      target: getConfigByTag( selectComponents, 'fc-date-duration' ),
      config: {
        required: true,
        label: "日期范围",
        showDuration: true,
      }
    }
  ] ),
  copyConfigAsCustom( { label: "出差组件", explain: null }, [
    {
      target: getConfigByTag( inputComponents, 'el-input' ),
      config: {
        label: "出差事由",
        required: true
      }
    },
    {
      target: getConfigByTag( selectComponents, 'el-select' ),
      config: {
        label: "交通工具",
        required: true,
        options: [
          {
            label: "火车",
            value: "火车"
          },
          {
            label: "飞机",
            value: "飞机"
          },
          {
            label: "汽车",
            value: "汽车"
          },
          {
            label: "其他",
            value: "其他"
          }
        ]
      }
    },
    {
      target: getConfigByTag( selectComponents, 'el-select' ),
      config: {
        label: "单程往返",
        required: true,
        options: [
          {
            label: "单程",
            value: "单程"
          },
          {
            label: "往返",
            value: "往返"
          }
        ]
      }
    },
    {
      target: getConfigByTag( inputComponents, 'el-input' ),
      config: {
        label: "出发城市",
        required: true
      }
    },
    {
      target: getConfigByTag( inputComponents, 'el-input' ),
      config: {
        label: "目的城市",
        required: true
      }
    },
    {
      target: getConfigByTag( selectComponents, 'fc-date-duration' ),
      config: {
        label: "日期范围",
        tag: "fc-date-duration",
        showDuration: true,
        required: true
      }
    },
    {
      target: getConfigByTag( inputComponents, 'el-input' ),
      config: {
        label: "出差备注",
        required: false
      }
    },
    {
      target: getConfigByTag( inputComponents, 'el-input' ),
      config: {
        label: "同行人",
        required: false
      }
    }
  ] )]
// .map( t => Object.assign( { cmpType: 'custom', t } ) )
// 组件rule的触发方式，无触发方式的组件不生成rule
// inputTable组件也有一份此常量的copy 如有改动 最好同步
export const trigger = {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change',
  'fc-amount': 'change',
  'fc-time-duration': 'change',
  'fc-date-duration': 'change',
  'fc-org-select': 'input'
}