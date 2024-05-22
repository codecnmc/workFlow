<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 10:57:30
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 14:05:51
 * @Description: 分支情况
-->
<template>

  <div class="branch-wrap">
    <div class="branch-box-wrap">
      <div class="branch-box">
        <el-button
          type="primary"
          plain
          round
          size="small"
          class="add-branch"
          @click="addTerm"
        >
          添加条件
        </el-button>
        <div
          class="col-box"
          v-for="(item, index) in nodeConfig.conditionNodes"
          :key="index"
        >
          <div
            class="condition-node"
            :data-id="item.nodeId"
          >
            <div class="condition-node-box">
              <div
                class="auto-judge"
                @click="openDrawer(item)"
                :class="isTried && item.error ? 'error active' : '' "
              >
                <div
                  class="sort-left"
                  v-if="index != 0 &&item.nodeName!='默认'"
                  @click.stop="arrTransfer(index, -1)"
                >
                  &lt;
                </div>
                <div class="title-wrapper">
                  <span class="editable-title">{{ item.nodeName }}</span>
                  <span class="priority-title">优先级{{ item.priorityLevel }}</span>
                  <i
                    class="el-icon-close close"
                    @click.stop="delTerm(index)"
                    v-if="item.nodeName!='默认'"
                  ></i>
                </div>
                <div
                  class="sort-right"
                  v-if=" index != nodeConfig.conditionNodes .length - 1&&item.nodeName!='默认' "
                  @click.stop="arrTransfer(index)"
                > &gt; </div>
                <div class="content">
                  <div
                    class="text"
                    v-for="(item,index2) in setConditionStr(item)"
                    :key="index2*1000"
                  >
                    {{item}}
                  </div>
                </div>
                <div
                  class="error_tip"
                  v-if="isTried && item.error"
                >
                  <i
                    class="el-icon-warning"
                    style="color: rgb(242, 86, 67);"
                  ></i>
                </div>
              </div>
              <addNode
                v-model="nodeConfig.conditionNodes[index]"
                :tip="'条件'"
              ></addNode>
            </div>
          </div>
          <nodeWrap
            v-if="item.childNode"
            v-model="item.childNode"
            :isTried.sync="isTried"
          ></nodeWrap>
          <div
            class="top-left-cover-line"
            v-if="index == 0"
          ></div>
          <div
            class="bottom-left-cover-line"
            v-if="index == 0"
          ></div>
          <div
            class="top-right-cover-line"
            v-if="index == nodeConfig.conditionNodes.length - 1"
          ></div>
          <div
            class="bottom-right-cover-line"
            v-if="index == nodeConfig.conditionNodes.length - 1"
          ></div>
        </div>
      </div>
      <addNode v-model="nodeConfig"></addNode>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin";

export default {
  mixins: [mixin],
  computed: {
    // 条件节点
    conditions: {
      get() {
        return this.nodeConfig.conditionNodes;
      },
      set(value) {
        this.nodeConfig.conditionNodes = value;
      },
    },
  },
  methods: {
    // 设置条件的error状态
    checkCondtions() {
      for (var i = 0; i < this.conditions.length; i++) {
        this.conditions[i].error =
          this.setConditionStr(this.conditions[i], i) == "请设置条件" &&
          i != this.conditions.length - 1;
      }
    },
    //添加条件
    addTerm() {
      // 添加条件必须在默认前 否则影响判断
      let len = this.conditions.length;
      this.conditions.splice(
        len - 1,
        0,
        this.$factory.getStruct(
          this.nodeConfig.nodeId,
          this.nodeType.条件,
          null,
          this.nodeConfig.level,
          len
        )
      );
      this.checkCondtions();
    },
    // 调整条件位置
    arrTransfer(index, type = 1) {
      //  需要调整一下 默认情况是不能调整位置的
      if (type == 1 && index + 1 == this.conditions.length - 1) {
        return this.$message.error("无法移动到最后! 其他情况必须在最后");
      }
      //向左-1,向右1
      this.conditions[index] = this.conditions.splice(
        index + type,
        1,
        this.conditions[index]
      )[0];
      this.conditions.map((item, index) => {
        item.priorityLevel = index + 1;
      });
      this.checkCondtions();
    },
    //删除条件
    delTerm(index) {
      let node = this.conditions[index];
      if (this.conditions.length > 2 && node.nodeName == "默认") {
        return this.$message.error("条件数量大于2的时候无法删除默认节点");
      }
      this.conditions.splice(index, 1);
      this.checkCondtions();
      if (this.nodeConfig.conditionNodes.length == 1) {
        // 删除跳点
        if (this.nodeConfig.childNode) {
          //  续接上一分支后需要降层次等级
          // 这句的意思是 当删除的长度为1的时候 代表整个条件节点给干掉了 要把数组第一位的链表续接到主分支下去
          if (this.nodeConfig.conditionNodes[0].childNode) {
            this.reData(
              this.conditions[0].childNode,
              this.nodeConfig.childNode
            );
          } else {
            this.conditions[0].childNode = this.nodeConfig.childNode;
          }
        }
        let node = this.conditions[0].childNode;
        if (node) {
          // 2023.12.13修复没有更新父id的问题
          node.fatherID = this.nodeConfig.fatherID;
          while (node) {
            let item = node.childNode;
            if (!item) {
              break;
            }
            if (item.type == this.nodeType.删除块) {
              node.childNode = null;
            }
            node = item;
          }
          this.$emit("input", this.conditions[0].childNode);
        }
      }
    },
    // 递归续接链表
    reData(data, addData) {
      if (data.level > 1) {
        data.level -= 1;
      }
      if (!data.childNode) {
        data.childNode = addData;
      } else {
        this.reData(data.childNode, addData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// 解决margin也被过渡的问题
.add-branch {
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
}
</style>