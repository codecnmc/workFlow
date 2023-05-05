/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 15:05:26
 * @Description: 审核人类型
 */
import { NodeType, levelOptions } from "../config"
import { BaseType, getUUID } from "../factory"
import { carbonTextHandle, carbonValidate } from "../tools"

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
            setting: {
                auditType: 0,
                approverLevel: 1,
                approverType: 0,
                approverMember: [],
                multipleMode: 0,
                sameMode: 1,
                carbonCopySetting: []
            },
            childNode,
            fatherID,
            level

        }
    }

    handleText(nodeConfig) {
        let text = []
        let nodeSetting = nodeConfig.setting
        switch (nodeSetting.auditType) {
            case 0:
                this.handleApproverText(nodeSetting, text)
                break;
            case 1:
            case 2:
                let data = nodeSetting.auditType == 1 ? "自动通过" : "自动拒绝"
                nodeConfig.nodeName = data
                return [data]
        }
        carbonTextHandle(nodeSetting.carbonCopySetting, text)
        return text.length > 0 && text || ["暂无配置"];
    }

    handleApproverText(nodeSetting, text) {
        switch (nodeSetting.approverType) {
            case 0:
                text.push(`审核人：直属上级`)
                break;
            case 1:
                text.push(`审核人：${levelOptions.find((x) => x.value == nodeSetting.approverLevel).label}`)
                break;
            case 2:
                text.push(`审核人：${nodeSetting.approverMember.map((x) => x.name).toString()}`)
                if (nodeSetting.approverMember.length > 1) {
                    switch (nodeSetting.multipleMode) {
                        case 0:
                            text.push("多人审核模式：会签")
                            break;
                        case 1:
                            text.push("多人审核模式：或签")
                            break
                        case 2:
                            text.push("多人审核模式：依次审批")
                            break;
                    }
                }
                break;
        }
    }

    beforeSave(nodeConfig) {
        let nodeSetting = nodeConfig.setting
        switch (nodeSetting.auditType) {
            case 0:
                if (nodeSetting.approverType == 2 && nodeSetting.approverMember == 0) {
                    return false
                }
                break;
            case 1:
            case 2:
                return true
        }
        return carbonValidate(nodeConfig.setting.carbonCopySetting)
    }

}