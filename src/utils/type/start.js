/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 14:20:21
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
    form = ""
    type = NodeType.开始

    getStruct(fatherID, childNode, level) {
        return {
            nodeName: "开始",
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

    }

    beforeSave(nodeConfig) { }

}
