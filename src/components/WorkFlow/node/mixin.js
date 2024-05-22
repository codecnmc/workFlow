/*
 * @Author: 羊驼
 * @Date: 2023-04-25 10:34:46
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 17:13:01
 * @Description: file content
 */
import addNode from "../components/AddNode";
export default {
  mixName: "node",
  components: {
    // 解决递归循环依赖的问题
    nodeWrap: () => import("../components/NodeWrap"),
    addNode,
  },
  props: ["isTried", "value"],
  model: {
    prop: "value",
    event: "input",
  },
  emits: ["openDrawer"],
  // getFlatRoot 获取扁平化后的节点数据
  // openDrawer 打开抽屉 传参(nodeConfig)
  // nodeType 类型字典列表
  // config 配置情况
  inject: ["getFlatRoot", "openDrawer", "nodeType", "config"],
  computed: {
    nodeConfig: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  mounted() {
    if (this.value == undefined) {
      throw Error("无绑定v-model 请绑定");
    }
    if (this.nodeConfig.type != this.nodeType.条件分支) {
      this.nodeConfig.error = !this.vaildError(this.nodeConfig);
    }
  },
  methods: {
    // 校验保存
    vaildError(item) {
      return this.$factory.getTypeBeforeSave(item.type, item);
    },
    // 设置节点文字
    setApproverStr() {
      let str = this.$factory.getTypeTextHandle(this.nodeConfig.type, this.nodeConfig);
      return str;
    },
    // 设置条件节点文字
    setConditionStr(item) {
      let str = this.$factory.getTypeTextHandle(item.type, item);
      return str;
    },
    // 删除节点
    delNode() {
      let fatherID = this.nodeConfig.fatherID;
      // 还需要更换fatherID 否则删除的时候还会找旧的father节点 如果旧节点被删了呢
      if (this.nodeConfig.childNode) {
        this.nodeConfig.childNode.fatherID = fatherID;
        this.$emit("input", this.nodeConfig.childNode);
      } else {
        // 处理没有下级的情况 需要拿到Root根节点数据向下找 如果他没上级不操作 有上级移除本级
        // 改成平铺后处理就方便了
        let flatRoot = this.getFlatRoot();
        if (!fatherID) {
          throw Error("这个是根节点无法删除！");
        } else {
          let father = flatRoot[fatherID];
          father.childNode = null;
        }
      }
    },
  },
};
