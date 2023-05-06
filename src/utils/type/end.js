/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-06 15:09:00
 * @Description: 结束类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
import { carbonTextHandle, carbonValidate } from "../tools"

/**
 * @description: 结束类型
 * @param {*}
 * @return {*}
 */
export default class EndType extends BaseType {

    filename = "normal"
    form = "carbonForm"
    type = NodeType.结束

    getStruct(fatherID, childNode, level) {
        return {
            nodeName: "结束",
            error: true,
            type: this.type,
            nodeId: getUUID(),
            setting: {
                carbonCopySetting: []
            },
            childNode,
            fatherID,
            level
        }
    }

    handleText(nodeConfig) {
        let text = []
        carbonTextHandle(nodeConfig.setting.carbonCopySetting, text)
        return text.length > 0 && text || ["暂无配置"]
    }

    beforeSave(nodeConfig) {
        return carbonValidate(nodeConfig.setting.carbonCopySetting)
    }

}