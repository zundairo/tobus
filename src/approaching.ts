import { fetch, FetchCallback } from 'cheerio-httpcli';
import { IApproachingBuses, IApproachingParameters } from './index';

/**
 * バス接近情報を取得します.
 *
 * @param {IApproachingParameters} params パラメータ
 * @returns {Promise<IApproachingBuses[]>} 接近情報
 */
export function get(
  params: IApproachingParameters
): Promise<IApproachingBuses[]> {
  if (params.url) {
    return new Promise<IApproachingBuses[]>((resolve, reject) => {
      fetch(
        params.url as string,
        {},
        'Shift-JIS',
        getCallback(reject, resolve)
      );
    });
  } else {
    return new Promise<IApproachingBuses[]>((resolve, reject) => {
      fetch(
        'https://tobus.jp/blsys/navim',
        {
          bs: params.busStopId,
          // tslint:disable-next-line: object-literal-sort-keys
          VCD: 'SelectStopPole',
          ECD: 'resultapproach',
          RTMCD: params.routeId,
          pl: params.poleId
        },
        'Shift-JIS',
        getCallback(reject, resolve)
      );
    });
  }
}

/**
 * ページ取得用コールバック関数
 * @param reject エラー時コールバック関数
 * @param resolve データ取得時コールバック関数
 * @returns {FetchCallback} コールバック関数
 */
function getCallback(
  reject: (reason?: any) => void,
  resolve: (
    value?: IApproachingBuses[] | PromiseLike<IApproachingBuses[]> | undefined
  ) => void
): FetchCallback {
  return (err, $, res, body) => {
    if (err) {
      return reject(err);
    }
    if (body && body.match(/指定の停留所が見つかりません。/)) {
      return reject('Cannot found bus stop.');
    }
    const locations = createInfo(findTable($));
    resolve(locations);
  };
}

/**
 * CheerioStaticから運行表のarrayを取得する.
 *
 * @param {CheerioStatic} $ 運行表のtable要素
 * @returns {string[]} 運行表のarray
 */
function findTable($: CheerioStatic): string[] {
  // ▲△↑が一番多い<table>を運行表と仮定する
  const tables = $('table');
  let maxrows = 0;
  let bodyTableIndex = 0;
  tables.each((index, element) => {
    let count = 0;
    $(element)
      .find('td')
      .map((idx, elem) => {
        count += $(elem)
          .text()
          .match(/^[▲△↑]/)
          ? 1
          : 0;
      });
    if (maxrows < count) {
      maxrows = count;
      bodyTableIndex = index;
    }
  });
  if (maxrows === 0) {
    return [];
  }
  const bodyTable = tables[bodyTableIndex];
  return $(bodyTable)
    .find('tr')
    .toArray()
    .map(val => $(val).text());
}

/**
 * 運行表のarrayから運行状況を生成する.
 *
 * @param {string[]} rawArr 加工前の運行表のデータ
 * @returns {IApproachingBuses[]} 運行状況
 */
function createInfo(rawArr: string[]): IApproachingBuses[] {
  const ret: IApproachingBuses[] = [];
  let index = 0;
  rawArr.forEach(value => {
    if (value.match(/^[▲△]/)) {
      ret.push({ name: value.replace(/^[▲△]/, ''), bus: [] });
      index++;
    } else if (!value.match(/^↑/)) {
      if (value.match(/^まもなく/)) {
        ret[index - 1].bus.push(0);
      } else {
        ret[index - 1].bus.push(parseInt(value, 10));
      }
    }
  });
  return ret;
}
