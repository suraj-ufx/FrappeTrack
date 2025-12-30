const { contextBridge } = require('electron');

let sid = null;

contextBridge.exposeInMainWorld('auth', {
  setSid: (value) => {
    sid = value;
    console.log('[preload] sid set:', sid);
  },
  getSid: () => {
    console.log('[preload] sid get:', sid);
    return sid;
  }
});
