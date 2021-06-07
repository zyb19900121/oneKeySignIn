/*
 * @Author: zhangyanbin
 * @Date: 2021-06-03 17:55:32
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-07 17:17:49
 * @Description: file content
 */

import moment from "moment";

const global = {
  namespace: "global",

  state: {
    signList: [],
  },

  effects: {
    *getSignList({ payload }, { call, put }) {
      let signList = window.ipcRenderer.sendSync("getSignList");
      if (signList) {
        yield put({
          type: "save",
          payload: signList,
        });
      }
    },
    *createSignItem({ payload, callback }, { call, put, select }) {
      let oldSignList = yield select((state) => state.global.signList);
      let newSignList = [...oldSignList, payload];
      let isSuccess = window.ipcRenderer.sendSync("editSignList", newSignList);
      if (isSuccess == "success") {
        yield put({
          type: "save",
          payload: newSignList,
        });
      } else {
      }
      callback && callback(isSuccess);
    },
    *signItem({ payload, callback }, { call, put, select }) {
      let oldSignList = yield select((state) => state.global.signList);
      let oldSignItem = {
        ...oldSignList[payload],
        latestSignInTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      oldSignList.splice(payload, 1);
      oldSignList.unshift(oldSignItem);
      let newSignList = [...oldSignList];
      let isSuccess = window.ipcRenderer.sendSync("editSignList", newSignList);
      if (isSuccess == "success") {
        yield put({
          type: "save",
          payload: newSignList,
        });
      } else {
      }
      callback && callback(isSuccess);
    },
    *deleteSignItem({ payload, callback }, { call, put, select }) {
      let oldSignList = yield select((state) => state.global.signList);
      oldSignList.splice(payload, 1);

      let newSignList = [...oldSignList];

      let isSuccess = window.ipcRenderer.sendSync("editSignList", oldSignList);
      if (isSuccess == "success") {
        yield put({
          type: "save",
          payload: newSignList,
        });
      } else {
      }
      callback && callback(isSuccess);
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        signList: action.payload,
      };
    },
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     return history.listen(({ pathname }) => {
  //       if (pathname === '/') {
  //         dispatch({
  //           type: 'query',
  //         });
  //       }
  //     });
  //   },
  // },
};

export default global;
