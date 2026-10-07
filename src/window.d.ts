export {};
import type { WindowControls } from './shared/window.interface';

declare global {
  interface Window {
    windowControls: WindowControls;
  }
}
