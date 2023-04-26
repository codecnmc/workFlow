<template>
  <div class="nodeflow-components">
    <component
      :is="getComponent"
      :isTried.sync="isTried"
      @openDrawer="setPerson"
      v-model="nodeConfig"
    />
    <nodeWrap
      v-if="nodeConfig.childNode"
      v-model="nodeConfig.childNode"
      :isTried.sync="isTried"
    ></nodeWrap>
    <el-drawer
      :visible.sync="approverDrawer"
      custom-class="set_promoter"
      append-to-body
      direction="rtl"
      size="560px"
      :before-close="saveApprover"
    >
      <div
        slot="title"
        class="title flex"
      >
        <span v-if="!approverConfig.titleInputFlag">{{ approverConfig.nodeName }}</span>
        <el-input
          maxlength="20"
          autofocus
          v-else
          v-model="approverConfig.nodeName"
          @blur="nodeNameBlur"
          placeholder=""
        ></el-input>
        <!-- 默认条件不需编辑 -->
        <i
          v-if="!defaultApprovalDrawer"
          class="iconfont icon-icon_edit1 mainColor"
          @click="editNodename"
        ></i>
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
    </el-drawer>

  </div>
</template>
<script>
// 是否 修改成导入配置形式?
import addNode from "./addNode";
import branch from "./node/branch.vue";
import normal from "./node/normal.vue";

import auditForm from "./form/auditForm.vue";
import carbonForm from "./form/carbonForm.vue";
import conditionForm from "./form/conditionForm.vue";
export default {
  name: "nodeWrap",
  components: { addNode, branch, normal, auditForm, carbonForm, conditionForm },
  props: ["isTried", "value"],
  model: {
    prop: "value",
    event: "input",
  },
  data() {
    return {
      //审批弹框字段Obj
      approverConfig: {},
      searchUser: "",
      nodeUser: "", //审批人（stringList）
      approverDrawer: false, //审批弹框
      defaultApprovalDrawer: false, //默认条件弹框
      conditionDrawer: false, //条件弹框
      //条件弹框字段
      conditionsConfig: {},
      conditionConfig: {}, //条件弹框item

      // -----
      isInputList: [],
      isInput: false,
      hasFlag: false,
      conditionTip: "",
      bPriorityLevel: "",
    };
  },
  provide() {
    return {
      setApproverStr: this.setApproverStr,
      conditionStr: this.conditionStr,
    };
  },
  watch: {
    approverDrawer(val) {
      if (!val) {
        this.defaultApprovalDrawer = false;
        this.hasFlag = false;
        this.conditionTip = "";
      }
    },
  },
  computed: {
    // v-model绑定
    nodeConfig: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    // 获取节点组件
    getComponent() {
      let nodeType = this.$nodeType;
      switch (this.nodeConfig.type) {
        case nodeType.开始:
        case nodeType.审核人:
        case nodeType.抄送人:
        case nodeType.办理人:
        case nodeType.结束:
          return "normal";
        case nodeType.条件分支:
          return "branch";
      }
    },
    // 获取表单组件
    getFormComponent() {
      let nodeType = this.$nodeType;
      switch (this.approverConfig.type) {
        case nodeType.审核人:
          return "auditForm";
        case nodeType.抄送人:
          return "carbonForm";
        case nodeType.条件:
          return "conditionForm";
      }
    },
  },
  mounted() {
    // 检测这个节点是不是结束

  },
  methods: {
    //修改节点name
    editNodename() {
      this.$set(this.approverConfig, "titleInputFlag", true);
    },
    nodeNameBlur() {
      this.$set(this.approverConfig, "titleInputFlag", false);
    },
    dealStr(str, obj) {
      let arr = [];
      let list = str.split(",");
      for (var elem in obj) {
        list.map((item) => {
          if (item == elem) {
            arr.push(obj[elem].value);
          }
        });
      }
      return arr.join("或");
    },
    //保存弹框设置
    saveApprover() {
      if (this.approverConfig.type === 3) {
        this.saveCondition();
        return;
      }
      let list = this.approverConfig.nodeUserType.valueList;
      let nameList = []; // 下拉框:审批角色是name，指定用户是userName
      if (list.length > 0) {
        this.useroptions.forEach((item) => {
          list.forEach((i) => {
            if (this.approverConfig.nodeUserType.type === "role") {
              if (item.id === i) nameList.push(item.name);
            }
            if (this.approverConfig.nodeUserType.type === "user") {
              if (item.id === i) nameList.push(item.userName);
            }
          });
        });
        this.approverConfig.nodeUserType.value = list.join(",");
        this.approverConfig.nodeUserType.valueName = nameList.join(",");
      } else if (this.approverConfig.nodeUserType.type !== "manager") {
        this.approverConfig.nodeUserType.value = "";
        this.approverConfig.nodeUserType.valueName = "";
      }
      if (this.approverConfig.nodeUserType.type === "manager") {
        //抄送 、审批人逐级审批
        if (this.approverConfig.type === 2 || this.approverConfig.type === 1) {
          let num = this.approverConfig.nodeUserType.value;
          if (num.indexOf("m") !== -1) {
            num = num.substring(2);
          }
          // this.directorLevelList.forEach((item, index) => {
          //   if (index === num - 1)
          //     this.approverConfig.nodeUserType.valueName = item.label;
          // });
          // 默认值
          if (
            this.approverConfig.type === 1 &&
            this.approverConfig.nodeUserType.type == "manager" &&
            !this.approverConfig.nodeUserType.value
          ) {
            this.approverConfig.nodeUserType.value = "主管";
          }
        } else {
          this.approverConfig.nodeUserType.value = "主管";
        }
      }
      this.approverConfig.error =
        this.setApproverStr(this.approverConfig) === "";
      // 通过hasFlag区分添加节点后自动出现弹框及点击出现弹框
      if (this.hasFlag) {
        if (
          this.nodeConfig.conditionNodes &&
          this.nodeConfig.conditionNodes.length > 0 &&
          this.conditionTip
        ) {
          //条件分支
          this.nodeConfig.conditionNodes.forEach((element) => {
            if (
              element.childNode &&
              !element.childNode.nodeUserType.value &&
              element.childNode.nodeName === this.approverConfig.nodeName
            ) {
              //条件分支节点赋值
              element.childNode = this.approverConfig;
            }
          });
        } else {
          this.nodeConfig.childNode = this.approverConfig;
        }
        this.$emit("update:nodeConfig", this.nodeConfig);
      } else {
        this.$emit("update:nodeConfig", this.approverConfig);
      }
      this.approverDrawer = false;
    },
    //保存条件设置
    saveCondition() {
      this.approverDrawer = false;
      let conditionString = ""; // 后端要的数据
      let conditionStringName = ""; //前端显示
      //条件循环设置
      if (this.approverConfig.conditionList.length > 0) {
        this.approverConfig.conditionList.forEach((item, indx) => {
          if (
            item.conditionChildrenNodes &&
            item.conditionChildrenNodes.length > 0
          ) {
            item.conditionChildrenNodes.forEach((it, ind) => {
              conditionString =
                conditionString +
                it.conditionOperator +
                it.leftFileds +
                it.centerFileds +
                it.rightFileds;
              conditionStringName =
                conditionStringName +
                it.conditionOperator +
                it.leftFiledsName +
                it.centerFileds +
                it.rightFileds;
            });
          }
          conditionString = conditionString + item.conditionGroupOperator;
          conditionStringName =
            conditionStringName + item.conditionGroupOperator;
        });
      }
      this.approverConfig.conditionString = conditionString;
      this.approverConfig.conditionStringName = conditionStringName;
      for (var i = 0; i < this.conditionsConfig.conditionNodes.length; i++) {
        this.conditionsConfig.conditionNodes[i].error =
          this.conditionStr(this.conditionsConfig.conditionNodes[i], i) ==
          "请设置条件";
      }
      // 区分添加节点后自动出现弹框及点击出现弹框
      if (this.hasFlag) {
        this.nodeConfig.childNode = this.conditionsConfig;
      } else {
        this.nodeConfig = this.conditionsConfig;
      }
    },

    //审批人抄送人显示和校验
    setApproverStr(nodeConfig) {
      let type = "会签";
      let role = "部门主管";
      if (nodeConfig.nodeUserType.type === "role") role = "角色";
      if (nodeConfig.nodeUserType.type === "user") role = "用户";
      if (nodeConfig.nodeUserType.value == "") return "";
      if (nodeConfig.type === 1) {
        //审批
        if (nodeConfig.examineMode === "1") type = "会签";
        if (nodeConfig.examineMode === "2") type = "或签";
        if (nodeConfig.examineMode === "3") type = "逐级审批";
        if (
          nodeConfig.nodeUserType.type === "manager" &&
          nodeConfig.examineMode === "3"
        ) {
          if (nodeConfig.nodeUserType.value.indexOf("m") != -1) {
            return `由发起人向上的${nodeConfig.nodeUserType.valueName}审批`;
          } else {
            return `由${nodeConfig.nodeUserType.valueName}审批`;
          }
        }
        if (
          nodeConfig.nodeUserType.type === "manager" &&
          nodeConfig.examineMode !== "3"
        ) {
          return `由${role}${type}`;
        }
        return `由${role}：${nodeConfig.nodeUserType.valueName}${type}`;
      }
      if (nodeConfig.type === 2) {
        //抄送
        if (nodeConfig.nodeUserType.value == "") return "";
        if (nodeConfig.nodeUserType.type === "manager") {
          //主管
          if (nodeConfig.nodeUserType.value.indexOf("m") != -1) {
            return `给发起人向上的${nodeConfig.nodeUserType.valueName}抄送`;
          } else {
            return `给${nodeConfig.nodeUserType.valueName}抄送`;
          }
        }
        // 角色、用户
        return `给${role}：${nodeConfig.nodeUserType.valueName}抄送`;
      }
    },
    //打开弹框
    setPerson(priorityLevel, item, data, tip) {
      this.approverDrawer = true;
      // 默认条件
      if (item && item.nodeName === "默认") {
        this.defaultApprovalDrawer = true;
      } else {
        this.defaultApprovalDrawer = false;
      }
      if (tip) {
        this.conditionTip = tip;
      }
      if (data) {
        //添加节点自动出现弹框传值
        this.hasFlag = true;
        // 条件
        if (priorityLevel == 1) {
          this.bPriorityLevel = priorityLevel;
          this.conditionsConfig = JSON.parse(JSON.stringify(data));
          this.approverConfig =
            this.conditionsConfig.conditionNodes[priorityLevel - 1];
          return;
        }
        // 审批人、抄送人
        this.approverConfig = JSON.parse(JSON.stringify(data));
      } else {
        //点击出现弹框
        // 条件
        let { type } = this.nodeConfig;
        if (type == 4) {
          this.bPriorityLevel = priorityLevel;
          this.conditionsConfig = JSON.parse(JSON.stringify(this.nodeConfig));
          this.approverConfig =
            this.conditionsConfig.conditionNodes[priorityLevel - 1];
          return;
        }
        // 审批人、抄送人
        this.approverConfig = JSON.parse(JSON.stringify(this.nodeConfig));
      }

      if (
        this.approverConfig.nodeUserType &&
        this.approverConfig.nodeUserType.type === "role"
      ) {
        // this.companyRoles()
        return;
      }
      if (
        this.approverConfig.nodeUserType &&
        this.approverConfig.nodeUserType.type === "user"
      ) {
        // this.companyUsersList()
        return;
      }
    },
    //条件显示
    conditionStr(item, index) {
      let {
        conditionList, //条件组
        conditionString, //条件数据
        conditionStringName, //条件显示
      } = item;
      let arr = [true]; //判断条件是否有值
      if (conditionList.length === 0 || conditionString === "") {
        if (item.nodeName === "默认") {
          return "其他情况";
        }
        return "请设置条件";
      }
      if (conditionList.length !== 0) {
        if (conditionList.length === 1) {
          //当条件组为一个
          conditionList[0].conditionChildrenNodes &&
            conditionList[0].conditionChildrenNodes.forEach((item, index) => {
              if (
                item.leftFileds == "" ||
                item.centerFileds == "" ||
                item.rightFileds == ""
              ) {
                arr.push(false);
              }
              if (index !== 0 && item.conditionOperator == "") {
                arr.push(false);
              }
            });
        } else {
          //当条件组为多个（判断是否有运算符）
          conditionList.forEach((item, index) => {
            if (index != conditionList.length - 1) {
              //条件组不为最后一个.校验是否有条件运算符
              if (item.conditionGroupOperator == "") arr.push(false);
            }
            if (
              item.conditionChildrenNodes &&
              item.conditionChildrenNodes.length > 0
            ) {
              item.conditionChildrenNodes.forEach((it, ind) => {
                if (
                  it.leftFileds === "" ||
                  it.centerFileds === "" ||
                  it.rightFileds == ""
                )
                  arr.push(false);
                if (ind !== 0 && it.conditionOperator == "") arr.push(false);
              });
            } else if (
              item.conditionChildrenNodes &&
              item.conditionChildrenNodes.length == 0
            ) {
              arr.push(false);
            }
          });
        }
        if (arr.includes(false)) {
          return "请设置条件";
        }
      }
      return conditionStringName;
    },
  },
};
</script>
<style lang="less">
.el-dialog__title {
  font-size: 18px !important;
  font-weight: 600 !important;
}
.default-style {
  margin-left: 25px;
}
.search-style {
  label {
    width: 50px !important;
  }
  .el-row {
    padding-right: 0px !important;
  }
  .el-form-item__content {
    margin-left: 50px !important;
  }
}
.flex-style {
  display: flex;
  justify-content: space-between;
}
.dang-style {
  font-size: 14px;
}
.dialog-style {
  z-index: 99999 !important;
  background: rgba(0, 0, 0, 0.5);
}
.v-modal {
  background: none !important;
  z-index: -1 !important;
}
//弹框
.set_promoter {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 0 24px;
    border-bottom: 1px solid #ebebeb;

    .title {
      height: 64px;
      line-height: 64px;
      font-size: 20px;
      color: #333;
      justify-content: flex-start;

      i {
        margin-left: 8px;
        font-size: 30px;
      }
    }
  }

  .el-drawer__body {
    overflow-y: auto;
    max-height: calc(100% - 64px);
    padding-bottom: 80px;
  }

  .drawer-content {
    padding: 24px;

    .el-radio {
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