const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  saveSession: (sessionData: any) => ipcRenderer.invoke('save-session', sessionData),
})

export {}
