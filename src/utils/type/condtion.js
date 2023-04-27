/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 15:15:22
 * @Description: 条件类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
/**
 * @description: 条件分支类型
 * @param {*}
 * @return {*}
 */
export default class ConditionType extends BaseType {

    filename = ""
    form = "conditionForm"
    type = NodeType.条件

    getStruct(fatherID, childNode, level,priorityLevel) {
        let nodeName = !priorityLevel ? "默认" : "条件" + priorityLevel
        return {
            nodeName,
            error: true,
            nodeId: getUUID(),
            type: this.type,
            priorityLevel,
            conditionList: [],
            childNode,
            fatherID,
            level
        }
    }

    handleText(nodeConfig) {

    }

    beforeSave(nodeConfig) { }

}
