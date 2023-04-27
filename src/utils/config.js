/*
 * @Author: 羊驼
 * @Date: 2023-04-25 14:33:54
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 11:35:05
 * @Description: 流程图配置
 */
import Vue from 'vue'
// 生成的id不能重复！
import { v4 } from "uuid"
// 常用类型 全局化 防止swtich语句不知道是谁用的
export const NodeType = {
    开始: 0,
    审核人: 1,
    抄送人: 2,
    条件: 3,
    条件分支: 4,
    办理人: 5,
    结束: 6,
    分支跳点: 7,  // 跳出这次if else 回到主分支继续走
    toString: (type) => {
        for (let kv in this) {
            if (kv == "toString") continue
            if (this[kv] == type) return kv
        }
        return "未知类型"
    }
}

/**
 * @description: 类型生成
 * @param {*}
 * @return {*}
 */
class TypeFactory {

    /**
   * @description: 获取结构
   * @param {*}
   * @return {*}
   */
    getStruct(fatherID, type, childNode, level, priorityLevel) {
        if (this.dic[type]) {
            return this.dic[type](fatherID, childNode, level, level, priorityLevel)
        } else {
            throw Error("无效type类型:" + type)
        }
    }

    // type转方法
    dic = {
        [NodeType.开始]: this.startType,
        [NodeType.审核人]: this.auditType,
        [NodeType.抄送人]: this.carbonCopyType,
        [NodeType.办理人]: this.executeType,
        [NodeType.条件]: this.conditionType,
        [NodeType.条件分支]: this.branchType,
        [NodeType.结束]: this.endType,
        [NodeType.分支跳点]: this.skipType,
    }

    /**
     * @description: 跳点结构
     * @param {*}
     * @return {*}
     */
    skipType(fatherID, childNode, level) {
        return {
            error: false,
            nodeId: v4(),
            childNode,
            type: NodeType.分支跳点,
            fatherID,
            level
        }
    }


    /**
     * @description: 开始类型
     * @param {*}
     * @return {*}
     */
    startType(fatherID, childNode, level) {
        return {
            nodeName: "开始",
            error: true,
            type: NodeType.开始,
            nodeId: v4(),
            nodeUserType: {
                type: "manager",
                value: "m-1",
                valueName: "第一级主管",
                valueList: [],
            },
            childNode,
            fatherID,
            level
        }
    }

    /**
     * @description: 结束类型
     * @param {*}
     * @return {*}
     */
    endType(fatherID, childNode, level) {
        return {
            nodeName: "结束",
            error: true,
            type: NodeType.结束,
            nodeId: v4(),
            nodeUserType: {
                type: "manager",
                value: "m-1",
                valueName: "第一级主管",
                valueList: [],
            },
            childNode,
            fatherID,
            level
        }
    }

    /**
     * @description: 执行人
     * @param {*}
     * @return {*}
     */
    executeType(fatherID, childNode, level) {
        return {
            nodeName: "办理人",
            error: true,
            type: NodeType.办理人,
            nodeId: v4(),
            nodeUserType: {
                type: "manager",
                value: "m-1",
                valueName: "第一级主管",
                valueList: [],
            },
            childNode,
            fatherID,
            level

        }
    }

    /**
     * @description:  审核人数据结构返回
     * @param {*}
     * @return {*}
     */
    auditType(fatherID, childNode, level) {
        return {
            nodeName: "审核人",
            error: true,
            type: NodeType.审核人,
            nodeId: v4(),
            examineMode: "1",
            nodeUserType: {
                type: "manager",
                value: "",
                valueList: [],
                valueName: "",
            },
            childNode,
            fatherID,
            level

        }
    }

    /**
     * @description: 抄送人数据结构
     * @param {*}
     * @return {*}
     */
    carbonCopyType(fatherID, childNode, level) {
        return {
            nodeName: "抄送人",
            error: true,
            type: NodeType.抄送人,
            nodeId: v4(),
            nodeUserType: {
                type: "manager",
                value: "m-1",
                valueName: "第一级主管",
                valueList: [],
            },
            childNode,
            fatherID,
            level
        }
    }

    /**
     * @description: 条件分支数据结构
     * @param {*}
     * @return {*}
     */
    branchType(fatherID, childNode, level) {
        let nodeId = v4()
        return {
            nodeName: "路由",
            type: NodeType.条件分支,
            nodeId,
            childNode,
            fatherID,
            conditionNodes: [
                this[NodeType.条件](nodeId, null, level, 1),
                this[NodeType.条件](nodeId, null, level, 0),
            ],
            level
        }
    }

    /**
     * @description: 条件数据结构
     * @param {*}
     * @return {*}
     */
    conditionType(fatherID, childNode, level, priorityLevel) {
        let nodeName = !priorityLevel ? "默认" : "条件" + priorityLevel
        return {
            nodeName,
            error: true,
            nodeId: v4(),
            type: NodeType.条件,
            priorityLevel,
            conditionList: [],
            childNode,
            fatherID,
            level
        }
    }

}

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
        {
            type: NodeType.办理人,
            label: "办理人",
            icon: "./img/抄送人.png",
            class: "notifier",
        },
        {
            type: NodeType.条件分支,
            label: "条件分支",
            icon: "./img/条件.png",
            class: "condition",
        }
    ],
    // 允许条件嵌套数量
    conditionNestCount: 2,
}




Vue.prototype.$nodeType = NodeType
Vue.prototype.$flowConfig = FlowConfig
Vue.prototype.$factory = new TypeFactory()
