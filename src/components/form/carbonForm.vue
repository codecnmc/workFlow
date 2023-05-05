<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 16:27:24
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 10:54:35
 * @Description: 抄送人表单
-->
<template>
  <el-form
    class="form"
    label-position="top"
  >
    <carbon :memberOptions="memberOptions" v-model="setting.carbonCopySetting"></carbon>
  </el-form>
</template>

<script>
import carbon from "./components/carbon.vue";
import mixin from "./mixin";
export default {
  components: { carbon },
  mixins: [mixin],
};
</script>

<style lang="less" scoped>
</style>