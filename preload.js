/*
 * @Author: zhangyanbin
 * @Date: 2021-06-03 10:45:57
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-03 17:28:05
 * @Description: file content
 */
const { contextBridge, ipcRenderer } = require('electron');

const apiKey = 'electron';

const api = {
  versions: process.versions,
};

contextBridge.exposeInMainWorld(apiKey, api);
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
// contextBridge.exposeInMainWorld('ipcRendererOn', ipcRenderer.on);

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, callback) => {
    // if (validChannels.includes(channel)) {
    // Filtering the event param from ipcRenderer
    const newCallback = (_, data) => callback(data);
    ipcRenderer.on(channel, newCallback);
    // }
  },
});
