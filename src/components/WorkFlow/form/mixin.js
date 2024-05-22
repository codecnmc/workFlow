/*
 * @Author: 羊驼
 * @Date: 2023-04-25 16:28:53
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 17:08:59
 * @Description: 表单类型通用mixin
 */
export default {
  mixName: "form",
  // config 配置 nodeType 节点类型字典
  inject: ["config", "nodeType"],
  props: ["value"],
  model: {
    prop: "value",
    event: "input",
  },
  computed: {
    // 节点数据 整体
    approverConfig: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    // 可用的配置 创建node时写入的setting
    setting: {
      get() {
        return this.approverConfig.setting;
      },
      set(value) {
        this.approverConfig.setting = value;
      },
    },
  },
};
