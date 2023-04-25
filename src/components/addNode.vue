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
            v-for="item in $flowConfig.addNodesOptions"
            :key="item.type"
            class="add-node-popover-item"
            :class="item.class"
            @click="addType(item.type)"
          >
            <div class="item-wrapper">
              <img
                :src="item.icon"
                alt=""
                class="img-style"
              >
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
  props: ["childNodeP", "nodeConfig", "tip"],
  data() {
    return {
      visible: false,
      nodes: [],
    };
  },
  methods: {
    // 新增类型
    addType(type) {
      this.visible = false;
      let data = this.$factory.getStruct(type, this.childNodeP);
      if (this.$flowConfig.createPopupImmediately) {
        //添加节点自动弹出弹框
        type != 4
          ? this.$parent.setPerson("", "", data, this.tip)
          : this.$parent.setPerson(1, "", data);
      }
      this.$emit("update:childNodeP", data);
    },
  },
};
</script>
<style lang="less" scoped>
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
    // height: 100%;
    background-color: #ebebeb;
  }
}
.img-style {
  width: 36px;
}
.add-node-popover {
  padding: 14px 26px;
  .add-node-popover-body {
    display: flex;
    .add-node-popover-item {
      margin-right: 20px;
      text-align: center;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      i {
        font-size: 36px;
      }
      p {
        color: #333;
        margin-top: 4px;
      }
    }
    .approver {
      i {
        color: #e6a23c;
      }
    }
    .condition {
      i {
        color: #67c23a;
      }
    }
    .notifier {
      i {
        color: #4880ff;
      }
    }
  }
}
</style>