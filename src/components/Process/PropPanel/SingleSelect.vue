<template>
  <el-row class="cmp-container" :gutter="12">
    <el-col :span="4" class="label">{{title}}</el-col>
    <el-col :span="18" style="padding-left:12px;">
      <el-select v-model="cloneData" placeholder="请选择" size="small" @change="update">
        <el-option
          v-for="(item,index) in options"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
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

  >>> .el-select:hover .el-input__inner {
    border-color: #529eff;
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
  i {
    cursor: pointer;
    color: #c5c5c5;

    &:hover {
      color: #333;
    }
  }
}
</style>