/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-06 15:09:16
 * @Description: 审核人类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
/**
 * @description: 办理人类型
 * @param {*}
 * @return {*}
 */
export default class ExecuteType extends BaseType {

    filename = "normal"
    form = ""
    type = NodeType.办理人

    getStruct(fatherID, childNode, level) {
        return {
            nodeName: "办理人",
            error: true,
            type: this.type,
            nodeId: getUUID(),
            setting: {

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
