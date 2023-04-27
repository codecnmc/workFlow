/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:02:51
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 15:07:05
 * @Description: 类型生成以及配置
 */

// 类型基类
export class BaseType {

    // node文件名称
    filename = "normal"
    // form文件名称
    form = ""
    // 类型
    type = NodeType.开始

    // 获取类型结构
    getStruct() { }
    // 文字处理
    handleText(nodeConfig) { }
    // 保存前处理
    beforeSave(nodeConfig) { }
}


import Vue from 'vue'

import { NodeType } from "./config"
// 生成的id不能重复！
import { v4 } from "uuid"

export const getUUID = v4

// 读取type类型文件夹下的js
let modulesFiles = require.context('./type', true, /\.js$/)
modulesFiles = modulesFiles.keys().map((x) => x = x.replace("./", ""))
let modules = []
modulesFiles.forEach((item) => {
    let targetType = require(`./type/${item}`)
    modules.push(new targetType.default())
})

/**
 * @description: 类型生成
 * @param {*}
 * @return {*}
 */
class TypeFactory {

    constructor() {
        for (let item of modules) {
            this.factory[item.type] = item
        }
        this.registerComponents()
    }

    // 收集type类
    factory = {}


    /**
   * @description: 获取结构
   * @param {*}
   * @return {*}
   */
    getStruct(fatherID, type, childNode, level, priorityLevel) {
        if (this.factory[type]) {
            return this.factory[type].getStruct(fatherID, childNode, level, level, priorityLevel)
        } else {
            throw Error("无效type类型:" + type)
        }
    }

    /**
     * @description: 注册组件
     * @param {*}
     * @return {*}
     */
    registerComponents() {
        let formSet = new Set()
        let nodeSet = new Set()
        for (let kv in this.factory) {
            let { filename, form } = this.factory[kv]
            filename && nodeSet.add(filename)
            form && formSet.add(form)
        }
        formSet.forEach((value) => {
            Vue.component(value, () => import(`@/components/form/${value}.vue`))
        })
        nodeSet.forEach((value) => {
            Vue.component(value, () => import(`@/components/node/${value}.vue`))
        })
    }

    /**
     * @description: 获取文字处理方式
     * @param {*}
     * @return {*}
     */
    getTypeTextHandle(type) {
        return this.factory[type] && this.factory[type].handleText(type) || ""
    }

    /**
     * @description: 保存前处理
     * @param {*}
     * @return {*}
     */
    getTypeBeforeSave(type) {
        return this.factory[type] && this.factory[type].beforeSave(type)
    }

    /**
     * @description: 获取节点组件名称
     * @param {*}
     * @return {*}
     */
    getTypeComponentName(type) {
        return this.factory[type] && this.factory[type].filename
    }

    /**
     * @description: 获取表单组件名称
     * @param {*}
     * @return {*}
     */    
    getFormComponentName(type) {
        return this.factory[type] && this.factory[type].form
    }

}


Vue.prototype.$factory = new TypeFactory()