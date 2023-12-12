const { app, Tray, Menu, nativeImage, clipboard } = require("electron");
const AutoLaunch = require("auto-launch");
const settings = require("electron-settings");
const path = require("path");

let tray = null;
const autoLauncher = new AutoLaunch({ name: "UTC Clock" });

async function createTray() {
  const iconPath = path.join(__dirname, "icons", "transparent.png"); // Update this line with the new clock icon path
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);

  const isAutoLaunchEnabled = await autoLauncher.isEnabled();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Copy UTC date",
      click: () => {
        const currentUtcDate = getCurrentUtcDate();
        clipboard.writeText(currentUtcDate);
      },
    },
    {
      label: "Copy UTC time",
      click: () => {
        const currentUtcTime = getCurrentUtcTime();
        clipboard.writeText(currentUtcTime);
      },
    },
    {
      label: "Copy nearest minute",
      click: () => {
        const nearestMinute = getRoundedUtcTime("minute");
        clipboard.writeText(nearestMinute);
      },
    },
    {
      label: "Copy nearest hour",
      click: () => {
        const nearestHour = getRoundedUtcTime("hour");
        clipboard.writeText(nearestHour);
      },
    },
    {
      type: "separator",
    },
    {
      label: "Start on Login",
      type: "checkbox",
      checked: isAutoLaunchEnabled,
      click: async (menuItem) => {
        if (menuItem.checked) {
          await autoLauncher.enable();
        } else {
          await autoLauncher.disable();
        }
      },
    },
    {
      type: "separator",
    },
    { label: "Exit", click: () => app.quit() },
  ]);
  tray.setToolTip("UTC Clock");
  tray.setContextMenu(contextMenu);
  updateTrayTitle();
  setInterval(updateTrayTitle, 1000);
}

function getCurrentUtcDate() {
  const now = new Date();
  return now.toISOString().substring(0, 10);
}

function getCurrentUtcTime() {
  const now = new Date();
  return now.toISOString().substring(0, 19) + "Z";
}

function getRoundedUtcTime(roundTo) {
  const now = new Date();
  if (roundTo === "minute") {
    now.setSeconds(0);
  } else if (roundTo === "hour") {
    now.setMinutes(0);
    now.setSeconds(0);
  }
  return now.toISOString().substring(0, 19) + "Z";
}

function updateTrayTitle() {
  const title = getCurrentUtcTime();
  tray.setTitle(title, {
    fontType: "monospaced"
  });
}

if (process.platform === "darwin" && app.dock) {
  app.dock.hide();
}

app.whenReady().then(createTray);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {});

