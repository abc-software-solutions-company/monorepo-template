import { ipcMain, IpcMainInvokeEvent } from 'electron';

ipcMain.handle('node-version', (_event: IpcMainInvokeEvent, _msg: string): string => {
  return process.versions.node;
});
