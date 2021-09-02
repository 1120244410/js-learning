// 用来做点击埋点
const bpCollect = function(event) {
  if (!event) return;
  nextNode(event.target);
};
function nextNode(node) {
  const { attributes } = node;
  if (attributes && attributes.hasOwnProperty("bp") && attributes.bp.value) {
    bp(attributes.bp.value);
  } else if (node.parentNode) {
    nextNode(node.parentNode);
  }
}
const bp = function(attr) {
  console.log("埋点", attr);
};
document.addEventListener("click", bpCollect);

if (Vue) {
  // 用来做pv、uv
  Vue.directive("bp", {
    // 绑定指令时 即dom生成
    bind: function(el, { value, arg }) {
      // 记一次pv
      if (!arg || arg === "pv") {
        bp(value);
      }
    },
    // 解绑指令 即dom移除
    unbind: function(el, { value, arg }) {
      // 记一次uv
      if (!arg || arg === "pl") {
        bp(value);
      }
    }
    // 以上命令涉及dom创建与移除，需要搭配v-if或其他适合的操作
  });
}
