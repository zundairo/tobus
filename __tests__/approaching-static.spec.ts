import * as cheerio from 'cheerio';
import { CheerioStaticEx, FetchCallback } from 'cheerio-httpcli';
import * as fs from 'fs';
import { get } from '../src/approaching';

jest.mock('cheerio-httpcli', () => ({
  fetch: jest
    .fn()
    .mockImplementation(
      (
        url: string,
        param: {
          [name: string]: any;
        },
        encode: string,
        callback: FetchCallback
      ) => {
        const data = fs.readFileSync(url, 'utf8');
        const $ = cheerio.load(data, {
          decodeEntities: false
        }) as CheerioStaticEx;
        const body = $.html();
        callback(undefined as any, $, undefined as any, body);
      }
    )
}));

describe('Approaching (static)', () => {
  it('should parse 六本木駅前 html', () => {
    return get({ url: '__tests__/resources/1609-6-2.html' }).then(appr => {
      expect(appr).toStrictEqual([
        { name: '六本木駅前', bus: [] },
        { name: '六本木四丁目', bus: [5] },
        { name: '六本木一丁目駅前', bus: [] },
        { name: '３つ前の停留所', bus: [] },
        { name: '溜池', bus: [10] },
        { name: '霞が関三丁目', bus: [] },
        { name: '虎ノ門', bus: [] }
      ]);
    });
  });

  it('should parse 虎ノ門 html', () => {
    return get({ url: '__tests__/resources/1036-6-1.html' }).then(appr => {
      expect(appr).toStrictEqual([
        { name: '虎ノ門', bus: [] },
        { name: '霞が関三丁目', bus: [3] },
        { name: '溜池', bus: [] },
        { name: '赤坂アークヒルズ前', bus: [] },
        { name: '六本木一丁目駅前', bus: [] },
        { name: '六本木四丁目', bus: [] },
        { name: '六本木駅前', bus: [13] }
      ]);
    });
  });

  it('should parse 西麻布 html double', () => {
    return get({ url: '__tests__/resources/1130-6-3.html' }).then(appr => {
      expect(appr).toStrictEqual([
        { name: '西麻布', bus: [2] },
        { name: 'EXシアター六本木前', bus: [] },
        { name: '六本木駅前', bus: [6, 10] },
        { name: '六本木四丁目', bus: [] },
        { name: '六本木一丁目駅前', bus: [] },
        { name: '５つ前の停留所', bus: [14] },
        { name: '溜池', bus: [] }
      ]);
    });
  });

  it('should parse 西麻布 html soon', () => {
    return get({ url: '__tests__/resources/1130-6-3-soon.html' }).then(appr => {
      expect(appr).toStrictEqual([
        { name: '西麻布', bus: [0] },
        { name: 'EXシアター六本木前', bus: [] },
        { name: '六本木駅前', bus: [7] },
        { name: '六本木四丁目', bus: [10] },
        { name: '六本木一丁目駅前', bus: [] },
        { name: '５つ前の停留所', bus: [] },
        { name: '溜池', bus: [] }
      ]);
    });
  });

  it('should parse 青山学院中等部前 html', () => {
    return get({ url: '__tests__/resources/7-6-1.html' }).then(appr => {
      expect(appr).toStrictEqual([
        { name: '青山学院中等部前', bus: [3] },
        { name: '渋谷駅前', bus: [8] }
      ]);
    });
  });

  it('shoud parse not found html', () => {
    return expect(
      get({ url: '__tests__/resources/notfound.html' })
    ).rejects.toBe('Cannot found bus stop.');
  });
});
