// const { app, BrowserWindow, ipcMain, protocol } = require("electron");
// const path = require("path");

// const API_BASE = "http://192.168.0.138";

// let win;

// app.commandLine.appendSwitch("disable-site-isolation-trials");

// // Register custom protocol for loading React build
// app.whenReady().then(() => {
//   protocol.registerFileProtocol("app", (request, callback) => {
//     const url = request.url.replace("app://", "");
//     callback({ path: path.join(__dirname, "../client/react/dist", url) });
//   });
// });

// // Create the main BrowserWindow
// function createWindow() {
//   win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//       contextIsolation: true,
//       nodeIntegration: false,
//       session: require("electron").session.fromPartition("persist:frappe"), // persistent session
//     },
//   });

//   // Load React build
//   win.loadFile(path.join(__dirname, "../client/react/dist/index.html"));

//   win.once("ready-to-show", () => win.show());
// }

// // Handle login from renderer
// ipcMain.handle("login", async (event, loginResponse) => {
//   try {
//     // Manually set sid in Electron session
//     await win.webContents.session.cookies.set({
//       url: API_BASE,
//       name: "sid",
//       value: loginResponse.sid,
//       path: "/",
//     });

//     const cookies = await win.webContents.session.cookies.get({ url: API_BASE });
//     console.log("Session cookies after login:", cookies);

//     // Notify renderer of success
//     win.webContents.send("auth-success", loginResponse.user);
//     return { success: true };
//   } catch (err) {
//     console.error("Failed to set sid cookie:", err);
//     return { success: false, error: err.message };
//   }
// });

// // Ready
// app.whenReady().then(createWindow);


const { app, BrowserWindow, ipcMain, protocol } = require("electron");
const path = require("path");

const API_BASE = "http://192.168.0.138";
let win;

// Register custom protocol for React build
app.whenReady().then(() => {
  protocol.registerFileProtocol("app", (request, callback) => {
    const url = request.url.replace("app://", "");
    callback({ path: path.join(__dirname, "../client/react/dist", url) });
  });
});

// Create main BrowserWindow
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      partition: "persist:frappe", // 🔥 THIS IS THE KEY
    },
  });

  win.loadFile("../client/react/dist/index.html");
  // win.loadFile(path.join(__dirname, "../client/react/dist/index.html"));
  win.once("ready-to-show", () => win.show());
}

// Handle login from renderer
ipcMain.handle("login", async (event, loginResponse) => {
  try {
    // Manually set sid cookie (if using Option A)
    await win.webContents.session.cookies.set({
      url: API_BASE,
      name: "sid",
      value: loginResponse.sid,
      path: "/",
      secure: true,       // must be true if SameSite=None
      httpOnly: false,
      sameSite: "no_restriction" // Electron equivalent of Nonep

    });

    // Flush storage to ensure cookies are fully written
    await win.webContents.session.flushStorageData();

    // Log current cookies
    const cookies = await win.webContents.session.cookies.get({ url: API_BASE });
    console.log("Session cookies after login:", cookies);

    // Notify renderer of success
    win.webContents.send("auth-success", loginResponse.user);
    return { success: true };
  } catch (err) {
    console.error("Failed to set sid cookie or flush storage:", err);
    return { success: false, error: err.message };
  }
});

app.whenReady().then(createWindow);
