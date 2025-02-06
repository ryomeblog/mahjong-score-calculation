import { checkOneHanYaku } from '../oneHan';

describe('One Han Yaku Tests', () => {
    describe('Pinfu Tests', () => {
        test('correctly identifies pinfu with ryanmen wait', () => {
            const handTiles = [
                // 2,3,4マンズ
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 5,6,7マンズ
                {
                    suit: 'm',
                    number: 5,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 3,4,5ピンズ
                {
                    suit: 'p',
                    number: 3,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 6,7,8ソーズ
                {
                    suit: 's',
                    number: 6,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 2,2ピンズ（雀頭）
                {
                    suit: 'p',
                    number: 2,
                    isJantou: true
                }
            ];

            const conditions = {
                winningTile: { suit: 'm', number: 1 }, // 両面待ちで和了
                seatWind: 1,
                roundWind: 1
            };

            const result = checkOneHanYaku(handTiles, conditions);
            expect(result).toContainEqual({ name: '平和', han: 1 });
        });

        test('does not identify pinfu with jantou wait', () => {
            const handTiles = [
                // 2,3,4マンズ
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 5,6,7マンズ
                {
                    suit: 'm',
                    number: 5,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 3,4,5ピンズ
                {
                    suit: 'p',
                    number: 3,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 6,7,8ソーズ
                {
                    suit: 's',
                    number: 6,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 2,2ピンズ（雀頭）
                {
                    suit: 'p',
                    number: 2,
                    isJantou: true
                }
            ];

            const conditions = {
                winningTile: { suit: 'p', number: 2 }, // 頭待ちで和了
                isTsumo: false,
                seatWind: 1,
                roundWind: 1
            };

            const result = checkOneHanYaku(handTiles, conditions);
            expect(result).not.toContainEqual({ name: '平和', han: 1 });
        });

        test('identifies pinfu with jantou wait when tsumo', () => {
            const handTiles = [
                // 2,3,4マンズ
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 5,6,7マンズ
                {
                    suit: 'm',
                    number: 5,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 3,4,5ピンズ
                {
                    suit: 'p',
                    number: 3,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 6,7,8ソーズ
                {
                    suit: 's',
                    number: 6,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 2,2ピンズ（雀頭）
                {
                    suit: 'p',
                    number: 2,
                    isJantou: true
                }
            ];

            const conditions = {
                winningTile: { suit: 'p', number: 2 }, // 頭待ちで和了
                isTsumo: true, // ツモ和了
                seatWind: 1,
                roundWind: 1
            };

            const result = checkOneHanYaku(handTiles, conditions);
            expect(result).toContainEqual({ name: '平和', han: 1 });
            expect(result).toContainEqual({ name: '門前清自摸和', han: 1 });
        });

        test('does not identify pinfu with yakuhai jantou', () => {
            const handTiles = [
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    isRyanmen: true
                },
                {
                    suit: 'm',
                    number: 5,
                    isShuntsu: true,
                    isRyanmen: true
                },
                {
                    suit: 'p',
                    number: 3,
                    isShuntsu: true,
                    isRyanmen: true
                },
                {
                    suit: 's',
                    number: 6,
                    isShuntsu: true,
                    isRyanmen: true
                },
                // 東の雀頭（場風）
                {
                    suit: 'z',
                    number: 1,
                    isJantou: true
                }
            ];

            const conditions = {
                winningTile: { suit: 'm', number: 1 },
                roundWind: 1, // 東場
                seatWind: 2
            };

            const result = checkOneHanYaku(handTiles, conditions);
            expect(result).not.toContainEqual({ name: '平和', han: 1 });
        });
    });
});