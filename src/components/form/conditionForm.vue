<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 16:38:35
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-25 16:50:38
 * @Description: 条件表单
-->

<template>
  <div class="drawer-content drawer-content-condition">
    <!-- 默认条件 -->
    <div
      v-if="defaultApprovalDrawer"
      class="default-style"
    >其他情况</div>
    <div v-else>
      <div
        v-for="(item, index) in approverConfig.conditionList"
        :key="index"
      >
        <div class="condition-conent-group">
          <div class="condition-group-title flex">
            <div class="dang-style">条件组</div>
            <div>
              <i
                class="remove el-icon-delete"
                @click="removeCondition('group', index)"
              ></i>
            </div>
          </div>
          <div
            class="condition-group-select"
            v-for="(it, ind) in item.conditionChildrenNodes"
            :key="ind"
          >
            <div class="mg-bot-10">
              <div
                v-if="ind === 0"
                class="flex flex-style"
              >
                <span class="dang-style">当</span>
                <i
                  class="remove el-icon-delete"
                  @click=" removeCondition( 'oneCondition', index, ind ) "
                ></i>
              </div>
              <div
                v-else
                class="flex"
              >
                <el-select
                  style="width: 110px;"
                  v-model="it.conditionOperator"
                  placeholder="请选择"
                >
                  <el-option
                    label="且"
                    :value="'&&'"
                  ></el-option>
                  <el-option
                    label="或"
                    :value="'||'"
                  ></el-option>
                </el-select>
                <i
                  class="remove iconfont icon-icon_viewpicture_delete"
                  @click=" removeCondition( 'oneCondition', index, ind ) "
                ></i>
              </div>
            </div>
            <el-row
              :gutter="5"
              class="mg-bot-10"
            >
              <el-col :span="8">
                <el-select
                  v-model="it.leftFileds"
                  placeholder="请选择"
                  @change="dataFieldsChange(it)"
                >
                  <el-option
                    v-for="item in dataFields"
                    :label="item.name"
                    :value="item.key"
                    :key="item.key"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="it.centerFileds"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in operatorList"
                    :label="item"
                    :value="item"
                    :key="item"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-date-picker
                  v-model="it.rightFileds"
                  v-if="it.leftFiledsType === 'date'"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <el-input
                  v-else
                  v-model="it.rightFileds"
                  placeholder="请输入"
                ></el-input>
              </el-col>
            </el-row>
          </div>
          <div
            class="conditionbtn"
            @click="addConditionGroup('1', item)"
          >
            <el-button type="">
              <i class="el-button-suffix el-icon-plus"></i>添加条件
            </el-button>
          </div>
        </div>
        <div
          v-if=" index === 0 && approverConfig.conditionList.length > 1 "
          class="flex"
          style="height:54px;padding:0 24px"
        >
          <el-select
            style="width: 110px;margin-top:7px"
            v-model="item.conditionGroupOperator"
            placeholder="请选择"
          >
            <el-option
              label="且"
              :value="'&&'"
            ></el-option>
            <el-option
              label="或"
              :value="'||'"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="conditionbtn">
        <el-button
          type=""
          @click="addConditionGroup('0')"
        >
          <i class="el-button-suffix el-icon-plus"></i>添加条件组
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./mixin";
export default {
  props: ["defaultApprovalDrawer"],
  mixins: [mixin],
  data() {
    return {
      operatorList: ["=", "!=", ">", ">=", "<", "<="],
      dataFields: [
        { name: "日期", key: "date", type: "date" },
        { name: "地址", key: "adress" },
        { name: "状态", key: "state" },
      ],
    };
  },
  methods: {
    //添加条件组
    addConditionGroup(flag, item) {
      if (flag === "1") {
        item.conditionChildrenNodes.push({
          conditionOperator: "",
          leftFileds: "",
          centerFileds: "",
          rightFileds: "",
        });
        return;
      }
      this.approverConfig.conditionList.push({
        conditionChildrenNodes: [],
        conditionGroupOperator: "",
      });
    },
    //删除条件组和条件
    removeCondition(conditonflag, index, ind) {
      if (conditonflag === "group") {
        this.approverConfig.conditionList.splice(index, 1);
        return;
      }
      this.approverConfig.conditionList[index].conditionChildrenNodes.splice(
        ind,
        1
      );
    },
    //条件字段显示name
    dataFieldsChange(it) {
      this.dataFields.forEach((item) => {
        if (item.key === it.leftFileds) {
          this.$set(it, "leftFiledsName", item.name);
          this.$set(it, "leftFiledsType", item.type);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
