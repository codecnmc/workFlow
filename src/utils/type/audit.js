/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 15:30:49
 * @Description: 审核人类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
/**
 * @description: 审核人类型
 * @param {*}
 * @return {*}
 */
export default class AuditType extends BaseType {

    filename = "normal"
    form = "auditForm"
    type = NodeType.审核人

    getStruct(fatherID, childNode, level) {
        return {
            nodeName: "审核人",
            error: true,
            type: this.type,
            nodeId: getUUID(),
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

    handleText(nodeConfig) {
        let type = "会签";
        let role = "部门主管";
        if (nodeConfig.nodeUserType.type === "role") role = "角色";
        if (nodeConfig.nodeUserType.type === "user") role = "用户";
        if (nodeConfig.nodeUserType.value == "") return "";
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

    beforeSave(nodeConfig) { }

}