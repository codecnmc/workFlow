/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 11:49:36
 * @Description: 条件类型
 */
import { NodeType, BaseType, getUUID } from "../utils/config";
/**
 * @description: 条件分支类型
 * @param {*}
 * @return {*}
 */
export default class ConditionType extends BaseType {
  filename = "";
  form = "ConditionForm";
  type = NodeType.条件;
  dic = new Map();
  getStruct(fatherID, childNode, level, priorityLevel) {
    let nodeName = !priorityLevel ? "默认" : "条件" + priorityLevel;
    return {
      nodeName,
      error: !priorityLevel ? false : true,
      nodeId: getUUID(),
      type: this.type,
      priorityLevel,
      setting: {
        conditionList: [],
      },
      childNode,
      fatherID,
      level,
    };
  }

  handleText(nodeConfig) {
    let text = [];
    let setting = nodeConfig.setting;
    setting.conditionList.forEach((group, i) => {
      group.forEach((condition, j) => {
        if (condition.key) {
          text.push(
            `${j > 0 ? "且" : `${!i ? "当" : "或"}`}${this.dic.get(condition.key)}${condition.operator}：${
              typeof condition.value == "string" ? condition.value : condition.value.map((x) => (x && x.name) || x).toString()
            }`
          );
        }
      });
    });
    return (text.length > 0 && text) || [nodeConfig.priorityLevel ? "请设置条件" : "未满足时其他条件时，将进入默认流程"];
  }

  beforeSave(nodeConfig) {
    let setting = nodeConfig.setting;
    for (let group of setting.conditionList) {
      for (let condition of group) {
        if (condition.value.length == 0) {
          return false;
        }
      }
    }
    return true;
  }

  setMap(dataFields) {
    this.dic = new Map();
    for (let key in dataFields) {
      this.dic.set(key, dataFields[key].name);
    }
  }
}
