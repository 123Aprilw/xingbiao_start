// 基础配置
window.receiveTokenFromApp = (token) => {
  console.log("✅ 成功拿到 token：", token);
  localStorage.setItem("token", token);
};

const config = {
  baseUrl: "https://xingbiao.demo.zhongti-group.com",
  timeout: 10000,
  header: {
    "Content-Type": "application/json",
  },
};

// 请求拦截统一处理
function beforeRequest(options) {
  // 可统一追加token
  options.header = options.header || {};
  options.header.token = "e3395711-cbfa-4ce2-a1de-b6e89e9420c1";
  return options;
}

// 响应拦截统一处理
function afterResponse(res) {
  // 适配接口返回格式
  if (res.msg === "获取成功" || res.code === 200 || res.code === 1) {
    return res.data;
  }
  throw new Error(res.msg || "请求失败");
}

// 超时终止请求
function createAbortCtrl() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeout);
  return { controller, timer };
}

// 通用GET
export function get(url, params = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const opt = beforeRequest({ url, params });
      const search = new URLSearchParams(opt.params).toString();
      const fullUrl = search
        ? `${config.baseUrl}${url}?${search}`
        : config.baseUrl + url;
      const { controller, timer } = createAbortCtrl();

      const res = await fetch(fullUrl, {
        method: "GET",
        headers: config.header,
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      resolve(afterResponse(data));
    } catch (err) {
      reject(err);
    }
  });
}

// 通用POST
export function post(url, data = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const opt = beforeRequest({ url, data });
      const { controller, timer } = createAbortCtrl();

      const res = await fetch(config.baseUrl + url, {
        method: "POST",
        headers: config.header,
        body: JSON.stringify(opt.data),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const result = await res.json();
      resolve(afterResponse(result));
    } catch (err) {
      reject(err);
    }
  });
}
