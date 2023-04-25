/*
 * @Author: 羊驼
 * @Date: 2023-04-25 10:34:46
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-25 10:53:00
 * @Description: file content
 */
export default {
    props: ["isTried", "value"],
    model: {
        prop: "value",
        event: "input"
    },
    emits: ["openDrawer"],
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
    },
    methods: {
        delNode() {
            this.$emit("update:nodeConfig", this.nodeConfig.childNode);
        },
        //审批人抄送人显示和校验
        setApproverStr(nodeConfig) {
            let type = "会签";
            let role = "部门主管";
            if (nodeConfig.nodeUserType.type === "role") role = "角色";
            if (nodeConfig.nodeUserType.type === "user") role = "用户";
            if (nodeConfig.nodeUserType.value == "") return "";
            if (nodeConfig.type === 1) {
                //审批
                if (nodeConfig.examineMode === "1") type = "会签";
                if (nodeConfig.examineMode === "2") type = "或签";
                if (nodeConfig.examineMode === "3") type = "逐级审批";
                if (
                    nodeConfig.nodeUserType.type === "manager" &&
                    nodeConfig.examineMode === "3"
                ) {
                    if (nodeConfig.nodeUserType.value.indexOf("m") != -1) {
                        return `由发起人向上的${nodeConfig.nodeUserType.valueName}审批`;
                    } else {
                        return `由${nodeConfig.nodeUserType.valueName}审批`;
                    }
                }
                if (
                    nodeConfig.nodeUserType.type === "manager" &&
                    nodeConfig.examineMode !== "3"
                ) {
                    return `由${role}${type}`;
                }
                return `由${role}：${nodeConfig.nodeUserType.valueName}${type}`;
            }
            if (nodeConfig.type === 2) {
                //抄送
                if (nodeConfig.nodeUserType.value == "") return "";
                if (nodeConfig.nodeUserType.type === "manager") {
                    //主管
                    if (nodeConfig.nodeUserType.value.indexOf("m") != -1) {
                        return `给发起人向上的${nodeConfig.nodeUserType.valueName}抄送`;
                    } else {
                        return `给${nodeConfig.nodeUserType.valueName}抄送`;
                    }
                }
                // 角色、用户
                return `给${role}：${nodeConfig.nodeUserType.valueName}抄送`;
            }
        },
        setPerson() {
            this.$emit("openDrawer")
        }
    }
}