<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 16:27:24
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-25 16:37:01
 * @Description: 抄送人表单
-->
<template>
  <div class="drawer-content">
    <el-tabs :is-hide-nav="true">
      <el-tab-pane label="抄送人类型">
        <div>
          <el-radio-group
            v-model="approverConfig.nodeUserType.type"
            @change="setTypeRadio"
          >
            <el-radio label="manager">连续多级部门主管</el-radio>
            <el-radio label="role">抄送角色</el-radio>
            <el-radio label="user">指定用户</el-radio>
          </el-radio-group>
          <div v-if=" approverConfig.nodeUserType.type !== 'manager' ">
            <el-form
              ref="form"
              label-width="90px"
              v-if="approverConfig.nodeUserType.type"
            >
              <el-form-item :label="setTypeLabel">
                <div v-if="approverConfig.nodeUserType.type === 'user'">
                  <el-select
                    v-model="approverConfig.nodeUserType.valueList"
                    filterable
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in useroptions"
                      :key="item.id"
                      :label="item.userName"
                      :value="item.id"
                    > </el-option>
                  </el-select>
                </div>
                <div v-if="approverConfig.nodeUserType.type === 'role'">
                  <el-select
                    v-model="approverConfig.nodeUserType.valueList"
                    filterable
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in useroptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    > </el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <p style="margin-bottom:16px;font-size:14px">
              按组织架构，发起人<span style="color:#4880FF;">向上的各级主管</span>依次抄送
            </p>
            <el-radio-group v-model=" approverConfig.nodeUserType.value ">
              <el-radio :label="`m-${directorLevel}`">
                <span style="margin-right:8px">直到发起人向上的</span>
                <el-select
                  style="width:140px"
                  v-model="directorLevel"
                  placeholder="请选择"
                  @change=" approverConfig.nodeUserType.value = `m-${directorLevel}` "
                >
                  <el-option
                    v-for="(item, index) in directorLevelList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-radio>
              <el-radio :label="directorLevel">
                <span style="margin-right:8px">直到</span>
                <el-select
                  style="width:140px"
                  v-model="directorLevel"
                  placeholder="请选择"
                  @change=" approverConfig.nodeUserType.value = directorLevel "
                >
                  <el-option
                    v-for="(item, index) in directorLevelList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
};
</script>

<style lang="less" scoped>
</style>