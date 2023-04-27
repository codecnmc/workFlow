/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 14:44:41
 * @Description: 跳点类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
/**
 * @description: 跳点类型
 * @param {*}
 * @return {*}
 */
export default class AuditType extends BaseType {

    filename = ""
    form = ""
    type = NodeType.分支跳出

    getStruct(fatherID, childNode, level) {
        return {
            error: false,
            nodeId: getUUID(),
            childNode,
            type: NodeType.分支跳出,
            fatherID,
            level
        }
    }

}