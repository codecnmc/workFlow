/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 14:07:22
 * @Description: 跳点类型
 */
import { NodeType, BaseType, getUUID } from "../utils/config";
/**
 * @description: 删除类型
 * @param {*}
 * @return {*}
 */
export default class DeleteType extends BaseType {
  filename = "";
  form = "";
  type = NodeType.删除块;

  getStruct(fatherID, childNode, level) {
    return {
      error: false,
      nodeId: getUUID(),
      childNode,
      type: this.type,
      fatherID,
      level,
    };
  }
}
