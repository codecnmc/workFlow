/*
 * @Author: 羊驼
 * @Date: 2023-04-25 09:10:13
 * @LastEditors: 羊驼
 * @LastEditTime: 2024-05-22 11:04:49
 * @Description: file content
 */
import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import WorkFlow from "@/components/WorkFlow/index.js";
// import WorkFlow from "@/assets/index.js";
Vue.use(WorkFlow, {
  //创建完节点立即打开抽屉
  createPopupImmediately: true,
  // 配置可选下拉项 也可以通过this.$factory.resetDataFields(对象) 设置
  dataFields: {
    submitter: { name: "提交人", conditions: ["属于", "不属于"], values: [{ label: "123", value: "123" }], single: false },
    submitter2: {
      name: "提交人2",
      conditions: ["属于", "不属于"],
      values: [
        {
          label: "123",
          children: [
            { label: "456", value: "456" },
            { label: "789", value: "789" },
          ],
        },
      ],
      single: true,
    },
  },
});

Vue.use(ElementUI);
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
