export const checkPlatform = (function() {
  const u = navigator.userAgent;
  if (
    window.location.host !== "devukih5.neoclub.cn" &&
    window.location.host !== "ukih5.neoclub.cn" &&
    window.location.host !== "h5.hulaapp.cn"
  ) {
    return "web";
  }
  if (u.includes("Android") || u.includes("Adr")) {
    return "android";
  } else if (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(u)) {
    return "ios";
  }
  return "web";
})();
