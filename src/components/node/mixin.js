/*
 * @Author: 羊驼
 * @Date: 2023-04-25 10:34:46
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-25 11:32:46
 * @Description: file content
 */
import addNode from "../addNode";
export default {
    components: { addNode },
    props: ["isTried", "value", "dataFields"],
    model: {
        prop: "value",
        event: "input"
    },
    emits: ["openDrawer"],
    inject: ["setApproverStr", "conditionStr"],
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
        switch (this.nodeConfig.type) {
            case 1:
            case 2:
                this.nodeConfig.error = this.setApproverStr(this.nodeConfig) == "";
                break;
            case 4:
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
            this.nodeConfig.childNode && this.$emit("input", this.nodeConfig.childNode)
        },
        // 打开编辑弹窗
        setPerson(priorityLevel, item, data, tip) {
            this.$emit("openDrawer", priorityLevel, item, data, tip)
        },
    }
}