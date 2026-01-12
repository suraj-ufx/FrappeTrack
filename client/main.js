const { app, BrowserWindow, ipcMain, desktopCapturer, net, protocol, session } = require("electron");
const path = require("path");
const { pathToFileURL } = require('node:url'); // Correct way to import
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
const fs = require("fs");
const pkg = require('electron-store');
const { takeCoverage } = require("v8");

let mainWindow;
let ses;
const Store = pkg.default
const store = new Store()
// const ses = mainWindow.webContents.session

// protocol.registerSchemesAsPrivileged([
//   { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream:true } }
// ]);

// // function createWindow() {
// //   mainWindow = new BrowserWindow({
// //     width: 1200,             // mobile width
// //     height: 1100,            // mobile height
// //     minWidth: 320,           // optional min/max to prevent too small

// //     maxHeight: 1024,
// //     center: true,
// //     resizable: true,        // can be false if you want fixed size
// //     webPreferences: {
// //       preload: path.join(__dirname, "preload.js"),
// //       nodeIntegration: false,
// //       contextIsolation: true,
// //     },
// //   });
// //   ses = mainWindow.webContents.session; // Safe to access

// //   // Load the React build
// //   mainWindow.loadFile(
// //     path.join(__dirname, "../client/react/dist/index.html")
// //   );

// //   // Optional: open DevTools for debugging
// //   // mainWindow.webContents.openDevTools();
// // }
// // app.whenReady().then(createWindow);
// app.whenReady().then(() => {
//   protocol.handle('app', (request) => {
//     const pathname = new URL(request.url).pathname;
//     const filePath = path.join(__dirname, '/react/dist', pathname === '/' ? 'index.html' : pathname);
//     console.log('Serving:', filePath); // Debug path
//     return net.fetch(pathToFileURL(filePath).toString());
//   });

//    const win = new BrowserWindow({
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true
//     }
//   });
//   win.loadURL('app://index.html');
// });
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true
    }
  }
]);

app.whenReady().then(() => {
  const session = ses || session.defaultSession;

  session.protocol.handle('app', (request) => {
    const { pathname } = new URL(request.url);
    const filePath = path.join(__dirname, 'react', 'dist', pathname === '/' ? 'index.html' : pathname);
    return net.fetch(pathToFileURL(filePath).toString());
  });

  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadURL('app://index.html');
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ---------------- IPC for Screenshots ------------------
ipcMain.handle("capture-screen", async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1280, height: 720 },
    });

    const thumbnail = sources[0].thumbnail;
    const image = thumbnail.toPNG();

    // Current date & time
    const now = new Date();
    const dateFolder = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeString = now
      .toTimeString()
      .split(" ")[0]
      .replace(/:/g, "-"); // HH-MM-SS

    // Folder: screenshots/YYYY-MM-DD/
    const imgDir = path.join(__dirname, "screenshots", dateFolder);
    fs.mkdirSync(imgDir, { recursive: true });

    // File path: screenshots/YYYY-MM-DD/HH-MM-SS.png
    const filePath = path.join(imgDir, `${timeString}.png`);
    fs.writeFileSync(filePath, image);

    return {
      "thumbnail": thumbnail.toDataURL(),
      "screenshotTime": timeString
    }; // Send preview to renderer
  } catch (err) {
    console.error("Error capturing screen:", err);
    return null;
  }
});

ipcMain.handle("save-creds", async (event, apiKey, apiSecret) => {
  try {
    console.log("saving creds", apiKey, apiSecret)
    store.set("creds", { apiKey, apiSecret })
    return true
  } catch (error) {
    console.error("Error saving credentials:", error);
    return null;
  }
})

ipcMain.handle("get-creds", async (event, data) => {
  try {
    const creds = store.get("creds");
    console.log(creds);

    return creds
  } catch (error) {
    console.error("Error fetching credentials ipc:", error);
    return null;
  }
})

//save cookies
ipcMain.handle('save-cookies', async (event, data) => {
  console.log("runnign inside cookies")
  try {
    // const session = event.sender.getWebContents().session;
    console.log("save cookie data", data)
    const currentURL = event.sender.getURL();
    console.log("my current url", currentURL)
    await event.sender.session.cookies.set({
      url: 'app://app/index.html',
      name: "cookie",
      value: data,
      path: '/',
      secure: false,
      httpOnly: false,
    });
    console.log('Cookie set successfully');
  } catch (error) {
    console.error('Error while saving cookies:', error);
  }
  return null;
});

//delete screenshot
ipcMain.handle("delete-screenshot", async () => {
  try {
    // console.log("📥 IPC received: delete-screenshot");
    const screenshotDir = path.join(
      __dirname,
      "screenshots"
    );

    if (fs.existsSync(screenshotDir)) {
      fs.rmSync(screenshotDir, { recursive: true, force: true });
      console.log("Screenshot folder deleted");
    } else {
      console.log("Screenshot folder not found");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting screenshot folder:", error);
    return { success: false, error: error.message };
  }
});
