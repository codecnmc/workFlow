/*
 * @Author: 羊驼
 * @Date: 2023-04-27 14:15:11
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 15:41:00
 * @Description: 条件类型
 */
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
/**
 * @description: 条件分支类型
 * @param {*}
 * @return {*}
 */
export default class ConditionType extends BaseType {

    filename = ""
    form = "conditionForm"
    type = NodeType.条件

    getStruct(fatherID, childNode, level, priorityLevel) {
        let nodeName = !priorityLevel ? "默认" : "条件" + priorityLevel
        return {
            nodeName,
            error: true,
            nodeId: getUUID(),
            type: this.type,
            priorityLevel,
            conditionList: [],
            childNode,
            fatherID,
            level
        }
    }

    handleText(nodeConfig) {
        let item = nodeConfig
        let {
            conditionList, //条件组
            conditionString, //条件数据
            conditionStringName, //条件显示
        } = item;
        let arr = [true]; //判断条件是否有值
        if (conditionList.length === 0 || conditionString === "") {
            if (item.nodeName === "默认") {
                return "其他情况";
            }
            return "请设置条件";
        }
        if (conditionList.length !== 0) {
            if (conditionList.length === 1) {
                //当条件组为一个
                conditionList[0].conditionChildrenNodes &&
                    conditionList[0].conditionChildrenNodes.forEach((item, index) => {
                        if (
                            item.leftFileds == "" ||
                            item.centerFileds == "" ||
                            item.rightFileds == ""
                        ) {
                            arr.push(false);
                        }
                        if (index !== 0 && item.conditionOperator == "") {
                            arr.push(false);
                        }
                    });
            } else {
                //当条件组为多个（判断是否有运算符）
                conditionList.forEach((item, index) => {
                    if (index != conditionList.length - 1) {
                        //条件组不为最后一个.校验是否有条件运算符
                        if (item.conditionGroupOperator == "") arr.push(false);
                    }
                    if (
                        item.conditionChildrenNodes &&
                        item.conditionChildrenNodes.length > 0
                    ) {
                        item.conditionChildrenNodes.forEach((it, ind) => {
                            if (
                                it.leftFileds === "" ||
                                it.centerFileds === "" ||
                                it.rightFileds == ""
                            )
                                arr.push(false);
                            if (ind !== 0 && it.conditionOperator == "") arr.push(false);
                        });
                    } else if (
                        item.conditionChildrenNodes &&
                        item.conditionChildrenNodes.length == 0
                    ) {
                        arr.push(false);
                    }
                });
            }
            if (arr.includes(false)) {
                return "请设置条件";
            }
        }
        return conditionStringName;
    }

    beforeSave(nodeConfig) { }

}
