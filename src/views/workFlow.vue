<template>
  <div class="workflow">
    <div class="header">
      <el-button
        type="primary"
        class="btn-style"
        @click="validate"
      >校验</el-button>
      <div class="zoom flex">
        <div
          class="zoom-out"
          :class="{'disabled':nowVal==50}"
          @click="zoomSize(0)"
        ></div>
        <span>{{nowVal}}%</span>
        <div
          class="zoom-in"
          :class="{'disabled':nowVal==300}"
          @click="zoomSize(1)"
        ></div>
      </div>
    </div>
    <div class="approval-flow fd-nav-content">
      <div class="dingflow-design">
        <div
          class="box-scale"
          id="box-scale"
          :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px;'"
        >
          <nodeWrap
            v-bind="$attrs"
            v-model="nodeConfig"
            :isTried="isTried"
          ></nodeWrap>
        </div>
      </div>
    </div>
    <editor ref="editor"></editor>
  </div>
</template>

<script>
import Editor from "../components/editor.vue";
import nodeWrap from "../components/nodeWrap.vue";
export default {
  components: {
    nodeWrap,
    Editor,
  },
  data() {
    return {
      // 校验用
      isTried: false,
      // 报错的数据
      tipList: [],
      // 展示节点结构 初始化会更换为开始节点
      nodeConfig: {
        error: true,
        childNode: {
          nodeName: "审核人",
          nodeUserType: {
            valueName: "admin",
            valueList: ["admin"],
            type: "user",
            value: "admin",
          },
          examineMode: "1",
          error: false,
          type: 1,
          nodeId: "approvalID",
        },
      },
      // 缩放比例
      nowVal: 100,
      // 暂时还不知道作用
      nodeConfigss: {
        type: 0, //类型
        priorityLevel: "", //优先级
        settype: "", //审批人类型
        selectMode: "", // 1人还是多人
        selectRange: "", //选择范围
        directorLevel: "", // 主管层级
        examineMode: "", //多人审批时采用的审批方式  （依次审批 ，会签）
        noHanderAction: "", //审批人为空时 (自动审批通过/不允许发起, 转交给审核管理员)
        examineEndType: "",
        examineEndRoleId: "",
        examineEndDirectorLevel: "", // 审批终点层级
        ccSelfSelectFlag: "", // 抄送人
        conditionList: [], //条件设置
        nodeUserList: [], // 人员列表
      },
    };
  },
  // 让子组件都能拿到根节点 方便计算
  provide() {
    return {
      // 获取根节点的数据
      getRoot: () => this.nodeConfig,
      // 平铺所有节点
      getFlatRoot: () => this.getFlatDic(),
      findNode: this.findNode,
      openDrawer: this.openDrawer,
      // 用户options
      useroptions: [
        { name: "admin", id: "1", userName: "admin" },
        { name: "Anna", id: "2", userName: "Anna" },
      ],
      // 对我用不上 先保留
      directorLevelList: [
        {
          value: "1",
          label: "第一级主管",
        },
        {
          value: "2",
          label: "第二级主管",
        },
        {
          value: "3",
          label: "第三级主管",
        },
        {
          value: "4",
          label: "第四级主管",
        },
        {
          value: "5",
          label: "第五级主管",
        },
        {
          value: "6",
          label: "第六级主管",
        },
        {
          value: "7",
          label: "第七级主管",
        },
        {
          value: "8",
          label: "第八级主管",
        },
        {
          value: "9",
          label: "第九级主管",
        },
        {
          value: "10",
          label: "第十级主管",
        },
      ],
    };
  },
  // 初始化节点
  beforeMount() {
    this.nodeConfig = {
      error: true,
      childNode: this.$factory.getStruct(null, this.$nodeType.开始, null, 1),
    };
    this.nodeConfig.childNode.childNode = this.$factory.getStruct(
      this.nodeConfig.childNode.nodeId,
      this.$nodeType.结束,
      null,
      1
    );
  },
  methods: {
    // 查找节点
    findNode(id) {
      let dic = this.getFlatDic();
      for (let kv in dic) {
        if (kv == id) {
          return dic[kv];
        }
      }
    },
    // 处理数组的问题 由于现在尾部缺失东西 导致会有点问题
    conditionNodesHnalde(array, dic) {
      array.forEach((node) => {
        dic[node.nodeId] = node;
        node.childNode && this.flatData(node.childNode, dic);
      });
    },
    // 获取递归平铺字典
    getFlatDic() {
      let dic = {};
      this.flatData(this.nodeConfig, dic);
      return dic;
    },
    // 递归平铺所有节点 方便于节点的操作
    flatData(data, dic) {
      if (!data) return;
      if (data.childNode) {
        dic[data.childNode.nodeId] = data.childNode;
        this.flatData(data.childNode, dic);
        data.childNode.conditionNodes &&
          data.childNode.conditionNodes.length > 0 &&
          this.conditionNodesHnalde(data.childNode.conditionNodes, dic);
      }
      if (data.conditionNodes && data.conditionNodes.length > 0) {
        dic[data.nodeId] = data;
        this.conditionNodesHnalde(data.conditionNodes, dic);
      }
    },
    // 保存前校验数据
    validate() {
      this.isTried = true;
      this.tipList = [];
      this.reErr(this.nodeConfig);
      return this.tipList.length == 0;
    },
    // 递归检验error
    reErr(data) {
      let nodeType = this.$nodeType;
      if (data.childNode) {
        this.reErr(data.childNode);
        if (data.childNode.type != nodeType.条件分支) {
          this.tipList.push({
            name: data.childNode.nodeName,
            type: nodeType.toString(data.childNode.type),
          });
        } else {
          for (var i = 0; i < data.childNode.conditionNodes.length; i++) {
            if (data.childNode.conditionNodes[i].error) {
              this.tipList.push({
                name: data.childNode.conditionNodes[i].nodeName,
                type: "条件",
              });
            }
            this.reErr(data.childNode.conditionNodes[i]);
          }
        }
      }
    },
    // 缩放比例调整
    zoomSize(type) {
      let value = this.nowVal;
      if (!type && value > 50) {
        this.nowVal -= 10;
      } else if (type && value < 300) {
        this.nowVal += 10;
      }
    },
    // 打开编辑框
    openDrawer(priorityLevel, item, data, tip) {
      this.$refs.editor.openDrawer(priorityLevel, item, data, tip);
    },
  },
};
</script>

<style lang="less">
@import url("../styles/flow.less");
</style>