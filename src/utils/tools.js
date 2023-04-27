/*
 * @Author: 羊驼
 * @Date: 2023-04-27 09:28:34
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 17:39:50
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
    if (nodeConfig.type == NodeType.结束) {
        // 偏移懒得算 有需求可以自己加
        switch (level) {
            case 1:
                return "240px";
            default:
                return "0px";
        }
    }
    if (level > 0) {
        let node = flatDic[nodeConfig.fatherID]
        while (node) {
            if (node.type == NodeType.条件分支) {
                return "240px"
            }
            if (node.type == NodeType.条件) {
                return "0px"
            }
            node = flatDic[node.fatherID]
        }
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
