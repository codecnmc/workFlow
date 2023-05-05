<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 16:38:35
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 16:54:41
 * @Description: 条件表单
-->

<template>
  <el-form
    class="form"
    label-position="top"
  >
    <!-- 默认条件 -->
    <div v-if="defaultApprovalDrawer">其他情况</div>
    <div v-else>
      <div
        v-for="(conditionGroup,index) in setting.conditionList"
        :key="index"
      >
        <p v-if="!index">满足以下条件时进入当前分支</p>
        <p v-else>或满足</p>
        <el-descriptions
          :column="1"
          border
          direction="vertical"
          class="mb-20"
        >
          <el-descriptions-item label="条件组">
            <template slot="label">
              <div class="flex">
                <span>
                  条件组</span>
                <el-button
                  type="text"
                  :disabled="!index"
                  icon="el-icon-delete"
                  @click="removeGroup(index)"
                ></el-button>
              </div>
            </template>
            <div
              class="column"
              v-for="(condition,index2) in conditionGroup"
              :key="index2*1000"
            >
              <div class="flex">
                <span>{{index2==0?"当":"且"}}</span>
                <el-button
                  type="text"
                  v-if="conditionGroup.length>1"
                  icon="el-icon-delete"
                  @click="removeCondition(index,index2)"
                ></el-button>
              </div>
              <el-select v-model="condition.key">
                <el-option
                  v-for="item in dataFields"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                />
              </el-select>
              <el-select v-model="condition.operator">
                <el-option
                  v-for="item in operatorList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <el-select
                v-model="condition.value"
                multiple
                filterable
                placeholder="请选择指定成员"
                value-key="user_id"
              >
                <el-option
                  v-for="item in memberOptions"
                  :key="item.user_id"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </div>
            <el-button
              icon="el-icon-plus"
              type="text"
              @click="pushCondition(index)"
            >添加条件</el-button>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-button
        icon="el-icon-plus"
        class="w-100"
        size="small"
        @click="addGroup"
      >添加条件组</el-button>
    </div>
  </el-form>
</template>

<script>
import mixin from "./mixin";
export default {
  props: ["defaultApprovalDrawer"],
  inject: ["operatorList", "dataFields"],
  mixins: [mixin],
  methods: {
    pushCondition(index) {
      this.setting.conditionList[index].push({
        operator: this.operatorList[0],
        key: "",
        value: [],
      });
    },
    removeCondition(index, index2) {
      this.setting.conditionList[index].splice(index2, 1);
    },
    removeGroup(index) {
      this.setting.conditionList.splice(index, 1);
    },
    addGroup() {
      this.setting.conditionList.push([
        { operator: this.operatorList[0], key: "", value: [] },
      ]);
    },
  },
};
</script>

<style lang="less" scoped>
.column {
  display: grid;
  grid-template-rows: 1;
  row-gap: 10px;
  margin-bottom: 10px;
}
.flex {
  display: flex;
  align-items: center;
  height: 30px;
  justify-content: space-between;
}
</style>
