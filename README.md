# 仿钉钉后台审批流程
> 被割韭菜的项目，不曾想放到GitHub上居然有人给了Star，人生第一次，分享出来给大家，虽然多半没什么用，供大家一乐也好。垃圾代码，还望轻喷。

基于JakHuang大佬的[form-generator](https://github.com/JakHuang/form-generator)的，仿钉钉后台审批流程创建界面

[Gitee预览入口](http://soning.gitee.io/approvalflow/)
## 主要功能
1. 表单配置(form-generator)
  - 拖拽表单，填写组件配置
  - 根据配置的JSON生成预览页面
2. 流程节点配置(仿钉钉界面)
  - 创建审批流程(发起人，审批人，条件节点，抄送人), 配置节点详细数据
  - 必填节点校验

## 基本结构
```
// src
|-- components
|---- BasicSetting // 基础设置
|---- DynamicForm      // 表单配置
|---- Process          // 流程配置
|---- AdvancedSetting  // 高级设置
|---- FormControls     // 扩充表单组件

|-- views
|---- admin  // 后台配置界面
|---- custom // 前台预览界面
```
> 不想把JakHuang大佬的项目拆分出来 一是为了方便学习大佬代码 二是为了以后单独抽离表单出来更方便 所以没有把form-generator项目的公用文件抽离到顶层 流程创建组件同理

## 表单组件
1. 单行输入框, 多行输入框, 数字输入框, 金额
2. 下拉选择, 级联选择, 省市区
3. 单选框组, 多选框组
4. 时间选择, 时间范围, 日期选择, 日期范围
5. 滑块, 组织机构, 附件
6. 布局容器, 表格

## 界面预览
![YL5ip8.png](https://s1.ax1x.com/2020/05/22/YL5ip8.png)
![YL5AXQ.png](https://s1.ax1x.com/2020/05/22/YL5AXQ.png)
![YL5k6g.png](https://s1.ax1x.com/2020/05/22/YL5k6g.png)
![YL5Cff.png](https://s1.ax1x.com/2020/05/22/YL5Cff.png)
![YL5F1S.png](https://s1.ax1x.com/2020/05/22/YL5F1S.png)
![YL5Z0s.png](https://s1.ax1x.com/2020/05/22/YL5Z0s.png)
![YL5Vmj.png](https://s1.ax1x.com/2020/05/22/YL5Vmj.png)

## 郑重感谢
作为萌新，非常感谢JakHuang大大的[form-generator](https://github.com/JakHuang/form-generator)为我解决了很多问题，也从中学习到了很多，写项目过程中魔改了大佬代码，望大大见谅，哈哈。再者就是我fork `form-generator`版本和JakHuang大大现在的版本也有很大的区别，感兴趣的童鞋可以去JakHuang那儿看看。

