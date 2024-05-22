/*
 * @Author: 羊驼
 * @Date: 2023-04-25 14:33:54
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 15:50:39
 * @Description: 流程图配置
 */
import { v4 } from "uuid";
// 生成的id不能重复！
export const getUUID = v4;
// 常用类型 全局化 防止swtich语句不知道是谁用的
export let NodeType = {
  开始: 0,
  条件: 2,
  条件分支: 3,
  结束: 4,
  删除块: 5,
  toString: function (type) {
    for (let kv in this) {
      if (kv == "toString") continue;
      if (this[kv] == type) return kv;
    }
    return "未知类型";
  },
};

// 类型基类
export class BaseType {
  // node文件名称
  filename = "Normal";
  // form文件名称
  form = "";
  // 类型
  type = NodeType.开始;

  // 获取类型结构
  getStruct() {}
  // 文字处理
  handleText(nodeConfig) {}
  // 保存前处理
  beforeSave(nodeConfig) {}
}

// 配置
export let FlowConfig = {
  // 创建节点后立即弹窗
  createPopupImmediately: false,
  // 各个类型标题的颜色
  headerColor: {
    [NodeType.开始]: "#8cafff",
    // 条件分支 没有颜色 可以无视
    [NodeType.条件分支]: "",
    [NodeType.结束]: "#8cafff",
  },
  // 生成添加按钮 popover 的显示
  addNodesOptions: [
    {
      type: NodeType.条件分支,
      label: "条件分支",
      icon: require("../images/条件.png"),
      class: "condition",
    },
  ],
  dataFields: {
    submitter: { name: "提交人", conditions: ["属于", "不属于"], values: [{ label: "123", value: "123" }], single: false },
  },
};
