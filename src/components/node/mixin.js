/*
 * @Author: 羊驼
 * @Date: 2023-04-25 10:34:46
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 13:49:16
 * @Description: file content
 */
import addNode from "../addNode";
export default {
    components: {
        // 解决递归循环依赖的问题
        nodeWrap: () => import("@/components/nodeWrap.vue"),
        addNode,
    },
    props: ["isTried", "value"],
    model: {
        prop: "value",
        event: "input"
    },
    emits: ["openDrawer"],
    inject: ["setApproverStr", "conditionStr", "getFlatRoot", "openDrawer"],
    computed: {
        nodeConfig: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit("input", value)
            }
        }
    },
    data() {
        return {
            placeholderList: ["发起人", "审核人", "抄送人"],
        }
    },
    mounted() {
        if (this.value == undefined) {
            throw Error("无绑定v-model 请绑定")
        }
        let nodeType = this.$nodeType
        switch (this.nodeConfig.type) {
            case nodeType.审核人:
            case nodeType.抄送人:
                this.nodeConfig.error = this.setApproverStr(this.nodeConfig) == "";
                break;
            case nodeType.条件分支:
                for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                    this.nodeConfig.conditionNodes[i].error =
                        this.conditionStr(this.nodeConfig.conditionNodes[i], i) ==
                        "请设置条件";
                }
                break;
        }
    },
    methods: {
        // 删除节点
        delNode() {
            let fatherID = this.nodeConfig.fatherID
            // 还需要更换fatherID 否则删除的时候还会找旧的father节点 如果旧节点被删了呢
            if (this.nodeConfig.childNode) {
                this.nodeConfig.childNode.fatherID = fatherID
                this.$emit("input", this.nodeConfig.childNode)
            } else {
                // 处理没有下级的情况 需要拿到Root根节点数据向下找 如果他没上级不操作 有上级移除本级
                // 改成平铺后处理就方便了
                let flatRoot = this.getFlatRoot()
                if (!fatherID) {
                    throw Error("这个是根节点无法删除！")
                } else {
                    let father = flatRoot[fatherID]
                    father.childNode = null
                }
            }
        },
    }
}