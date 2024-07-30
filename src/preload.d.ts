// 在 preload.d.ts 文件中
import { type PreloadType } from './main/preload';

declare global {
  interface Window {
    electron: PreloadType;
  }
}