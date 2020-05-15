
# 简介
> 基于JakHuang大佬的[form-generator](https://github.com/JakHuang/form-generator)的，仿钉钉后台审批流程管理界面
## 主要功能
1. 表单配置
  - 拖拽表单，填写组件配置
  - 根据配置的JSON生成预览页面
2. 流程节点配置
  - 创建审批流程(发起人，审批人，条件节点，抄送人), 配置节点详细数据
  - 必填节点校验

## 基本结构
```
// src
|-- components
|---- BasicSettingForm // 基础设置
|---- DynamicForm      // 表单配置
|---- Process          // 流程配置
|---- AdvancedSetting  // 高级设置
|---- FormControls     // 扩充表单组件

|-- views
|---- admin  // 后台配置界面
|---- custom // 前台预览界面
```
> 不想把JakHuang大佬的项目拆分出来 一是为了学习大佬代码 二是为了以后单独抽离表单出来更方便 所以没有把form-generator项目的公用文件抽离到顶层 流程创建组件同理

## 表单组件
单行输入框, 多行输入框, 数字输入框, 金额, 下拉选择, 级联选择, 省市区, 单选框组, 多选框组, 滑块, 组织机构, 时间选择, 时间范围, 日期选择, 日期范围, 附件, 布局容器, 表格/明细

## 界面预览
![JB7tHI.png](https://s1.ax1x.com/2020/04/24/JB7tHI.png)
![JB7W5V.png](https://s1.ax1x.com/2020/04/24/JB7W5V.png)

## 运行项目
```
npm run serve // 运行
npm run build // 打包
```