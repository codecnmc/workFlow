/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 09:42:49
 * @Description: 结束类型
 */
import { NodeType, BaseType, getUUID } from "../utils/config";

/**
 * @description: 结束类型
 * @param {*}
 * @return {*}
 */
export default class EndType extends BaseType {
  filename = "Normal";
  form = "NodeForm";
  type = NodeType.结束;

  getStruct(fatherID, childNode, level) {
    return {
      nodeName: "结束",
      error: true,
      type: this.type,
      nodeId: getUUID(),
      setting: {
        carbonCopySetting: [],
      },
      childNode,
      fatherID,
      level,
    };
  }

  handleText(nodeConfig) {
    let text = [];
    return (text.length > 0 && text) || ["暂无配置"];
  }

  beforeSave(nodeConfig) {
    return true;
  }
}
