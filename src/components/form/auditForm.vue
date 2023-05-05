<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 14:46:53
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 11:18:05
 * @Description: 审核表单
-->
<template>
  <el-form class="form" label-position="top">
    
  </el-form>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      // 节点类型
      examineModeList: [
        {
          value: "1",
          label: "会签审批",
          mark: "需要所有审批人同意，该审批节点才通过",
        },
        {
          value: "2",
          label: "或签审批",
          mark: "任意一名审批人同意，该审批节点即通过",
        },
        {
          value: "3",
          label: "逐级审批",
          mark: "按人事部门层级逐级依次审批后，该审批节点才通过",
        },
      ],
    };
  },

  methods: {

  },
};
</script>

<style lang="less" scoped>
</style>