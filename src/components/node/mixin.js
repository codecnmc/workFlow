/*
 * @Author: 羊驼
 * @Date: 2023-04-25 10:34:46
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 16:07:26
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
    inject: ["getFlatRoot", "openDrawer"],
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
    mounted() {
        if (this.value == undefined) {
            throw Error("无绑定v-model 请绑定")
        }
        this.setApproverStr()
    },
    methods: {
        placeholderList() {
            return this.$nodeType.toString(this.nodeConfig.type)
        },
        setApproverStr() {
            this.nodeConfig.error == this.$factory.getTypeTextHandle(
                this.nodeConfig.type,
                this.nodeConfig
            ) == "";
        },
        setConditionStr(item) {
            let str = this.$factory.getTypeTextHandle(
                item.type,
                item
            )
            item.error = str == "请设置条件"
            return str
        },
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