/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 10:10:45
 * @Description: 开始类型
 */
import { NodeType, BaseType, getUUID } from "../utils/config";

/**
 * @description: 开始类型
 * @param {*}
 * @return {*}
 */
export default class StartType extends BaseType {
  filename = "Normal";
  form = "NodeForm";
  type = NodeType.开始;

  getStruct(fatherID, childNode, level) {
    return {
      nodeName: "开始",
      error: true,
      type: this.type,
      nodeId: getUUID(),
      setting: {},
      childNode,
      fatherID,
      level,
    };
  }

  handleText(nodeConfig) {
    let text = [];
    let nodeSetting = nodeConfig.setting;
    return (text.length > 0 && text) || ["暂无配置"];
  }

  beforeSave(nodeConfig) {
    let nodeSetting = nodeConfig.setting;
    return true;
  }
}
