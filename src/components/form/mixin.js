/*
 * @Author: 羊驼
 * @Date: 2023-04-25 16:28:53
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-25 16:30:38
 * @Description: 表单类型通用mixin
 */
export default {
    props: ["value"],
    model: {
        prop: "value",
        event: "input",
    },
    data() {
        return {
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
            // 主管层级
            directorLevel: "1",
            // 用户options
            useroptions: [
                { name: "admin", id: "1", userName: "admin" },
                { name: "Anna", id: "2", userName: "Anna" },
            ],
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