
# 简介
> 练习Demo——基于JakHuang大佬的[form-generator](https://github.com/JakHuang/form-generator)的，仿钉钉后台审批流程管理界面

## form-generator删减情况
注释了运行，生成vue文件等功能，只在内部生成JSON

## 流程节点删减
只有发起人，审批人，条件节点，将抄送人移到了审批人属性面板中设置


条件后面创建条件，会在两个条件之间增加一个隐藏得空节点empty

## 界面
![JB7tHI.png](https://s1.ax1x.com/2020/04/24/JB7tHI.png)
![JB7W5V.png](https://s1.ax1x.com/2020/04/24/JB7W5V.png)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```