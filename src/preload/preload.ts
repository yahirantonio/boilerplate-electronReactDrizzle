// oxlint-disable eslint-plugin-unicorn/no-empty-file
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from 'electron';
import { windowControls } from './window-controls';

contextBridge.exposeInMainWorld('windowControls', windowControls);
