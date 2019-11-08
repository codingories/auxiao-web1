import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
  token: getToken(),
  name: "",
  avatar: ""
};

const mutations = {
  SET_TOKEN: (state, token) => {
    console.log("----进入SET_TOKEN");
    state.token = token;
    // state.access_token = token;
  },
  SET_NAME: (state, name) => {
    console.log("进入SET_NAME");
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USER: (state, user) => {
    console.log("useruseruseruseruseruser");
    console.log(user);
    state.user1 = user;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password } = userInfo;
    console.log("-----------------");
    console.log("account, password");
    console.log(account, password);

    return new Promise((resolve, reject) => {
      login({ account: account.trim(), password: password })
        .then(response => {
          const { data } = response;
          console.log("reponse-data");
          console.log(typeof data);
          console.log(data);
          console.log("lllllllllll");
          console.log(data.access_token);
          // commit("SET_TOKEN", data.token);
          // setToken(data.token);
          commit("SET_TOKEN", data.access_token);
          commit("SET_USER", data.user);
          setToken(data.access_token);

          console.log("kkkkkkkkkkkk");
          resolve();

          commit("SET_NAME", "张三");
          commit(
            "SET_AVATAR",
            "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
          );
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    console.log("uuuuuuuuuuuuuuuuuu");
    console.log("进入user.js,actions,getInfo");

    // const users = {
    //   "admin-token": {
    //     roles: ["admin"],
    //     introduction: "I am a super administrator",
    //     avatar:
    //       "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    //     name: "Super Admin"
    //   },
    //   "editor-token": {
    //     roles: ["editor"],
    //     introduction: "I am an editor",
    //     avatar:
    //       "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    //     name: "Normal Editor"
    //   }
    // };
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;
          if (!data) {
            reject("Verification failed, please Login again.");
          }
          const { name, avatar } = data;
          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    // commit("SET_TOKEN", "");
    // removeToken();

    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          removeToken();
          resetRouter();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      removeToken();
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
