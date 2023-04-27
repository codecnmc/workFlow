<template>
  <div class="nodeflow-components">
    <component
      :is="getComponent"
      :isTried.sync="isTried"
      v-model="nodeConfig"
    />
    <nodeWrap
      v-if="nodeConfig.childNode"
      v-model="nodeConfig.childNode"
      :isTried.sync="isTried"
    ></nodeWrap>
  </div>
</template>
<script>
// 是否 修改成导入配置形式?
import addNode from "./addNode";
export default {
  name: "nodeWrap",
  components: { addNode },
  props: ["isTried", "value"],
  model: {
    prop: "value",
    event: "input",
  },
  computed: {
    // v-model绑定
    nodeConfig: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    // 获取节点组件
    getComponent() {
      return this.$factory.getTypeComponentName(this.nodeConfig.type);
    },
  },
  methods: {
    dealStr(str, obj) {
      let arr = [];
      let list = str.split(",");
      for (var elem in obj) {
        list.map((item) => {
          if (item == elem) {
            arr.push(obj[elem].value);
          }
        });
      }
      return arr.join("或");
    },
  },
};
</script>
<style lang="less">
.error_tip {
  position: absolute;
  top: 36px;
  right: 0px;
  transform: translate(150%, 0px);

  i {
    font-size: 24px;
  }
}
</style>