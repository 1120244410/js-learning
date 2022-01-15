import bridgeActions from "./appEvent";

const init = function() {
  // 用来做点击埋点
  const bpCollect = function(event) {
    if (!event) return;
    nextNode(event.target);
  };
  function nextNode(node) {
    const { attributes } = node;
    if (
      attributes &&
      Object.prototype.hasOwnProperty.call(attributes, "bp") &&
      attributes.bp.value
    ) {
      bp(attributes.bp.value);
    } else if (node.parentNode) {
      nextNode(node.parentNode);
    }
  }
  const bp = function(attr) {
    if (typeof attr === "string") {
      attr = JSON.parse(attr);
    }
    bridgeActions.sendAppNewMaidian(attr);
  };
  document.addEventListener("click", bpCollect);
  if (window.Vue) {
    // 用来做pv、uv
    window.Vue.directive("bp", {
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
};

export default init;
