/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 11:12:56
 * @Description: 开始类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
import { carbonTextHandle, carbonValidate } from "../tools"

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
                carbonCopySetting: [
                    // {
                    //     type: 1, // 直属上级
                    //     level: 1, // 如果为部门负责人 选择层级
                    //     member: [],
                    // },
                ],   // 抄送人配置
            },
            childNode,
            fatherID,
            level
        }
    }

    handleText(nodeConfig) {
        let text = []
        let nodeSetting = nodeConfig.setting
        switch (nodeSetting.allowCommit) {
            case "All":
                text.push("提交人：全员可提交")
                break;
            case "Assign":
                let value = nodeSetting.assignMode ? `提交人：${nodeSetting.member.map((x) => x.name).toString()}` : `提交部门：${nodeSetting.department.map((x) => x.thirdDepartment).toString()}`
                text.push(value)
                break
            case "None":
                return ["提交人：均不可提交"]
        }
        carbonTextHandle(nodeSetting.carbonCopySetting, text)
        return text.length > 0 && text || "暂无配置"
    }

    beforeSave(nodeConfig) {
        let nodeSetting = nodeConfig.setting
        if (nodeSetting.allowCommit == "Assign") {
            let noSelect = nodeSetting.assignMode ? nodeSetting.member.length < 1 : nodeSetting.department.length < 1
            if (noSelect) {
                return false
            }
        }
        // 存在抄送人 但是没有选择成员的情况
        return carbonValidate(nodeSetting.carbonCopySetting)
    }

}
