<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 10:32:20
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 09:33:08
 * @Description: 审核人节点
-->
<template>
  <div class="node-wrap">
    <div
      class="node-wrap-box"
      v-if="nodeConfig"
      :style="`margin-left:${offset}`"
      :class="(isTried && nodeConfig.error ? 'active error' : '') "
    >
      <div @click="setPerson">
        <div
          class="title"
          :style="`background-color:${$flowConfig.headerColor[nodeConfig.type]}`"
        >
          <span class="editable-title">{{ nodeConfig.nodeName }}</span>
          <i
            class="el-icon-close close"
            v-if=" ![$nodeType.开始,$nodeType.结束].includes(nodeConfig.type)"
            @click.stop="delNode()"
          ></i>
        </div>
        <div class="content">
          <div class="text">
            <span
              class="placeholder"
              v-if="setApproverStr(nodeConfig) === ''"
            >
              请选择{{ placeholderList[nodeConfig.type] }}
            </span>
            {{ setApproverStr(nodeConfig) }}
          </div>
          <div
            class="error_tip"
            v-if="isTried && nodeConfig.error"
          >
            <i
              class="el-icon-warning"
              style="color: rgb(242, 86, 67);"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <addNode
      v-model="nodeConfig"
      :style="`margin-left:${offset}`"
      v-if="nodeConfig.type!=$nodeType.结束"
    ></addNode>
  </div>
</template>

<script>
import mixin from "./mixin";
import {nodeOffset} from "@/utils/tools.js";
export default {
  mixins: [mixin],
  computed: {
    offset() {
      let dic = this.getFlatRoot();
      return nodeOffset(this.nodeConfig, dic);
    },
  },
};
</script>

<style lang="less" scoped>
</style>