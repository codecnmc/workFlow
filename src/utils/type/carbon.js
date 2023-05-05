/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 11:11:12
 * @Description: 抄送人类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
import { carbonTextHandle, carbonValidate } from "../tools"

/**
 * @description: 办理人类型
 * @param {*}
 * @return {*}
 */
export default class CarbornType extends BaseType {

    filename = "normal"
    form = "carbonForm"
    type = NodeType.抄送人

    getStruct(fatherID, childNode, level) {
        return {
            nodeName: "抄送人",
            error: true,
            type: this.type,
            nodeId: getUUID(),
            setting: {
                carbonCopySetting: [
                    {
                        type: 1, // 直属上级
                        level: 1, // 如果为部门负责人 选择层级
                        member: [],
                    },
                ],   // 抄送人配置
            },
            childNode,
            fatherID,
            level
        }
    }

    handleText(nodeConfig) {
        let text = []
        carbonTextHandle(nodeConfig.setting.carbonCopySetting, text)
        return text.length > 0 && text || "暂无配置"
    }

    beforeSave(nodeConfig) {
        return carbonValidate(nodeConfig.setting.carbonCopySetting)
    }

}
