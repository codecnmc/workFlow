/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 10:08:39
 * @Description: 结束类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
/**
 * @description: 结束类型
 * @param {*}
 * @return {*}
 */
export default class EndType extends BaseType {

    filename = "normal"
    form = ""
    type = NodeType.结束

    getStruct(fatherID, childNode, level) {
        return {
            nodeName: "结束",
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
        return ["暂无配置"]
    }

    beforeSave(nodeConfig) {
        return true
    }

}