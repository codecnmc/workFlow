/*
 * @Author: 羊驼
 * @Date: 2023-04-25 16:28:53
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-04 17:35:51
 * @Description: 表单类型通用mixin
 */
export default {
    inject: ["useroptions", "directorLevelList"],
    props: ["value"],
    model: {
        prop: "value",
        event: "input",
    },
    data() {
        return {
            // 主管层级
            directorLevel: "1",
        }
    },
    computed: {
        approverConfig: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", approverConfig);
            },
        },
        setting: {
            get() {
                return this.approverConfig.setting
            },
            set(value) {
                this.approverConfig.setting = value
            }
        },
        setTypeLabel() {
            if (this.approverConfig.nodeUserType.type === "manager")
                return "部门主管：";
            if (
                this.approverConfig.nodeUserType.type === "role" &&
                this.approverConfig.type === 1
            )
                return "审批角色：";
            if (
                this.approverConfig.nodeUserType.type === "role" &&
                this.approverConfig.type === 2
            )
                return "抄送角色：";
            if (this.approverConfig.nodeUserType.type === "user") return "指定用户：";
            return "";
        },
    },
    methods: {
        //节点类型
        setTypeRadio(val) {
            if (this.approverConfig.nodeUserType.valueList.length > 0) {
                this.approverConfig.nodeUserType.valueList = "";
            }
            // this.approverConfig.nodeUserType.value = ''
            if (val === "role") {
                // this.companyRoles()
                return;
            }
            if (val === "user") {
                // this.companyUsersList()
                return;
            }
            if (val === "manager") {
                this.approverConfig.nodeUserType.value = "部门主管";
            }
        },
    }

}