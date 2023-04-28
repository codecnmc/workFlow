/*
 * @Author: 羊驼
 * @Date: 2023-04-27 09:28:34
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-28 13:49:57
 * @Description: 帮助方法
 */
import { NodeType } from "./config"

/**
 * @description:  计算普通节点偏移量
 * @param {*}
 * @return {*}
 */
export function nodeOffset(nodeConfig, flatDic) {
    let maxLevel = getMaxLevel(flatDic)
    let level = maxLevel - 1;
    if ([NodeType.结束, NodeType.开始].includes(nodeConfig.type)) {
        // 偏移懒得算 有需求可以自己加
        switch (level) {
            case 1:
                return "190px";
            case 2:
                return "500px"
            default:
                return "0px";
        }
    }
    if (level > 0) {
        let node = flatDic[nodeConfig.fatherID]
        while (node) {
            if (node.type == NodeType.条件分支 && nodeConfig.level != 1) {
                return "240px"
            }
            if (node.type == NodeType.条件) {
                return "0px"
            }
            node = flatDic[node.fatherID]
        }
        return "190px"
    }
    return "0px";
}

/**
 * @description: 获取最大的层次等级
 * @param {*}
 * @return {*}
 */
export function getMaxLevel(flatDic) {
    let maxLevel = 1;
    for (let kv in flatDic) {
        maxLevel = Math.max(maxLevel, flatDic[kv].level);
    }
    return maxLevel
}
