<!--
 * @Author: 羊驼
 * @Date: 2023-04-27 11:47:24
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 15:26:41
 * @Description: 节点编辑器
-->
<template>
  <el-drawer
    :visible.sync="approverDrawer"
    custom-class="set_promoter"
    append-to-body
    direction="rtl"
    size="560px"
    :before-close="saveApprover"
  >
    <template v-if="approverConfig">
      <div
        slot="title"
        class="title flex"
      >
        <span v-if="!titleInputFlag">{{ nodeName }}</span>
        <el-input
          maxlength="20"
          autofocus
          v-else
          v-model="nodeName"
          placeholder=""
        ></el-input>
        <!-- 默认条件不需编辑 -->
        <el-button
          class="el-icon-edit edit_button"
          type="text"
          @click="clickEdit"
        ></el-button>
      </div>

      <div>
        <component
          :is="getFormComponent"
          v-model="approverConfig"
          :defaultApprovalDrawer="defaultApprovalDrawer"
        />
      </div>

      <div class="set_promoter_footer flex">
        <!-- 默认条件弹框只展示关闭按钮 -->
        <div v-if="defaultApprovalDrawer">
          <el-button
            type="primary"
            @click="approverDrawer = false"
          >关闭</el-button>
        </div>
        <div
          class="flex"
          v-else
        >
          <el-button
            type="primary"
            @click="saveApprover"
          >确定</el-button>
          <el-button @click="approverDrawer = false">取消</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script>
export default {
  computed: {
    // 获取表单组件
    getFormComponent() {
      if (!this.approverConfig) return;
      return this.$factory.getFormComponentName(this.approverConfig.type);
    },
    defaultApprovalDrawer() {
      return this.approverConfig.nodeName == "默认";
    },
  },
  data() {
    return {
      approverDrawer: false, //审批弹框
      conditionDrawer: false, //条件弹框

      //审批弹框字段Obj
      approverConfig: {},

      hasFlag: false,
      conditionTip: "",
      // 当前编辑节点的id
      currentID: "",
      titleInputFlag: false,
      // 更改的节点名称
      nodeName: "",
    };
  },
  methods: {
    clickEdit() {
      this.titleInputFlag = !this.titleInputFlag;
      if (!this.titleInputFlag && this.nodeName == "默认") {
        this.nodeName = this.approverConfig.nodeName;
        this.titleInputFlag = true;
        return this.$message.error("不能取名为默认");
      }
    },
    //审批人抄送人显示和校验
    setApproverStr() {
      return this.$factory.getTypeTextHandle(
        this.approverConfig.type,
        this.nodeConfig
      );
    },
    //保存弹框设置
    saveApprover() {
      this.approverDrawer = false;
    },
    //保存条件设置
    saveCondition() {
      this.approverDrawer = false;
    },
    //打开弹框
    openDrawer(data) {
      this.approverDrawer = true;
      this.titleInputFlag = false;
      // 默认条件
      this.approverConfig = JSON.parse(JSON.stringify(data));
      this.nodeName = this.approverConfig.nodeName;
    },
  },
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
}
.edit_button {
  margin-left: 10px;
}
//弹框
.set_promoter {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 0 24px;
    border-bottom: 1px solid #ebebeb;

    .title {
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      color: #333;
      justify-content: flex-start;

      i {
        margin-left: 8px;
        font-size: 30px;
      }
      .el-input {
        width: 80%;
      }
    }
  }

  .el-drawer__body {
    overflow-y: auto;
    max-height: calc(100% - 64px);
    padding-bottom: 80px;
  }

  .drawer-content {
    padding: 0 24px;

    /deep/ .el-radio {
      margin-bottom: 16px;

      .mark {
        color: #828282;
      }

      &.is-checked {
        .mark {
          color: #4880ff;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .drawer-content-condition {
    padding: 24px 0;

    .condition-conent-group {
      border-bottom: solid 1px #ebebeb;
      padding-bottom: 20px;

      .condition-group-title {
        padding: 0 24px;
        background: #f7f8fa;
        height: 48px;
        border-top: solid 1px #ebebeb;
        border-bottom: solid 1px #ebebeb;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .condition-group-select {
        padding: 0 24px;
      }

      .remove {
        color: #828282;

        &:hover {
          cursor: pointer;
          color: #4880ff;
        }
      }

      .mg-bot-10 {
        margin-bottom: 10px;
      }

      .conditionbtn {
        .el-button {
          border: 1px dashed #4880ff;
          width: 110px;
        }
      }
    }

    .conditionbtn {
      padding: 0 24px;
      margin-top: 26px;

      .el-button {
        border: solid 1px #4880ff;
        color: #4880ff;
        width: 123px;
      }
    }
  }

  .set_promoter_footer {
    height: 80px;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 24px;
    justify-content: flex-end;
    background: #fff;
    width: 100%;
    border-top: 1px solid #ebebeb;
    z-index: 2;
  }

  .icon-icon_explain {
    color: #bfbfbf;
  }
}
.error_tip {
  position: absolute;
  top: 36px;
  right: 0px;
  transform: translate(150%, 0px);

  i {
    font-size: 24px;
  }
}

.add-node-popover-body {
  display: flex;
}

.el-drawer:focus,
.el-drawer__close-btn:focus {
  outline: none;
}
</style>