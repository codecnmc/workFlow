/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 14:44:48
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

    }

    beforeSave(nodeConfig) { }

}