<template>
  <div class="page">
    <header class="page__header">
      <div class="page-actions">
        <div style="border-right:1px solid #c5c5c5;" @click="exit">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div>补卡申请</div>
      </div>
      <div class="step-tab">
        <div
          v-for="(item, index) in steps"
          :key="index"
          class="step"
          :class="[activeStep==item.key?'active':'']"
          @click="changeSteps(item)"
        >
          <span class="step-index">{{index+1}}</span>
          {{item.label}}
        </div>
        <div class="ghost-step step" :style="{transform: `translateX(${steps.findIndex(t => t.key === activeStep) * 100}%)`}"></div>
      </div>
      <el-button size="small" class="publish-btn">发 布</el-button>
    </header>
    <section class="page__content">
      <BasicSetting v-show="activeStep === 'basicSetting'" /> 
      <DynamicForm v-show="activeStep === 'formDesign'" />
      <Process v-show="activeStep === 'processDesign'" />
      <AdvancedSetting v-show="activeStep === 'advancedSetting'"/>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import Process from "@/components/Process";
import DynamicForm from "@/components/DynamicForm";
import BasicSetting from '@/components/BasicSettingForm'
import AdvancedSetting from '@/components/AdvancedSetting'
export default {
  name: "Home",
  data() {
    return {
      activeStep: "basicSetting", // 激活的步骤面板
      steps: [
        { label: "基础设置", key: "basicSetting" },
        { label: "表单设计", key: "formDesign" },
        { label: "流程设计", key: "processDesign" },
        { label: "高级设置", key: "advancedSetting" }
      ]
    };
  },
  methods: {
    changeSteps(item) {
      this.activeStep = item.key;
    },
    exit() {
      console.log(this.$store.state.hasEdited)
      if(!this.$store.state.hasEdited) console.log('exit')
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  components: {
    Process,
    DynamicForm,
    BasicSetting,
    AdvancedSetting
  }
};
</script>
<style lang="stylus" scoped>
$header-height = 54px;
.page {
  width: 100vw;
  height: 100vh;
  padding-top: $header-height;
  box-sizing: border-box;

  .page__header {
    width: 100%;
    height: $header-height;
    flex-center()
    justify-content: space-between;
    box-sizing: border-box;
    color: white;
    background: #3296fa;
    font-size: 14px;
    position: fixed;
    top: 0;

    .page-actions {
      height: 100%;
      text-align: center;
      line-height: $header-height;

      > div {
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: inline-block;
      }

      i {
        font-size: 22px;
        vertical-align: middle;
      }
    }

    .step-tab {
      display: flex;
      justify-content: center;
      height: 100%;
      position: relative;

      >.step {
        width: 140px;
        line-height: $header-height;
        padding-left: 30px;
        padding-right: 30px;
        cursor: pointer;
        position: relative;

        &.ghost-step{
          position: absolute;
          height: $header-height;
          left: 0;
          z-index: -1;
          background: #4483f2;
          transition: transform .5s;

          &::after {
            content: '';
            border-width: 6px 6px 6px;
            border-style: solid;
            border-color: transparent transparent white;
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -6px;
          }
        }

        &.active >.step-index  {
          background: white;
          color: #4483f2;
        }

        >.step-index {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 1px solid #fff;
          border-radius: 8px;
          line-height: 18px;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
  }

  .page__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    background #f5f5f7
  }
}

.publish-btn {
  margin-right: 20px;
  color: #3296fa;
  padding: 7px 20px;
  border-radius: 4px;
  font-size: 14px;
}
</style>
