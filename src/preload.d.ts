// 在 preload.d.ts 文件中
import { type PreloadType } from './main/preload';

declare global {
  interface Window {
    electron: PreloadType;
  }
}

export type getTypeOfPreload<T = keyof PreloadType> = Parameters<PreloadType[T]>[0];

export type ChannelReturnType = ChannelType<'on'>;