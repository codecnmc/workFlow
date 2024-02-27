<template>
  <div class="nodeflow-components">
    <div
      class="flex"
      @dragend.stop="drop"
      :draggable="![this.$nodeType.开始, this.$nodeType.结束].includes(nodeConfig.type)"
      @dragstart.stop="dragStart"
      @dragenter.stop="dragEnter"
    >
      <component
        :is="getComponent"
        :isTried.sync="isTried"
        v-model="nodeConfig"
        :data-id="nodeConfig.nodeId"
      />
    </div>
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
  inject: ["getFlatRoot"],
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
    // 拖拽的id
    dragID: {
      get() {
        return window.__drag_id;
      },
      set(value) {
        window.__drag_id = value;
      },
    },
    // 经过的节点ID
    hoverNode: {
      get() {
        return window.__hover_id;
      },
      set(value) {
        let doms = document.querySelectorAll(".block-hover");
        for (let item of doms) {
          item.classList.remove("block-hover");
        }
        window.__hover_id = value;
        if (value) {
          let node = document.querySelector(`[data-id='${value}']`);
          node.classList.add("block-hover");
        }
      },
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
    drop(e) {
      const clear = () => {
        this.dragID = "";
        this.hoverNode = "";
      };
      if (!this.hoverNode) {
        return clear();
      }
      // 处理节点嫁接问题
      let flatData = this.getFlatRoot();
      let father = flatData[flatData[this.dragID].fatherID];
      let hoverNode = flatData[this.hoverNode];
      if ([this.$nodeType.结束].includes(hoverNode.type)) {
        return clear();
      }
      let childNode = hoverNode.childNode;
      let currentNode = flatData[this.dragID];
      if (currentNode.fatherID == hoverNode.nodeId) {
        return clear();
      }
      if (father.childNode) {
        father.childNode = father.childNode.childNode;
        if (father.childNode) {
          father.childNode.fatherID = father.nodeId;
        }
      }
      currentNode.fatherID = hoverNode.nodeId;
      currentNode.childNode = childNode;
      hoverNode.childNode = currentNode;
      if (childNode) {
        childNode.fatherID = currentNode.nodeId;
      }
      clear();
    },
    dragEnter(e) {
      if (e.target) {
        let isNode = false;
        let node = e.target;
        while (!isNode) {
          if (["node-wrap", "condition-node"].includes(node.className)) {
            let hoverID = node.getAttribute("data-id");
            if (hoverID && hoverID != this.dragID) {
              let flatData = this.getFlatRoot();
              let currentNode = flatData[this.dragID];
              if (hoverID == currentNode.fatherID) break;
              if (
                currentNode.type == this.$nodeType.条件分支 &&
                currentNode.conditionNodes.some((x) => x.nodeId == hoverID)
              ) {
                break;
              }
              this.hoverNode = hoverID;
              break;
            }
            break;
          } else {
            this.hoverNode = "";
          }
          if (node.parentElement) {
            node = node.parentElement;
          } else break;
        }
      }
    },
    dragStart(e) {
      this.dragID = this.nodeConfig.nodeId;
      this.hoverNode = "";
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
.block-hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>