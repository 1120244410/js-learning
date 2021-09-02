const equipment = getEquipment();

// 根据内容生成hashid
String.prototype.hashCode = function() {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
// 触发事件
function triggerHandle(type, info) {
  console.log("捕获异常", type, info);
  const content = JSON.stringify(info);
  const hashId = content.hashCode();
  report({ hashId, content, equipment });
}
// 上报
function report() {
  const img = new Image(1, 1);
  img.src = "上报地址";
}

function handleJSError() {
  // js同步运行时错误捕获
  window.onerror = function(message, source, lineno, colno, error) {
    triggerHandle("Runtime Error", { message, source, lineno, colno, error });
  };
}

function handlePromiseRejection() {
  // 全局promise rejection处理
  // 当Promise 被 reject 且没有 reject 处理器的时候，会触发
  window.addEventListener("unhandledrejection", ({ reason }) => {
    triggerHandle("Promise Error", { reason });
    event.preventDefault(); // 这一步我们阻止他的默认行为，比如取消控制台的错误输出
  });
}

function handleSourceError() {
  // 当资源加载失败或无法使用时，会在Window对象触发error事件。例如：script 执行时报错。
  window.addEventListener("error", event => {
    if (!event.message) {
      triggerHandle("Source Error", event);
    } // 如果有message，那么是其他错误
    event.preventDefault();
  });
}

function handleConsoleCollection() {
  // 一般来说console不太可能出现在生产环境，此方法用来监控非正常状态的console信息
  window.console.error = function(error) {
    const stack = arguments[0] && arguments[0].stack;
    if (!stack) {
      triggerHandle("Console:Error", error);
    } // 如果报错中包含错误堆栈，可以认为是JS报错
    event.preventDefault();
  };
}

// script error，script跨域
// 一般由后端配置Access-Control-Allow-Origin、前端script加crossorigin解决
// 我们可以封装一个方法来改写被使用的方法，通过try/catch后被window.onerror捕获，
function handleScriptError(fn) {
  if (!fn.__wrapped__) {
    fn.__wrapped__ = function() {
      try {
        return fn.apply(this, arguments);
      } catch (error) {
        throw error; // 这一步能被window.onerror捕获
      }
    };
  }
  return fn.__wrapped__;
}
window.$wrap = handleScriptError;

// 有时候我们也想知道用户的设备情况，以帮助推断错误发生的原因
function getEquipment() {
  const { timing, eventCounts, memory } = window.performance;
  const {
    navigationStart,
    domainLookupEnd,
    domainLookupStart,
    connectEnd,
    connectStart,
    responseStart,
    domContentLoadedEventEnd,
    loadEventEnd
  } = timing;
  const dnsTime = domainLookupEnd - domainLookupStart;
  const tcpTime = connectEnd - connectStart;
  const firstPaintTime = responseStart - navigationStart;
  const domRenderTime = domContentLoadedEventEnd - navigationStart;
  const loadTime = loadEventEnd - navigationStart;
  const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = memory;
  return {
    performance: `DNS解析时间：${dnsTime}\nTCP建立时间${tcpTime}\n首屏时间${firstPaintTime}\ndom渲染完成时间${domRenderTime}\n页面onload时间${loadTime}\n页面事件数量${eventCounts.length}`,
    memory: `js内存大小限制${jsHeapSizeLimit}\n页面js内存总大小${totalJSHeapSize}\n已占用大小${usedJSHeapSize}\n`
  };
}

function handleVueError() {
  if (window.Vue) {
    // vue的全局错误处理
    Vue.config.errorHandler = function(error, vm, info) {
      // error：Error对象
      // vm：vue本身
      // info：错误信息
      triggerHandle("Vue Error", { error, vm, info });
    };
  }
}

// 收集用户行为
// function handleUICollection() {
//   window.addEventListener("click", e => {
//     console.log(e);
//   });
// }

(function() {
  handleJSError();
  handlePromiseRejection();
  handleSourceError();
  handleConsoleCollection();
  handleUICollection();
  handleVueError();
})();
