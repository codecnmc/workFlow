<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 09:10:13
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-22 11:18:42
 * @Description: file content
-->
<template>
  <div class="flex">
    <work-flow
      header
      :fullscreen="true"
      height="600px"
      header-height="60px"
      ref="flow"
    >
    </work-flow>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    flowMethod() {
      // 从文件导入数据
      this.$refs.flow.importData();
      // 直接赋值数据
      this.$refs.flow.loadData(data);
      // 导出数据结构
      this.$refs.flow.exportStruct();
      // 导出数据
      this.$refs.flow.exportData();
      // 校验数据
      this.$refs.flow.validate();
      // 缩放视图 0变小 1增大 或者zoomSize(0,目标值)
      this.$refs.flow.zoomSize(0);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
