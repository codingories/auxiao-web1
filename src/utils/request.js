import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { removeToken } from "@/utils/auth";

if (window.location.host === "mxjyey.auxiao.com") {
  axios.defaults.baseURL = "https://xjyey.auxiao.com";
} else {
  axios.defaults.baseURL = "http://47.100.124.12";
  // axios.defaults.baseURL = "http://47.94.237.80:805";
}

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       console.log("store.getters.token");
//       console.log(store.getters.token);
//       config.headers["access_token"] = getToken();
//     }
//     return config;
//   },
//   error => {
//     // do something with request error
//     console.log(error); // for debug
//     return Promise.reject(error);
//   }
// );

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */

  response => {
    const res = response.data;
    console.log("request.js中的,response.data;");
    console.log(res);
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      console.log("res.code");
      console.log("200");
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("进入request,错误");
    console.log("err" + error); // for debug
    Message({
      // message: error.message,
      message: "请重新登录",
      type: "error",
      duration: 5 * 1000
    });
    console.log("history1");
    // console.log(window.location.origin + "/#/login?redirect=%2FpersonalCenter");
    let temp = window.location.origin + "/#/login";
    console.log(temp);
    removeToken("access_token");
    window.location.replace(temp);
    console.log("history2");

    // return Promise.reject(error);
  }
);

export default service;