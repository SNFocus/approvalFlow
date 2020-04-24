<template>
  <el-row class="cmp-container" :gutter="12">
    <el-col :span="4" class="label">{{title}}</el-col>
    <el-col :span="18">
      <el-radio-group v-model="cloneData" class="radio-group" @change="onTypeChange">
        <el-radio v-for="(item,index) in options" :label="item.label" :key="index">{{item.label}}</el-radio>
      </el-radio-group>
    </el-col>
    <el-col :span="2" class="icon-wrapper">
      <i class="el-icon-delete"  @click="$emit('delete')"></i>
    </el-col>
  </el-row>
</template>
<script>
export default {
  model: {
    prop: "value",
    event: "update"
  },
  props: ["value", "title", "options"],
  data() {
    return {
      cloneData: this.value
    };
  },
  methods: {
    onTypeChange(newVal) {
      this.update();
    },
    update() {
      this.$emit("update", this.cloneData);
    }
  }
};
</script>
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
  line-height: 22px;
}

.icon-wrapper {
  i {
    cursor: pointer;
    color: #c5c5c5;

    &:hover {
      color: #333;
    }
  }
}
</style>