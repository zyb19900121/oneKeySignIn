/*
 * @Author: zhangyanbin
 * @Date: 2021-06-03 10:45:57
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-08 11:23:47
 * @Description: file content
 */
// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, net } = require("electron");
const FormData = require("form-data");
const path = require("path");
const url = require("url");
const fs = require("fs");
const Store = require("electron-store");

// // Enable live reload for Electron too
// require("electron-reload")(__dirname, {
//   // Note that the path to electron may vary according to the main file
//   electron: require(`${__dirname}/node_modules/electron`),
// });

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 450,
    height: 600,
    minWidth: 450,
    minHeight: 600,
    maxWidth: 450,
    maxHeight: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html');
  // mainWindow.loadURL("http://localhost:8000/");

  console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:8000/");
    if (process.env.DEV_TOOLS) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "/dist/renderer/index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  handleGetSignList();
  handleEditSignList();
  handleSign();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。

const handleSign = () => {
  ipcMain.on("sign", (event, item) => {
    var form = new FormData({ maxDataSize: 20971520 });
    form.append("formhash", "b2713001");
    form.append("qdxq", "kx");
    const request = net.request({
      method: item.requestType,
      url: item.url,
      headers: form.getHeaders(),
    });
    request.setHeader("Cookie", item.cookie);
    request.writable = true;
    form.pipe(request);
    // 回调
    request.on("response", (response) => {
      response.on("data", (chunk) => {
        //返回的数据 conversionString(chunk))
        let resMsg = conversionString(chunk);
        if (resMsg.includes("签到成功")) {
          event.returnValue = "success";
        } else {
          event.returnValue = "fail";
        }
      });
      response.on("end", () => {});
    });
    request.end();
    // event.returnValue = "success";
  });
};

const handleGetSignList = () => {
  ipcMain.on("getSignList", (event, item) => {
    const store = new Store();
    let signList = store.get("signList");
    event.returnValue = signList;
  });
};

const handleEditSignList = () => {
  ipcMain.on("editSignList", (event, item) => {
    //

    // event.sender.send('asynchronous-reply', "写入失败");
    // prints "ping"
    // event.reply('asynchronous-reply', 'pong');

    const APP = process.type === "renderer" ? remote.app : app;
    // 获取electron应用的用户目录
    const STORE_PATH = APP.getPath("userData");

    const schema = {
      signList: {
        type: "array",
        default: [],
      },
    };
    const store = new Store(schema);
    try {
      store.set("signList", item);
      event.returnValue = "success";
    } catch (error) {
      event.returnValue = "fail";
    }
  });
};

const conversionString = (data) => {
  // 此处加window是因为我的electron项目前端用的是react全家桶 需要webpack打包
  // 不加window. 编译不过...
  let iconvLite = require("iconv-lite");

  return iconvLite.decode(data, "gbk");
};
