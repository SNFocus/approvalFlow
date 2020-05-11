<template functional>
  <el-row class="cmp-container" :gutter="12">
    <el-col :span="4" class="label">{{props.title}}</el-col>
    <el-col :span="18" style="padding-left:12px;">
      <slot></slot>
    </el-col>
    <el-col :span="2" class="icon-wrapper">
      <slot name="action"></slot>
    </el-col>
  </el-row>
</template>
<style lang="stylus" scoped>
// 三点省略 支持单行多行
// Mixin { n:Number } n：省略行数限制
ellipsis(n) {
  overflow: hidden;
  text-overflow: ellipsis;

  if (n > 1) {
    display: -webkit-box;
    -webkit-line-clamp: n;
    -webkit-box-orient: vertical;
  } else {
    white-space: nowrap;
  }
}

.cmp-container {
  line-height: 30px;
  padding: 10px;

  >>> .el-radio {
    width: 25%;
    margin-right: 0;
  }
}

.radio-group {
  width: 100%;
  line-height: 32px;
  padding-left: 5px;
}

.label {
  font-size: 12px;
  padding-right: 16px !important;
  ellipsis(2);
}

.icon-wrapper {
  >>> i {
    cursor: pointer;
    color: #c5c5c5;

    &:hover {
      color: #333;
    }
  }
}
</style>