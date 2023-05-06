/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-06 10:09:37
 * @Description: 条件类型
 */
import { NodeType, dataFields } from "../config"
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
    dic = new Map()
    getStruct(fatherID, childNode, level, priorityLevel) {
        let nodeName = !priorityLevel ? "默认" : "条件" + priorityLevel
        let conditionList = !priorityLevel ? [] : [[{
            operator: "属于",
            key: "submitter",
            value: []
        }]]
        return {
            nodeName,
            error: !priorityLevel ? false : true,
            nodeId: getUUID(),
            type: this.type,
            priorityLevel,
            setting: {
                conditionList,
            },
            childNode,
            fatherID,
            level
        }
    }

    initDic() {
        this.dic.size < 1 && dataFields.forEach((item) => {
            this.dic.set(item.key, item.name)
        })
    }

    handleText(nodeConfig) {
        this.initDic()
        let text = []
        let setting = nodeConfig.setting
        setting.conditionList.forEach((group, i) => {
            group.forEach((condition, j) => {
                text.push(`${j > 0 ? "且" : `${!i ? '当' : '或'}`}${this.dic.get(condition.key)}${condition.operator}${condition.value.map((x) => x.name).toString()}`)
            })
        })
        return text.length > 0 && text || [nodeConfig.priorityLevel ? "请设置条件" : "未满足时其他条件时，将进入默认流程"]
    }

    beforeSave(nodeConfig) {
        let setting = nodeConfig.setting
        for (let group of setting.conditionList) {
            for (let condition of group) {
                if (condition.value.length == 0) {
                    return false
                }
            }
        }
        return true
    }

}
