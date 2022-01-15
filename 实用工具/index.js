import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
// import createCommon from "./common";

const router = useRouter();

const http = axios.create({
  timeout: 5000,
  baseURL: "此处是api域名"
});

http.interceptors.request.use(request => {
  const { method } = request;
  switch (method) {
    case "get":
    case "delete":
      if (!request.params) {
        request.params = request.data;
      }
      break;
    default:
      break;
  }
  const token = "";
  request.headers = {
    "content-Type": "application/json",
    Authorization: `token ${token}`,
    "x-request-id": uuidv4()
      .replace(/-/g, "")
      .slice(0, 16),
    "x-timestamp": Date.now()
  };

  return request;
});

http.interceptors.response.use(
  response => {
    const data = response.data;
    switch (data.code) {
      case 0:
      case 200:
        return response.data;
      case 401:
        router.push("/login");
        return Promise.reject(response.data);
      default:
        router.push("/login");
        ElMessage.error(data.message);
        return Promise.reject(response.data);
    }
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const api = {
  // common: createCommon(http),
};

export default api;
