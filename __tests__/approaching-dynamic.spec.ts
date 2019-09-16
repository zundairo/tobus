import { get } from '../src/approaching';

describe('Approaching (dynamic)', () => {
  it('should parse 六本木駅前 html with url', () => {
    return get({
      url:
        'https://tobus.jp/blsys/navim?LCD=&func=fap&bs=1036&VCD=SelectStopPole&ECD=resultapproach&RTMCD=6&pl=1'
    }).then(appr => {
      expect(appr.length).toBe(7);
      expect(appr[0].name).toBe('虎ノ門');
      expect(appr[1].name).toBe('霞が関三丁目');
      expect(appr[2].name).toBe('溜池');
      expect(appr[3].name).toBe('赤坂アークヒルズ前');
      expect(appr[4].name).toBe('六本木一丁目駅前');
      expect(appr[5].name).toBe('六本木四丁目');
      expect(appr[6].name).toBe('六本木駅前');
    });
  });

  it('should parse 六本木駅前 html with params', () => {
    return get({
      busStopId: 1036,
      poleId: 1,
      routeId: 6
    }).then(appr => {
      expect(appr.length).toBe(7);
      expect(appr[0].name).toBe('虎ノ門');
      expect(appr[1].name).toBe('霞が関三丁目');
      expect(appr[2].name).toBe('溜池');
      expect(appr[3].name).toBe('赤坂アークヒルズ前');
      expect(appr[4].name).toBe('六本木一丁目駅前');
      expect(appr[5].name).toBe('六本木四丁目');
      expect(appr[6].name).toBe('六本木駅前');
    });
  });

  it('should parse bus terminus', () => {
    return get({
      busStopId: 636,
      poleId: 6,
      routeId: 6
    }).then(appr => {
      expect(appr).toEqual([]);
    });
  });

  it('should error invalid server', () => {
    return expect(
      get({
        url: 'https://127.0.0.1'
      })
    ).rejects.toEqual(new Error('Error: connect ECONNREFUSED 127.0.0.1:443'));
  });
});
