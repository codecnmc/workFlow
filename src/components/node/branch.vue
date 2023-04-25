<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 10:57:30
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-25 11:37:44
 * @Description: 分支情况
-->
<template>

  <div class="branch-wrap">
    <div
      class="branch-box-wrap"
      :style="{'margin-left':condtionsOffset}"
    >
      <div class="branch-box">
        <button
          class="add-branch"
          @click="addTerm"
          :style="`margin-left:${conditionButtonOffset}`"
        >
          添加条件
        </button>
        <div
          class="col-box"
          v-for="(item, index) in nodeConfig.conditionNodes"
          :key="index"
        >
          <div class="condition-node">
            <div class="condition-node-box">
              <div
                class="auto-judge"
                @click="setPerson(item.priorityLevel,item)"
                :class="isTried && item.error ? 'error active' : '' "
              >
                <div
                  class="sort-left"
                  v-if="index != 0"
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
                  ></i>
                </div>
                <div
                  class="sort-right"
                  v-if=" index != nodeConfig.conditionNodes .length - 1 "
                  @click.stop="arrTransfer(index)"
                > &gt; </div>
                <div class="content">
                  {{ conditionStr(item, index) }}
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
                :childNodeP.sync="item.childNode"
                :tip="'条件'"
              ></addNode>
            </div>
          </div>
          <nodeWrap
            v-if="item.childNode && item.childNode"
            :dataFields="dataFields"
            :nodeConfig.sync="item.childNode"
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
      <addNode
        :childNodeP.sync="nodeConfig.childNode"
        :style="`margin-left:${condtionAddButton}`"
      ></addNode>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin";

export default {
  mixins: [mixin],
  computed: {
    // 条件分支偏移量
    condtionsOffset() {
      let nodeLength = this.nodeConfig.conditionNodes.length;
      // 1080p下 五个极限了 再靠左就遮住了 所以往右偏移一点
      if (nodeLength > 5) {
        return -240 - 3 * 190 + "px";
      }
      return -240 - (this.nodeConfig.conditionNodes.length - 2) * 190 + "px";
    },
    // 条件分支添加条件按钮偏移量
    conditionButtonOffset() {
      let nodeLength = this.nodeConfig.conditionNodes.length;
      if (nodeLength > 5) {
        return -(nodeLength - 5) * 190 + "px";
      }
      return 0;
    },
    // 解决条件分支添加按钮偏移量
    condtionAddButton() {
      let nodeLength = this.nodeConfig.conditionNodes.length;
      if (nodeLength > 5) {
        return -(nodeLength - 5) * 380 + "px";
      }
      return 0;
    },
  },
  methods: {
    //添加条件
    addTerm() {
      let len = this.nodeConfig.conditionNodes.length;
      this.nodeConfig.conditionNodes.push({
        nodeName: "条件" + len,
        type: 3,
        priorityLevel: len + 1,
        conditionList: [],
        childNode: null,
      });
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error =
          this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
            "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1;
      }

    },
    // 调整条件位置
    arrTransfer(index, type = 1) {
      //向左-1,向右1
      this.nodeConfig.conditionNodes[index] =
        this.nodeConfig.conditionNodes.splice(
          index + type,
          1,
          this.nodeConfig.conditionNodes[index]
        )[0];
      this.nodeConfig.conditionNodes.map((item, index) => {
        item.priorityLevel = index + 1;
      });
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error =
          this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
            "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1;
      }
    },
    //删除条件
    delTerm(index) {
      this.nodeConfig.conditionNodes.splice(index, 1);
      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error =
          this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
            "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1;
      }
      if (this.nodeConfig.conditionNodes.length == 1) {
        if (this.nodeConfig.childNode) {
          if (this.nodeConfig.conditionNodes[0].childNode) {
            this.reData(
              this.nodeConfig.conditionNodes[0].childNode,
              this.nodeConfig.childNode
            );
          } else {
            this.nodeConfig.conditionNodes[0].childNode =
              this.nodeConfig.childNode;
          }
        }
        this.$emit(
          "input",
          this.nodeConfig.conditionNodes[0].childNode
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>