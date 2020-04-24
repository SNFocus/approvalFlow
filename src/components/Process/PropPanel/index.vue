
<template>
  <el-drawer
    size="550px"
    class="drawer"
    :visible.sync="visible"
    :show-close="false"
    style="text-align:left;"
    @close="cancel"
    v-if="properties"
    
  >
    <!-- 标题 -->
    <header slot="title" class="header"  v-if="value && value.type=='start' && properties.title">{{properties.title}}</header>
    <header slot="title" class="header" v-else>
      <span @click="onTitleEdit" v-show="!titleInputVisible" style="cursor:pointer;">
        {{properties.title}}
        <i class="el-icon-edit"></i>
      </span>
      <el-input
        size="mini"
        v-model="properties.title"
        v-show="titleInputVisible"
        v-clickoutside="_ => titleInputVisible=false"
        style="z-index:9;max-width: 200px;"
      ></el-input>
      <el-select
        v-if="isConditionNode()"
        v-model="properties.priority"
        size="mini"
        class="priority-select"
      >
        <el-option v-for="item in priorityLength" :key="item" :value="item-1" :label="'优先级'+item"></el-option>
      </el-select>
    </header>

    <!-- 属性面板编辑区 -->
    <!-- 条件  -->
    <section  tabindex="1" style="height:100%;" v-if="isConditionNode()">
      <template v-for="(item,index) in pconditions">
        <!-- 计数 -->
        <num-input
          v-if="couldShowIt(item,'el-input-number')"
          v-model="item.conditionValue"
          :title="item.label"
          :key="index"
          @delete="onDelCondition(item)"
        ></num-input>
        <!-- 单选组 -->
        <radio-group
          v-if="couldShowIt(item,'el-radio-group')"
          v-model="item.conditionValue"
          :options="item.options"
          :key="index"
          @delete="onDelCondition(item)"
          :title="item.label"
        ></radio-group>
        <!-- 下拉 -->
        <single-select
          v-if="couldShowIt(item,'el-select')"
          v-model="item.conditionValue"
          :options="item.options"
          :title="item.label"
          :key="index"
          @delete="onDelCondition(item)"
        ></single-select>
      </template>
      <div style="padding-left:10px;margin-top:2em;">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">添加条件</el-button>
        <span style="color:#aaa;margin-left:16px;">还有{{notUseConNum}}个可用条件</span>
      </div>
    </section>

    <!-- 审批人 -->
    <section  tabindex="1" class="approver-pane" style="height:100%;" v-else>
      <el-tabs v-model="activeName" style="height:100%;">
        <el-tab-pane label="设置审批人" name="approverConf">
          <div style="padding: 12px;">
            <el-radio-group v-model="assigneeType" style="line-height: 32px;">
              <el-radio v-for="item in assigneeTypeOptions" :label="item.value" :key="item.value" class="radio-item">{{item.label}}</el-radio>
            </el-radio-group>
          </div>
          <div style="border-bottom: 1px solid #e5e5e5;padding-bottom: 1rem;">
            <div v-if="assigneeType === 'myself'"  class="option-box" style="color: #a5a5a5;">发起人自己将作为审批人处理审批单</div>
            <div v-else-if="assigneeType === 'optional'"  class="option-box">
              <p>可选多人</p>
              <el-switch v-model="optionalMultiUser" active-color="#13ce66"> </el-switch>
              <p>选择范围</p>
              <el-select v-model="optionalRange" size="mini">
                <el-option v-for="(item, index) in rangeOptions" :key="index" :label="item.label" :value="item.value"
                  :disabled="item.disabled"></el-option>
              </el-select>
            </div>
            <div v-else class="option-box">
              <el-button type="primary" icon="el-icon-plus" size="small">添加{{assigneeTypeOptions.find(t=>t.value == assigneeType).label}}</el-button>
            </div>
          </div>
          <div class="option-box" style="border-bottom: 1px solid #e5e5e5;" v-if="!['optional','myself'].includes(assigneeType)">
            <p>多人审批时采用的审批方式</p>
            <el-radio v-model="counterSign" :label="true" class="radio-item">会签（须所有审批人同意）</el-radio>
            <br>
            <el-radio  v-model="counterSign"  :label="false" class="radio-item">或签（一名审批人同意或拒绝即可）</el-radio>
          </div>
          <div class="option-box">
            <p>抄送人</p>
            <el-button type="primary" icon="el-icon-plus" size="small">添加成员</el-button>
          </div>

        </el-tab-pane>
        <el-tab-pane label="表单权限" name="formAuth">
          <div class="form-auth-table">
            <header class="auth-table-header">
              <div class="row">
                <div class="label">表单字段</div>
                <el-radio-group v-model="globalFormOperate"  class="radio-group" @change="changeAllFormOperate">
                  <el-radio :label="2" style="margin-left: 1rem;">可编辑</el-radio>
                  <el-radio :label="1">只读</el-radio>
                  <el-radio :label="0">隐藏</el-radio>
                </el-radio-group>
              </div>
            </header>
            <div class="auth-table-body">
              <div v-for="item in formOperates" :key="item.formId" class="row">
                <div class="label">
                  <span class="required" v-show="item.required">*</span>
                  {{item.label}}
                </div>
                <el-radio-group v-model="item.formOperate"  class="radio-group">
                  <el-radio :label="2" style="margin-left: 1rem;"><span style="opacity: 0;">可编辑</span></el-radio>
                  <el-radio :label="1"><span style="opacity: 0;">只读</span></el-radio>
                  <el-radio :label="0"><span style="opacity: 0;">隐藏</span></el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </section>

    <el-dialog title="选择条件" :visible.sync="dialogVisible" width="500px" :append-to-body="true" custom-class="condition-dialog">
      <el-checkbox-group v-model="showingPCons">
        <el-checkbox v-for="(item,index) in pconditions" :key="index" :label="item.formId">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </el-dialog>
    <div class="actions">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button size="small" type="primary" @click="confirm">确定</el-button>
    </div>
  </el-drawer>
</template>
<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
import NumInput from "./NumInput";
import radioGroup from "./radioGroup";
import SingleSelect from "./SingleSelect";
import { NodeUtils } from "../FlowCard/util.js";
const rangeType = {
  'lt': '<',
  'lte':'≤',
  'gt':'>',
  'gte':'≥',
  'eq': '=',
}
export default {
  props: [/*当前节点数据*/"value", /*整个节点数据*/"processData"],
  data() {
    return {
      properties: {},  // 当前节点数据
      visible: false,  // 控制面板显隐
      titleInputVisible: false, // 是否显示标题输入框  startNode 不显示
      activeName: "approverConf", // or formAuth  Tab面板key
      assigneeType: "user", // 指定审批人
      priorityLength: 0, // 当为条件节点时  显示节点优先级选项的数据
      pconditions: [], // 从vuex中获取的可以作为流程图条件的集合
      showingPCons: [], // 用户选择了得条件  被选中的才会被展示在面板上编辑
      dialogVisible: false, // 控制流程条件选项Dialog显隐
      formOperates:[], // 表单操作权限集合
      counterSign: true, //是否为会签
      globalFormOperate: null,
      // 只有审批类型为自选 才有这两个选项 optionalMultiUser optionalRange
      optionalMultiUser: false,
      optionalRange: 'ALL', // USER<最多十个> / ALL / ROLE 

      optionalOptions: [{
        label: '自选一个人',
        value: false
      }, {
        label: '自选多个人',
        value: true
      }],
      rangeOptions: [{
        label: '全公司',
        value: 'ALL'
      }, {
        label: '指定成员',
        value: 'USER'
      }, {
        label: '角色',
        value: 'ROLE'
      }],
      assigneeTypeOptions:[{
        label:'指定成员',
        value: 'user'
      },
      {
        label:'主管',
        value: 'director'
      },
      {
        label:'角色',
        value: 'role'
      },
      {
        label:'岗位',
        value: 'position'
      },
      {
        label:'发起人自己',
        value: 'myself'
      },
      {
        label:'发起人自选',
        value: 'optional'
      }]
    };
  },
  computed: {
    // 未使用的条件个数
    notUseConNum() {
      return this.pconditions.length - this.showingPCons.length;
    },
    usedFormItems(){
      return this.$store.state.formItemList
    }
  },
  directives: {
    Clickoutside
  },
  methods: {
    changeAllFormOperate(val){
      this.formOperates.forEach(t => t.formOperate = val)
    },
    // 是否可以显示当前条件组件
    couldShowIt(item, tag) {
      return tag === item.tag && this.showingPCons.includes(item.formId);
    },
    // 打开title输入框
    onTitleEdit() {
      this.titleInputVisible = true;
    },
    initFormOperates(){
      const formOperates = this.value.properties && this.value.properties.formOperates || []
      const defaultType = this.isApproverNode() ? 1 : 2 // 操作权限 0 隐藏 1 只读 2 可编辑
      const getPermissionById = id => {
        const permission = formOperates.find(t => t.formId === id)
        return permission !== undefined ? permission.formOperate : defaultType
      }

      this.formOperates = this.$store.state.formItemList.map(t => ({
        required: t.required,
        label: t.label, 
        formId: t.formId, 
        formOperate: getPermissionById(t.formId)
      }))
      console.log(this.formOperates )
    },
    conditionNodeComfirm(){
      let nodeContent = ''
      const conditions = []
      this.showingPCons
      .map(fid => this.pconditions.find(t => t.formId === fid))
      .forEach((t)=> {
        const cValue = t.conditionValue
        if(cValue === undefined || cValue === null){
          return 
        }
        if(t.tag == 'el-input-number'){
          if(cValue.type === 'bet'){
            const numVal = cValue.value
            nodeContent += `[${numVal[0]} ${rangeType[numVal[1]]} ${t.label} ${rangeType[numVal[2]]} ${numVal[3]}] ` + '\n'
          }else{
            nodeContent +=  `[${t.label} ${rangeType[cValue.type]} ${cValue.value}] ` + '\n'
          }
        }else{
          nodeContent +=  `[${t.label} = ${cValue}] ` + '\n'
        }

        const res = {
          formId: t.formId,
          conditionValue: cValue
        }
        // this.$store.commit('usePCondition', res.formId)
        conditions.push(res)
      }, [])

      this.properties.conditions = conditions
      this.$emit("confirm", this.properties, nodeContent);
      this.visible = false;
    },
    approverNodeComfirm(){
      this.properties.formOperates = this.formOperates.map(t=>({formId: t.formId, formOperate: t.formOperate}))
      this.$emit("confirm", this.properties);
      this.visible = false;
    },
    // 确认修改
    confirm() {
      this.value.type === 'condition' ? this.conditionNodeComfirm() : this.approverNodeComfirm()
    },
    // 关闭抽提面板
    cancel() {
      setTimeout(()=>{
        this.$emit("cancel");
        this.visible = false;
      }, 0)
    },
    onDelCondition(condition){
      const index = this.showingPCons.findIndex(id => id === condition.formId)
      if(index > -1){
        this.showingPCons.splice(index, 1)
        this.pconditions.find(t => t.formId === condition.formId).conditionValue = undefined
      }
    },
    // 配合getPriorityLength 获取前一个节点条件数组长度 用于设置优先级
    getPrevData() {
      return NodeUtils.getPreviousNode(this.value.prevId, this.processData);
    },
    // 用于获取节点优先级范围
    getPriorityLength() {
      this.priorityLength = this.getPrevData().conditionNodes.length;
    },
    // 判断是否是条件节点
    isConditionNode() {
      return this.value ? NodeUtils.isConditionNode(this.value) : false;
    },
    isApproverNode(){
      return this.value ? NodeUtils.isApproverNode(this.value) : false;
    },
    initPConditionValues(){
      let nodeConditions = this.value.properties && this.value.properties.conditions
      this.pconditions = JSON.parse(JSON.stringify(this.$store.state.processConditions));
      if(Array.isArray(this.pconditions)){
        let temp = undefined
        this.showingPCons = []
        this.pconditions.forEach(t => {
          if(Array.isArray(nodeConditions)){
            const con = nodeConditions.find(item => item.formId == t.formId)
            con && con.conditionValue && (temp = con.conditionValue, this.showingPCons.push(t.formId))
          }
          t.conditionValue = temp
        })
      }
    },
  },
  watch: {
    visible(val) {
      if (!val) return 
      this.initFormOperates()
      this.initPConditionValues()
    },

    value(newVal) {
      if (newVal && newVal.properties) {
        this.visible = true;
        this.properties = JSON.parse(JSON.stringify(newVal.properties));
        if (this.properties) {  
          this.activeName = NodeUtils.isConditionNode(newVal)
            ? ""
            : "approverConf";
          NodeUtils.isConditionNode(newVal) && this.getPriorityLength();
        }
      } 
    }
  },
  components: {
    "num-input": NumInput,
    "radio-group": radioGroup,
    "single-select": SingleSelect
  }
};
</script>
<style lang="stylus">
.condition-dialog {
  .el-dialog__header{
    border-bottom : 1px solid #eee;
  }
}
</style>
<style lang="stylus" scoped>
.drawer {
  >>> .el-drawer__header {
    margin-bottom: 0;
    border-bottom: 1px solid #c5c5c5;
    padding-bottom: 8px;
  }

  >>> .el-drawer__body {
    padding-bottom: 44px;
  }

  >>> .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }

  >>> .el-tabs__header {
    margin-bottom: 0;
  }

  >>> .el-tabs__content {
    height: calc(100% - 40px);
    overflow: scroll;
  }
}

.header {
  line-height: 28px;
}

.actions {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 6px 12px;
  width: 100%;
  box-sizing: border-box;
}

.radio-item {
  width: 110px;
  padding: 6px;
}

.priority-select {
  width: 118px;
  position: absolute;
  right: 26px;
}

.form-auth-table{
  .auth-table-header{
    background: #fafafa
    line-height: 40px;
  }
  .row{
    display: flex;
    align-items: center;
    line-height: 32px;
    padding: 8px 12px;
    border-bottom: 1px solid #efefef;
    &:hover{
      background: #f5f7fa;
    }
    .label{
      flex:1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .required{
        color: #f2725e;
      }
    }
    .radio-group{
      flex: 2;
      display: flex;
      justify-content: space-between;
    }
  }
}

.approver-pane{
  .option-box {
    font-size: 14px;
    padding-left: 1rem;
  }
  
}
</style>