<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 16:38:35
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-21 11:43:05
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
              <el-select
                v-model="condition.key"
                @change="changeKey(condition)"
              >
                <el-option
                  v-for="(value,key) in dataFields"
                  :key="key"
                  :label="value.name"
                  :value="key"
                />
              </el-select>
              <el-select v-model="condition.operator">
                <el-option
                  v-for="item in getCondition(condition)"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>

              <el-cascader
                v-model="condition.value"
                :options="getOptions(condition)"
                clearable
                collapse-tags
                class="w-100"
                :props="{ multiple: !getSingle(condition), emitPath:false}"
              />
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
  mixins: [mixin],
  computed: {
    dataFields() {
      return this.config.dataFields;
    },
  },
  methods: {
    pushCondition(index) {
      this.setting.conditionList[index].push({
        operator: "",
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
      this.setting.conditionList.push([{ operator: "", key: "", value: [] }]);
    },
    changeKey(condition) {
      condition.value = [];
      condition.operator = "";
    },
    getSingle(condition) {
      let item = this.dataFields[condition.key];
      return item && item.single;
    },
    getCondition(condition) {
      let item = this.dataFields[condition.key];
      return (item && item.conditions) || [];
    },
    getOptions(condition) {
      let item = this.dataFields[condition.key];
      return (item && item.values) || [];
    },
  },
};
</script>

<style lang="scss" scoped>
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
