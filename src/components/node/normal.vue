<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 10:32:20
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-26 17:39:24
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
export default {
  mixins: [mixin],
  computed: {
    offset() {
      let maxLevel = 1;
      let dic = this.getFlatRoot();
      for (let kv in dic) {
        maxLevel = Math.max(maxLevel, dic[kv].level);
      }
      let level = maxLevel - 2;
      if (this.nodeConfig.type == this.$nodeType.结束) {
        // 偏移懒得算 有需求可以自己加
        switch (level) {
          case 1:
            return "190px";
          case 2:
            return "500px";
          default:
            return "0px";
        }
      }
      if (this.nodeConfig.level > 2) {
        return "240px";
      }
      if(level>0){
        return "180px"
      }
      return "0px";
    },
  },
};
</script>

<style lang="less" scoped>
</style>