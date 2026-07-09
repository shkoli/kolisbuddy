import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'

const isDev = !app.isPackaged
const sessionsFile = path.join(app.getPath('userData'), 'sessions.json')

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../index.html'))
  }
}

ipcMain.handle('save-session', (_event, sessionData) => {
  let sessions = []
  if (fs.existsSync(sessionsFile)) {
    try {
      sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'))
    } catch {
      sessions = []
    }
  }
  sessions.push(sessionData)
  fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2))
  return sessions
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
