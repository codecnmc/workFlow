/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-04 17:43:05
 * @Description: 开始类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
/**
 * @description: 开始类型
 * @param {*}
 * @return {*}
 */
export default class StartType extends BaseType {

    filename = "normal"
    form = "startForm"
    type = NodeType.开始

    getStruct(fatherID, childNode, level) {
        return {
            nodeName: "开始",
            error: true,
            type: this.type,
            nodeId: getUUID(),
            setting: {
                allowCommit: "All",  // All 全员 Assign 指定 None 均不可提交
                assignMode: 0,      // 0 指定部门 1 指定成员
                department: [],     // 指定部门
                member: [],         // 指定成员
                carbonCopySetting: [],   // 抄送人配置
            },
            childNode,
            fatherID,
            level
        }
    }

    handleText(nodeConfig) {
        let text = ""
        switch (nodeConfig.allowCommit) {
            case "All":
                text = "提交人:全员可提交"
                break;
            case "Assign":
                // 只处理一份数据

                break
            case "None":
                return "提交人:均不可提交"
        }
        return "暂无配置"
    }

    beforeSave(nodeConfig) {
        return true
    }

}
