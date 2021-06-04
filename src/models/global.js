/*
 * @Author: zhangyanbin
 * @Date: 2021-06-03 17:55:32
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-04 15:34:52
 * @Description: file content
 */

// export interface IndexModelState {
//   name: string;
// }

// export interface IndexModelType {
//   namespace: 'index';
//   state: IndexModelState;
//   effects: {
//     query: Effect,
//   };
//   reducers: {
//     save: Reducer<IndexModelState>,
//     // 启用 immer 之后
//     // save: ImmerReducer<IndexModelState>;
//   };
//   subscriptions: { setup: Subscription };
// }

// const IndexModel: IndexModelType = {
const global = {
  namespace: 'global',

  state: {
    signList: [],
  },

  effects: {
    *getSignList({ payload }, { call, put }) {
      let signList = window.ipcRenderer.sendSync('getSignList');
      yield put({
        type: 'save',
        payload: signList,
      });
    },
    *createSignItem({ payload, callback }, { call, put, select }) {
      let oldSignList = yield select((state) => state.global.signList);
      let newSignList = [...oldSignList, payload];
      let isSuccess = window.ipcRenderer.sendSync('editSignList', newSignList);
      if (isSuccess == 'success') {
        yield put({
          type: 'save',
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

      let isSuccess = window.ipcRenderer.sendSync('editSignList', oldSignList);
      if (isSuccess == 'success') {
        yield put({
          type: 'save',
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
