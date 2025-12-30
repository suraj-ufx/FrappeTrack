const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const BUILD_DIR = path.join(__dirname, "../client/react/dist");

let win;
let server;
function createServer() {
  const serverApp = express();

  serverApp.use("/api", createProxyMiddleware({
    target: "http://192.168.0.138",
    changeOrigin: true,
    cookieDomainRewrite: "127.0.0.1", // rewrite domain so browser sends it
    onProxyRes(proxyRes, req, res) {
      const cookies = proxyRes.headers['set-cookie'];
      if (cookies) {
        cookies.forEach(cookie => {
          // rewrite path/domain if needed
          res.append('Set-Cookie', cookie);
        });
      }
    }
  }));


  // 2️⃣ Static files
  serverApp.use(express.static(BUILD_DIR));

  // 3️⃣ SPA fallback (LAST)
  serverApp.use((req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).end();
    }
    res.sendFile(path.join(BUILD_DIR, "index.html"));
  });

  const PORT = 3456;
  server = serverApp.listen(PORT, "127.0.0.1", () => {
    console.log(`✅ Server running at http://127.0.0.1:${PORT}`);
    createWindow(PORT);
  });
}

function createWindow(port) {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // ✅ MUST EXIST
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.on('did-finish-load', () => {
    console.log('✅ Window loaded');
    win.show();
  });

  win.webContents.on('did-fail-load', (_, code, desc, url) => {
    console.error('❌ Load failed:', { code, desc, url });
  });

  win.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer]: ${message}`);
  });

  win.loadURL(`http://127.0.0.1:${port}`);
}

app.whenReady().then(() => {
  createServer();
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createServer();
  }
});