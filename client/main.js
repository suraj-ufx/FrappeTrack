const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");

const BUILD_DIR = path.join(__dirname, "../client/react/dist");

let win;
let server;

function createServer() {
  const serverApp = express();

  // 🔹 1️⃣ Serve React static files
// Serve static files first
serverApp.use(express.static(BUILD_DIR));


  // 🔹 3️⃣ Start server
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
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.on("did-finish-load", () => {
    console.log("✅ Window loaded");
    win.show();
  });

  win.webContents.on("did-fail-load", (_, code, desc, url) => {
    console.error("❌ Load failed:", { code, desc, url });
  });

  win.webContents.on("console-message", (_, level, message) => {
    console.log(`[Renderer]: ${message}`);
  });

  win.loadURL(`http://127.0.0.1:${port}`);
}

app.whenReady().then(createServer);

app.on("window-all-closed", () => {
  if (server) server.close();
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createServer();
});
