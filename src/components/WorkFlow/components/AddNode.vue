<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover
        placement="right-start"
        popper-class="add-node-popover"
        v-model="visible"
      >
        <div class="add-node-popover-body">
          <div
            v-for="item in config.addNodesOptions"
            :key="item.type"
            class="add-node-popover-item"
            :class="item.class"
            @click="addType(item.type)"
          >
            <div class="item-wrapper">
              <el-image
                :src="item.icon"
                alt=""
                class="img-style"
              />
            </div>
            <p>{{item.label}}</p>
          </div>
        </div>
        <button
          class="btn"
          type="button"
          slot="reference"
        >
          <i
            style="color:#fff"
            class="el-icon-plus"
          ></i>
        </button>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  props: ["value", "tip"],
  inject: ["openDrawer", "getFlatRoot", "config", "nodeType"],
  data() {
    return {
      visible: false,
      nodes: [],
    };
  },
  model: {
    prop: "value",
    event: "input",
  },
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
  methods: {
    // 新增类型
    addType(type) {
      this.visible = false;
      // 判断这个节点是不是判断节点 不能嵌套太多层条件 否则会出问题
      // console.log(this.nodeConfig);
      let level = this.nodeConfig.level;
      let branch = this.nodeType.条件分支;
      let flatDic = this.getFlatRoot();

      // 解决条件嵌套导向的问题
      if (type == branch) {
        let lastCondition = 0;
        let currentNode = this.nodeConfig;
        while (currentNode) {
          if (currentNode.type == this.nodeType.条件) {
            lastCondition = currentNode.level;
            break;
          }
          currentNode = flatDic[currentNode.fatherID];
        }
        level = lastCondition + 1;
      }

      //  分支跳出检测的问题 如果childNode存在 而且下面没有分支跳出 要补充上 后续要计算分支跳出连接的点 方便后续后端操作
      if (level > 1 && type == branch && !this.nodeConfig.childNode) {
        this.nodeConfig.childNode = this.$factory.getStruct(
          this.nodeConfig && this.nodeConfig.nodeId,
          this.nodeType.删除块,
          null,
          level
        );
      }

      let data = this.$factory.getStruct(
        this.nodeConfig && this.nodeConfig.nodeId,
        type,
        null,
        level
      );

      // 修改原来添加的逻辑 他是直接覆盖下一节点 而不是链表链接
      if (this.nodeConfig.childNode) {
        let temp = this.nodeConfig.childNode;
        this.nodeConfig.childNode = data;
        temp.fatherID = data.nodeId;
        data.childNode = temp;
      } else {
        this.nodeConfig.childNode = data;
      }

      //添加节点自动弹出弹框
      if (
        this.config.createPopupImmediately &&
        data.type != this.nodeType.条件分支
      )
        this.openDrawer(data);
    },
  },
};
</script>
<style lang="scss" scoped>
.add-node-btn-box {
  width: 240px;
  display: inline-flex;
  flex-shrink: 0;
  position: relative;

  &:first-child {
    margin-left: 16px;
  }

  &:before {
    content: "";
    position: absolute;
    top: 1px;
    left: 0px;
    right: 0;
    bottom: 0;
    z-index: -1;
    margin: auto;
    width: 1px;
    background-color: #ebebeb;
  }

  .btn {
    outline: none;
    cursor: pointer;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    width: 30px;
    height: 30px;
    background: #4880ff;
    border-radius: 50%;
    position: relative;
    border: none;
    line-height: 30px;
    -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>