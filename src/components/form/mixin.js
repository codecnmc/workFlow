/*
 * @Author: 羊驼
 * @Date: 2023-04-25 16:28:53
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 11:20:18
 * @Description: 表单类型通用mixin
 */
export default {
    inject: ["memberOptions"],
    props: ["value"],
    model: {
        prop: "value",
        event: "input",
    },
    computed: {
        approverConfig: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
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
    },

}