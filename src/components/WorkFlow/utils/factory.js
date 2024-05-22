/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:02:51
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 17:21:21
 * @Description: 类型生成以及配置
 */
import { getUUID } from "./config";
import nodeMix from "../node/mixin";
import formMix from "../form/mixin";
/**
 * @description: 类型生成
 * @param {*}
 * @return {*}
 */
export default class TypeFactory {
  // 收集type类
  factory = {};
  nodeType = null;
  app = null;
  nodeFilesList = new Set();
  config = null;
  constructor(nodeType, app, config) {
    this.nodeType = nodeType;
    this.app = app;
    this.config = config;
  }

  /**
   * @description: 创建自定义的节点
   * @param {*} filename 节点组件名称
   * @param {*} view  节点组件
   */
  createCustomNodeComponent(filename, view) {
    let { app, nodeFilesList } = this;
    if (!filename) throw Error(`自定义节点无效传参 组件名称：${filename}`);
    if (!view) throw Error(`自定义节点无效传参 组件内容`);
    if (nodeFilesList.has(filename)) throw Error("该节点组件名称已被注册过了");
    nodeFilesList.add(filename);
    let mix = view.mixins && view.mixins.find((x) => x.mixName == "node");
    if (!mix) {
      view.mixins = (view.mixins && view.mixins.concat(nodeMix)) || [nodeMix];
    }
    app.component(filename, view);
  }

  /**
   * @description: 节点创建
   * @param {number} type 节点类型
   * @param {string} nodeName 渲染组件的标题
   * @param {string} filename 节点渲染的组件名称
   * @param {string} form 节点渲染的表单
   * @param {object} setting 返回节点nodeConfig.setting的结构
   * @param {function} textSetting 文字处理
   * @param {function} saveSetting 保存前校验
   * @return {*}
   */
  createNode(type, setting, textSetting, saveSetting, nodeName = "节点", filename = "Normal", form = "NodeForm") {
    if (type === undefined) {
      throw Error(`未注册类型:${type}`);
    }
    if (!this.nodeFilesList.has(filename)) {
      throw Error(`未注册节点Vue组件 ${filename}`);
    }
    if (!setting) {
      throw Error("节点配置不能为空");
    }
    if (typeof textSetting != "function" || typeof saveSetting != "function") {
      throw Error("传入参数不是函数");
    }
    return {
      filename,
      type,
      form,
      getStruct(fatherID, childNode, level) {
        return {
          nodeName,
          error: true,
          type,
          nodeId: getUUID(),
          setting,
          childNode,
          fatherID,
          level,
        };
      },
      handleText(nodeConfig) {
        let nodeSetting = nodeConfig.setting;
        let text = textSetting(nodeSetting);
        if (Array.isArray(text)) {
          return (text.length > 0 && text) || ["暂无配置"];
        }
        return ["暂无配置"];
      },
      beforeSave(nodeConfig) {
        let nodeSetting = nodeConfig.setting;
        return saveSetting(nodeSetting);
      },
    };
  }

  /**
   * @description: 注册类型
   * @param {*} typeName 类型名称
   * @param {*} typeValue 类型值
   * @param {*} color 标题颜色
   * @param {*} icon 图标
   * @return {*}
   */
  rigsterType(typeName, typeValue, color = "rgb(230, 162, 60)", icon = "", btn_class = "") {
    let { config, nodeType } = this;
    if (nodeType[typeName] != undefined) throw Error(`已经存在该类型名称:${typeName}`);
    for (let key in nodeType) {
      if (nodeType[key] === typeValue) {
        throw Error(`${key}已经存在该类型值:${typeValue}`);
      }
    }
    nodeType[typeName] = typeValue;
    config.headerColor[nodeType[typeName]] = color;
    config.addNodesOptions = [
      {
        type: nodeType[typeName],
        label: typeName,
        icon: icon || require("../images/节点.png"),
        class: btn_class,
      },
    ].concat(config.addNodesOptions);
  }

  /**
   * @description: 注册自定义节点的 node数据结构和它对应的表单
   * @param {*} type 类型
   * @param {*} node 节点数据
   * @param {*} view 节点组件
   */
  registerComponent(type, node, view) {
    let { factory, app } = this;
    if (type === "" || type == undefined) throw Error("无效注册类型:" + type);
    if (!node) throw Error("传入注册节点为空");
    factory[type] = node;
    if (view) {
      let mix = view.mixins && view.mixins.find((x) => x.mixName == "form");
      if (!mix) {
        view.mixins = (view.mixins && view.mixins.concat(formMix)) || [formMix];
      }
      app.component(node.form, view);
    }
  }

  /**
   * @description: 获取结构
   * @param {*}
   * @return {*}
   */
  getStruct(fatherID, type, childNode, level, priorityLevel) {
    if (this.factory[type]) {
      return this.factory[type].getStruct(fatherID, childNode, level, level, priorityLevel);
    } else {
      throw Error("无效type类型:" + type);
    }
  }

  /**
   * @description: 获取文字处理方式
   * @param {*}
   * @return {*}
   */
  getTypeTextHandle(type, nodeConfig) {
    return (this.factory[type] && this.factory[type].handleText(nodeConfig)) || "";
  }

  /**
   * @description: 保存前处理
   * @param {*}
   * @return {*}
   */
  getTypeBeforeSave(type, nodeConfig) {
    return this.factory[type] && this.factory[type].beforeSave(nodeConfig);
  }

  /**
   * @description: 获取节点组件名称
   * @param {*}
   * @return {*}
   */
  getTypeComponentName(type) {
    return this.factory[type] && this.factory[type].filename;
  }

  /**
   * @description: 获取表单组件名称
   * @param {*}
   * @return {*}
   */
  getFormComponentName(type) {
    return this.factory[type] && this.factory[type].form;
  }

  /**
   * @description: 重置下拉选项数据
   * @param {*} dataFields 对象
   * @return {*}
   */
  resetDataFields(dataFields) {
    this.config.dataFields = dataFields;
    this.factory[this.nodeType.条件].setMap(dataFields);
  }
}
