<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 10:32:20
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-25 10:53:30
 * @Description: 审核人节点
-->
<template>
  <div class="node-wrap">
    <div
      class="node-wrap-box"
      v-if="nodeConfig.type"
      :class="(isTried && nodeConfig.error ? 'active error' : '') "
    >
      <div @click="setPerson">
        <div
          class="title"
          :style="
                        'background: rgb(' + [ '87, 106, 149', '230, 162, 60', '72, 128, 255', ][nodeConfig.type] + ');' "
        >
          <span class="editable-title">{{ nodeConfig.nodeName }}</span>
          <i
            class="el-icon-close close"
            v-if="nodeConfig.type != 0"
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
      <addNode :childNodeP.sync="nodeConfig.childNode"></addNode>
    </div>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
  data() {
    return {};
  },
  
};
</script>

<style lang="less" scoped>
</style>