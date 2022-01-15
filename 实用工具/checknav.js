export const checkNavagation = () => {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return "wx";
  }
  if (ua.match(/WeiBo/i) == "weibo") {
    return "wb";
  }
  if (ua.indexOf("mqqbrowser") > -1) {
    return "";
  }
  if (ua.match(/QQ/i) == "qq") {
    return "qq";
  }
  return "";
};
