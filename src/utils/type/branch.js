/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 15:59:13
 * @Description: 条件分支类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
import CondtionType from "./condtion"
const condition = new CondtionType()
/**
 * @description: 条件分支类型
 * @param {*}
 * @return {*}
 */
export default class BranchType extends BaseType {

    filename = "branch"
    form = ""
    type = NodeType.条件分支

    getStruct(fatherID, childNode, level) {
        let nodeId = getUUID()
        return {
            nodeName: "路由",
            type: this.type,
            nodeId,
            childNode,
            fatherID,
            conditionNodes: [
                condition.getStruct(nodeId, null, level, 1),
                condition.getStruct(nodeId, null, level, 0)

                // this[NodeType.条件](nodeId, null, level, 1),
                // this[NodeType.条件](nodeId, null, level, 0),
            ],
            level
        }
    }

    handleText(nodeConfig) {
        //条件显示
        for (var i = 0; i < nodeConfig.conditionNodes.length; i++) {
            nodeConfig.conditionNodes[i].error =
                condition.handleText(nodeConfig.conditionNodes[i]) ==
                "请设置条件";
        }

    }

    beforeSave(nodeConfig) { }

}
