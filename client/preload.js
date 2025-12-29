const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setLogin: (loginResponse) => ipcRenderer.invoke("login", loginResponse),
  onAuthSuccess: (callback) => ipcRenderer.on("auth-success", callback),
});
