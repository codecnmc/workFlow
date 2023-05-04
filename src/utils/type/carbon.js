/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-04 17:39:52
 * @Description: 抄送人类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
/**
 * @description: 办理人类型
 * @param {*}
 * @return {*}
 */
export default class CarbornType extends BaseType {

    filename = "normal"
    form = "carbonForm"
    type = NodeType.抄送人

    getStruct(fatherID, childNode, level) {
        return {
            nodeName: "抄送人",
            error: true,
            type: this.type,
            nodeId: getUUID(),
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

    handleText(nodeConfig) {
        let type = "会签";
        let role = "部门主管";
        if (nodeConfig.nodeUserType.type === "role") role = "角色";
        if (nodeConfig.nodeUserType.type === "user") role = "用户";
        if (nodeConfig.nodeUserType.value == "") return "";
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

    beforeSave(nodeConfig) {
        return true
    }

}
