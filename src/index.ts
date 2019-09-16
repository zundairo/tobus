import { get } from './approaching';

/**
 * 接近情報取得パラメータ
 */
export interface IApproachingParameters {
  url?: string;
  busStopId?: number;
  routeId?: number;
  poleId?: number;
}

/**
 * バス接近情報
 */
export interface IApproachingBuses {
  name: string;
  bus: number[];
}

export const approaching = get;
