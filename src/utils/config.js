/*
 * @Author: 羊驼
 * @Date: 2023-04-25 14:33:54
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 11:48:56
 * @Description: 流程图配置
 */
import Vue from 'vue'

// 常用类型 全局化 防止swtich语句不知道是谁用的
export const NodeType = {
    开始: 0,
    审核人: 1,
    抄送人: 2,
    条件: 3,
    条件分支: 4,
    办理人: 5,
    结束: 6,
    分支跳出: 7,  // 跳出这次if else 回到主分支继续走
    toString: function (type) {
        for (let kv in this) {
            if (kv == "toString") continue
            if (this[kv] == type) return kv
        }
        return "未知类型"
    },
}

export const levelOptions = [
    {
        value: 1,
        label: "一级部门主管",
    },
    {
        value: 2,
        label: "二级部门主管",
    },
]

// 配置
const FlowConfig = {

    // 创建节点后立即弹窗
    createPopupImmediately: false,
    // 各个类型标题的颜色
    headerColor: {
        [NodeType.开始]: "#8cafff",
        [NodeType.审核人]: "rgb(230, 162, 60)",
        [NodeType.抄送人]: "rgb(72, 128, 255)",
        [NodeType.办理人]: "",
        // 条件分支 没有颜色 可以无视
        [NodeType.条件分支]: "",
        [NodeType.结束]: "#8cafff",
    },
    // 生成添加按钮 popover 的显示
    addNodesOptions: [
        {
            type: NodeType.审核人,
            label: "审批人",
            icon: "./img/审批人.png",
            class: "approver",
        },
        {
            type: NodeType.抄送人,
            label: "抄送人",
            icon: "./img/抄送人.png",
            class: "notifier",
        },
        // {
        //     type: NodeType.办理人,
        //     label: "办理人",
        //     icon: "./img/办理人.png",
        //     class: "notifier",
        // },
        {
            type: NodeType.条件分支,
            label: "条件分支",
            icon: "./img/条件.png",
            class: "condition",
        }
    ],
    // 允许条件嵌套数量
    conditionNestCount: 2,
    levelOptions
}

Vue.prototype.$nodeType = NodeType
Vue.prototype.$flowConfig = FlowConfig

