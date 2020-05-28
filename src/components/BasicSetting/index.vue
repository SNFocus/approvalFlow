<template>
  <div class="setting-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"
      label-position="top">
      <el-form-item label="审批名称" prop="flowName">
        <el-input v-model="formData.flowName" placeholder="请输入审批名称" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label="选择分组" prop="flowGroup">
        <el-select v-model="formData.flowGroup" placeholder="请选择选择分组" clearable :style="{width: '100%'}">
          <el-option v-for="(item, index) in flowGroupOptions" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="谁可以发起审批" prop="approver">
        <fc-org-select
          ref="org-select"
          v-model="formData.initiator" 
          :tabList="['dep&user']" 
          title="发起人" 
          @change="emitInitiator" />
          <span style="font-size: 12px; color: #aaa;">默认所有人</span>
      </el-form-item>
      <el-form-item label="模板图标" prop="icon">
        <img :src="activeIconSrc" style="width: 28px;height: 28px;vertical-align: middle;">
        <el-button  plain size="mini" @click="dialogVisible = true" style="margin-left: 10px;">选择图标</el-button>
      </el-form-item>
      <el-form-item label="审批说明" prop="flowRemark">
        <el-input v-model="formData.flowRemark" type="textarea" placeholder="请输入审批说明" :maxlength="100"
          show-word-limit :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
      </el-form-item>
    </el-form>
    <el-dialog
      title="选择图标"
      :visible.sync="dialogVisible"
      width="612px">
      <img 
      v-for="(icon, index) in iconList" 
      :key="index" :src="icon.src" 
      class="icon-item" 
      :class="{active: selectedIcon === icon.id}"
      @click="selectedIcon = icon.id">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false; selectedIcon = activeIcon" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false; activeIcon = selectedIcon" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['tabName', 'initiator', 'conf'],
  data() {
    const req = require.context( '@/assets/approverIcon', false, /\.png$/ )
    const iconList = req.keys().map((t, idx) => ({src: req(t), id: idx}))
    return {
      dialogVisible: false,
      activeIcon: iconList[0].id,
      selectedIcon: iconList[0].id,
      formData: {
        flowName: '',
        flowImg: '',
        flowGroup: undefined,
        flowRemark: undefined,
        initiator: null
      },
      rules: {
        flowName: [{
          required: true,
          message: '请输入审批名称',
          trigger: 'blur'
        }],
        flowGroup: [{
          required: true,
          message: '请选择选择分组',
          trigger: 'change'
        }],
      },
      iconList,
      flowGroupOptions: [{
        "label": "假勤管理",
        "value": 1
      }, {
        "label": "人事管理",
        "value": 2
      }, {
        "label": "财务管理",
        "value": 3
      }, {
        "label": "业务管理",
        "value": 4
      }, {
        "label": "行政管理",
        "value": 5
      }, {
        "label": "法务管理",
        "value": 6
      }, {
        "label": "其他",
        "value": 7
      }],
    }
  },
  computed: {
    activeIconSrc(){
      const icon = this.iconList.find(t => t.id === this.activeIcon)
      return icon ? icon.src : ''
    }
  },
  created() {
    if (typeof this.conf === 'object' && this.conf !== null) {
      Object.assign(this.formData, this.conf)
    }
  },
  methods: {
    emitInitiator(){
      this.$nextTick(()=>{
        this.$emit('initiatorChange', this.formData.initiator, this.$refs['org-select'].selectedLabels)
      })
    },
    // 给父级页面提供得获取本页数据得方法
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate(valid => {
          if (!valid) {
            reject({ target: this.tabName})
            return
          }
          this.formData.flowImg = this.activeIcon
          resolve({ formData: this.formData, target: this.tabName})  // TODO 提交表单
        })
      })
    },
  },
  watch:{
    initiator:{
      handler (val) {
        this.formData.initiator = val
      },
      immediate: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.icon-item{
  width 40px
  height 40px 
  margin: 6px;
  position relative
  cursor pointer
  opacity .5

  &.active{
    opacity 1
  }
  &:hover{
    opacity 1
  }
}

.setting-container{
  width: 600px;
  height: 100%;
  margin: auto;
  background: white;
  padding: 16px;

  >>>.el-form--label-top .el-form-item__label{
    padding-bottom: 0;
  }
}
</style>>

