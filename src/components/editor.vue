<!--
 * @Author: 羊驼
 * @Date: 2023-04-27 11:47:24
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 17:04:38
 * @Description: 节点编辑器
-->
<template>
  <el-drawer
    :visible.sync="approverDrawer"
    custom-class="set_promoter"
    append-to-body
    direction="rtl"
    size="560px"
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
  inject: ["findNode", "useroptions", "directorLevelList"],
  computed: {
    // 获取表单组件
    getFormComponent() {
      if (!this.approverConfig) return;
      return this.$factory.getFormComponentName(this.approverConfig.type);
    },
    // 默认条件表单
    defaultApprovalDrawer() {
      return this.approverConfig.nodeName == "默认";
    },
  },
  data() {
    return {
      approverDrawer: false, //审批弹框
      //审批弹框字段Obj
      approverConfig: {},
      // 处理节点名称更改的标志位
      titleInputFlag: false,
      // 更改的节点名称
      nodeName: "",
    };
  },
  methods: {
    // 显示input框 以及校验输入
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
        this.approverConfig
      );
    },
    //保存弹框设置
    saveApprover() {
      let nodeType = this.$nodeType;
      this.approverDrawer = false;
      if (this.approverConfig.type === nodeType.条件) {
        return this.saveCondition();
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
        if (
          [nodeType.审核人, nodeType.抄送人].includes(this.approverConfig.type)
        ) {
          let num = this.approverConfig.nodeUserType.value;
          if (num.indexOf("m") !== -1) {
            num = num.substring(2);
          }
          // 默认值
          if (
            this.approverConfig.type === nodeType.审核人 &&
            this.approverConfig.nodeUserType.type == "manager" &&
            !this.approverConfig.nodeUserType.value
          ) {
            this.approverConfig.nodeUserType.value = "主管";
          }
        } else {
          this.approverConfig.nodeUserType.value = "主管";
        }
      }
      this.approverConfig.error = this.setApproverStr() === "";
      this.saveData();
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
      this.approverConfig.error =
        this.$factory.getTypeTextHandle(
          this.approverConfig.type,
          this.approverConfig
        ) == "请设置条件";
      this.saveData();
    },
    saveData() {
      let node = this.findNode(this.approverConfig.nodeId);
      if (!node) {
        throw Error("无效节点对象");
      }
      for (let kv in this.approverConfig) {
        if (
          [
            "nodeName",
            "nodeId",
            "childNode",
            "type",
            "fatherID",
            "conditionNodes",
            "level",
          ].includes(kv)
        )
          continue;
        node[kv] = this.approverConfig[kv];
      }
      node.nodeName = this.nodeName;
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
</style>