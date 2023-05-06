# 流程图(element-ui)
[git地址](https://github.com/codecnmc/workFlow/tree/master)
根据原开源项目拓展修改的项目
## 安装依赖
```
cnpm i
```

### 运行
```
npm run serve
```

### 打包
```
npm run build
```
### 节点基础结构组成

```javascript
  			nodeName: "开始",  	// 节点名称
            error: true,      	// 是否有误
            type: this.type,  	// 节点类型
            nodeId: getUUID(),	// 节点id
            setting: {},  		// 节点配置 不同类型内容不同
            conditionNodes:[],  // 仅类型为条件分支的时候有
            childNode,			// 子节点
            fatherID,			// 父节点id
            level				// 层级
```

### 不同节点下setting的属性

#### 开始节点
|字段名称 | 类型| 解释  |
|--|--|--|
| allowCommit | string |  允许提交情况 All 全员 Assign 指定 None 均不可提交 |
| assignMode| int |  指定模式 0指定部门 1指定成员 |
| department|  array| 指定部门数据数组 |
| member|  array| 指定成员数据数组 |
| carbonCopySetting|  array| 抄送人数据数组 有抄送人的都通用  |

#### 抄送人数据数组项
|字段名称 | 类型| 解释  |
|--|--|--|
| type| int|  0 直属上级 1 部门负责人 2 指定成员 |
| level| int|  1 一级部门主管 2 二级部门主管 |
| member | array|  指定成员数据  object {user_id:成员id name 成员名称} |

#### 审核节点
|字段名称 | 类型| 解释  |
|--|--|--|
| auditType| int|  审批类型  0 人工审批 1 自动通过 2 自动拒绝 |
| approverType| int|  审批人类型  0直属上级 1 部门负责人 2 指定成员 |
| approverLevel| int|  审批类型为部门负责人时 部门等级 |
| approverMember| array|  指定审批成员数据  object {user_id:成员id name 成员名称} |
| multipleMode| int| 多人审批的模式 0 会签 1 或签 2 依次审批 |
| sameMode| int| 提交人与审批人为同一人时 0 由提交人对自己审批 1 自动跳过 2 转交给直属上级审批 |
| carbonCopySetting|  array| 抄送人数据数组 有抄送人的都通用  |

#### 条件节点
结构

```javascript
            nodeName,
            error: !priorityLevel ? false : true,
            nodeId: getUUID(),
            type: this.type,
            priorityLevel,	// 优先级 几乎不用处理 按原顺序就好了 0 一定是为else的情况
            setting: {
                conditionList=[[{
		            operator: "属于",
		            key: "submitter",
		            value: []
        		}]],	// 条件数组
            },
            childNode,
            fatherID,
            level
```
二维数组 第一层是条件组 第二层数组才是条件 索引0以后的全部视为或关系
|字段名称 | 类型| 解释  |
|--|--|--|
| operator| string | 操作符 |
| key| string | 比对的字段 |
| value |  array| 比对的值 |

### 配置
#### 配置文件 config.js
```javascript
	// 常用类型 全局化 防止swtich语句不知道是谁用的
	export const NodeType = {
	    开始: 0,
	    审核人: 1,
	    抄送人: 2,
	    条件: 3,
	    条件分支: 4,
	    办理人: 5,
	    结束: 6,
	    分支跳出: 7,  // 跳出这次if else 回到主分支继续走
	    toString: function (type) {
	        for (let kv in this) {
	            if (kv == "toString") continue
	            if (this[kv] == type) return kv
	        }
	        return "未知类型"
	    },
	}
	
	export const levelOptions = [
	    {
	        value: 1,
	        label: "一级部门主管",
	    },
	    {
	        value: 2,
	        label: "二级部门主管",
	    },
	]
	
	export const operatorList = ["属于", "不属于"]
	export const dataFields = [{ name: "提交人", key: "submitter" }]
	
	// 配置
	const FlowConfig = {
	
	    // 创建节点后立即弹窗
	    createPopupImmediately: false,
	    // 各个类型标题的颜色
	    headerColor: {
	        [NodeType.开始]: "#8cafff",
	        [NodeType.审核人]: "rgb(230, 162, 60)",
	        [NodeType.抄送人]: "rgb(72, 128, 255)",
	        [NodeType.办理人]: "",
	        // 条件分支 没有颜色 可以无视
	        [NodeType.条件分支]: "",
	        [NodeType.结束]: "#8cafff",
	    },
	    // 生成添加按钮 popover 的显示
	    addNodesOptions: [
	        {
	            type: NodeType.审核人,
	            label: "审批人",
	            icon: "./img/审批人.png",
	            class: "approver",
	        },
	        {
	            type: NodeType.抄送人,
	            label: "抄送人",
	            icon: "./img/抄送人.png",
	            class: "notifier",
	        },
	        // {
	        //     type: NodeType.办理人,
	        //     label: "办理人",
	        //     icon: "./img/办理人.png",
	        //     class: "notifier",
	        // },
	        {
	            type: NodeType.条件分支,
	            label: "条件分支",
	            icon: "./img/条件.png",
	            class: "condition",
	        }
	    ],
	    // 允许条件嵌套数量
	    conditionNestCount: 2,
	    levelOptions,
	    operatorList,
	    dataFields
	}

```
### 自定义节点

```javascript
// utils/type下添加js文件 创建对应文件后并指定名称 
import { NodeType } from "../config"
import { BaseType, getUUID } from "../factory"
import { carbonTextHandle, carbonValidate } from "../tools"

/**
 * @description: 开始类型
 * @param {*}
 * @return {*}
 */
export default class StartType extends BaseType {

	// 无需手动导入components到nodeWrap下与Editor下
    filename = "normal"  // 指定在 ./components/node下的文件名称 无需样式更改默认不改动
    form = "startForm"	 // 指定在 ./components/form下的文件名称 自定义表单
    type = NodeType.开始  // 指定类型

	// 返回结构
    getStruct(fatherID, childNode, level) {
        return {
            nodeName: "开始",
            error: true,
            type: this.type,
            nodeId: getUUID(),
            setting: {
                allowCommit: "All",  // All 全员 Assign 指定 None 均不可提交
                assignMode: 0,      // 0 指定部门 1 指定成员
                department: [],     // 指定部门
                member: [],         // 指定成员
                carbonCopySetting: [
                    // {
                    //     type: 1, // 直属上级
                    //     level: 1, // 如果为部门负责人 选择层级
                    //     member: [],
                    // },
                ],   // 抄送人配置
            },
            childNode,
            fatherID,
            level
        }
    }
    
    // 保存后的文字处理
    handleText(nodeConfig) {
        let text = []
        let nodeSetting = nodeConfig.setting
        switch (nodeSetting.allowCommit) {
            case "All":
                text.push("提交人：全员可提交")
                break;
            case "Assign":
                let value = nodeSetting.assignMode ? `提交人：${nodeSetting.member.map((x) => x.name).toString()}` : `提交部门：${nodeSetting.department.map((x) => x.thirdDepartment).toString()}`
                text.push(value)
                break
            case "None":
                return ["提交人：均不可提交"]
        }
        carbonTextHandle(nodeSetting.carbonCopySetting, text)
        return text.length > 0 && text || ["暂无配置"]
    }

    // 保存前的校验 会返回true false 外部赋值error
    beforeSave(nodeConfig) {
        let nodeSetting = nodeConfig.setting
        if (nodeSetting.allowCommit == "Assign") {
            let noSelect = nodeSetting.assignMode ? nodeSetting.member.length < 1 : nodeSetting.department.length < 1
            if (noSelect) {
                return false
            }
        }
        // 存在抄送人 但是没有选择成员的情况
        return carbonValidate(nodeSetting.carbonCopySetting)
    }

}
```

#### 注意事项
1.创建新的node节点与form的表单的vue文件 请手动混入对应文件夹下的mixin.js
2.form表单混入后提供字段 approverConfig 节点数据 setting 配置数据 可读写
3.node节点混入后提供nodeConfig 当前节点数据 可读写

### 提供获取数据方法
...编写中

### 效果图
![在这里插入图片描述](https://img-blog.csdnimg.cn/c86e02c38ead4acbaa53fa23eeaa8c36.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/1e37b6b0d676482f9c41ef77c2830601.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/861afa0ba10c4b1a807d961049ccf23d.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/a92eb1ca4ad145148d848509fea8a292.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/dfe6c07dde36445bb4a03847ece2cb73.png)
