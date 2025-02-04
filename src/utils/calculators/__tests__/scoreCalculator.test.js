import { calculateScore } from '../scoreCalculator';

describe('Score Calculator Tests', () => {
    describe('Yaku Calculation Tests', () => {
        test('correctly identifies riichi hand', () => {
            const handTiles = [
                // 3つの順子
                { suit: 'm', number: 1, isShuntsu: true, tiles: [{ suit: 'm', number: 1 }, { suit: 'm', number: 2 }, { suit: 'm', number: 3 }] },
                { suit: 'p', number: 4, isShuntsu: true, tiles: [{ suit: 'p', number: 4 }, { suit: 'p', number: 5 }, { suit: 'p', number: 6 }] },
                { suit: 's', number: 4, isShuntsu: true, tiles: [{ suit: 's', number: 4 }, { suit: 's', number: 5 }, { suit: 's', number: 6 }] },
                // 1つの刻子
                { suit: 'p', number: 7, isKoutsu: true, tiles: [{ suit: 'p', number: 7 }, { suit: 'p', number: 7 }, { suit: 'p', number: 7 }] },
                // 雀頭
                { suit: 'm', number: 5, isJantou: true, tiles: [{ suit: 'm', number: 5 }, { suit: 'm', number: 5 }] }
            ];

            const result = calculateScore({
                handTiles,
                isRiichi: true,
                isTsumo: false,
                seatWind: 1,
                roundWind: 1,
                doraTiles: [],
                uradoraTiles: [],
                winningTile: { suit: 'p', number: 7 } // 刻子での和了
            });

            expect(result.yakuList.find(yaku => yaku.name === '立直')).toBeTruthy();
            expect(result.han).toBe(1);
        });

        test('correctly calculates multiple yaku', () => {
            const handTiles = [
                // 二組の同じ順子（一盃口）
                {
                    suit: 'm', number: 2, isShuntsu: true, isRyanmen: true,
                    tiles: [{ suit: 'm', number: 2 }, { suit: 'm', number: 3 }, { suit: 'm', number: 4 }]
                },
                {
                    suit: 'm', number: 2, isShuntsu: true, isRyanmen: true,
                    tiles: [{ suit: 'm', number: 2 }, { suit: 'm', number: 3 }, { suit: 'm', number: 4 }]
                },
                // 他の二つの順子（両面待ちで平和）
                {
                    suit: 'p', number: 3, isShuntsu: true, isRyanmen: true,
                    tiles: [{ suit: 'p', number: 3 }, { suit: 'p', number: 4 }, { suit: 'p', number: 5 }]
                },
                {
                    suit: 's', number: 1, isShuntsu: true, isRyanmen: true,
                    tiles: [{ suit: 's', number: 1 }, { suit: 's', number: 2 }, { suit: 's', number: 3 }]
                },
                // 数牌の雀頭（役牌でない）
                {
                    suit: 'p', number: 6, isJantou: true,
                    tiles: [{ suit: 'p', number: 6 }, { suit: 'p', number: 6 }]
                }
            ];

            const result = calculateScore({
                handTiles,
                isRiichi: true,
                isTsumo: true,
                seatWind: 2,  // 自風は南
                roundWind: 1, // 場風は東
                doraTiles: [],
                uradoraTiles: [],
                winningTile: { suit: 's', number: 4 } // 両面待ちでの和了
            });

            // 立直(1翻) + 門前清自摸和(1翻) + 平和(1翻) + 一盃口(1翻) = 4翻
            expect(result.han).toBe(4);
            expect(result.yakuList.length).toBe(4);
            expect(result.yakuList.map(yaku => yaku.name)).toEqual(
                expect.arrayContaining([
                    '立直',
                    '門前清自摸和',
                    '平和',
                    '一盃口'
                ])
            );
        });

        // 特別上がりのテスト
        test('correctly identifies special yaku', () => {
            const handTiles = [
                // 適当な手牌（実際の役は関係ない）
                { suit: 'm', number: 1, isShuntsu: true, tiles: [{ suit: 'm', number: 1 }, { suit: 'm', number: 2 }, { suit: 'm', number: 3 }] },
                { suit: 'p', number: 4, isShuntsu: true, tiles: [{ suit: 'p', number: 4 }, { suit: 'p', number: 5 }, { suit: 'p', number: 6 }] },
                { suit: 's', number: 4, isShuntsu: true, tiles: [{ suit: 's', number: 4 }, { suit: 's', number: 5 }, { suit: 's', number: 6 }] },
                { suit: 'p', number: 7, isKoutsu: true, tiles: [{ suit: 'p', number: 7 }, { suit: 'p', number: 7 }, { suit: 'p', number: 7 }] },
                { suit: 'm', number: 5, isJantou: true, tiles: [{ suit: 'm', number: 5 }, { suit: 'm', number: 5 }] }
            ];

            // 一発のテスト
            let result = calculateScore({
                handTiles,
                isIppatsu: true,
                isTsumo: false,
                seatWind: 1,
                roundWind: 1,
                winningTile: { suit: 'p', number: 7 }
            });
            expect(result.yakuList.find(yaku => yaku.name === '一発')).toBeTruthy();

            // 槍槓のテスト
            result = calculateScore({
                handTiles,
                isChankan: true,
                isTsumo: false,
                seatWind: 1,
                roundWind: 1,
                winningTile: { suit: 'p', number: 7 }
            });
            expect(result.yakuList.find(yaku => yaku.name === '槍槓')).toBeTruthy();

            // 嶺上開花のテスト
            result = calculateScore({
                handTiles,
                isRinshan: true,
                isTsumo: true,
                seatWind: 1,
                roundWind: 1,
                winningTile: { suit: 'p', number: 7 }
            });
            expect(result.yakuList.find(yaku => yaku.name === '嶺上開花')).toBeTruthy();

            // 海底撈月のテスト
            result = calculateScore({
                handTiles,
                isHaitei: true,
                isTsumo: true,
                seatWind: 1,
                roundWind: 1,
                winningTile: { suit: 'p', number: 7 }
            });
            expect(result.yakuList.find(yaku => yaku.name === '海底撈月')).toBeTruthy();

            // 河底撈魚のテスト
            result = calculateScore({
                handTiles,
                isHoutei: true,
                isTsumo: false,
                seatWind: 1,
                roundWind: 1,
                winningTile: { suit: 'p', number: 7 }
            });
            expect(result.yakuList.find(yaku => yaku.name === '河底撈魚')).toBeTruthy();
        });

        // 役満のテスト
        test('correctly identifies yakuman', () => {
            const handTiles = [
                // 適当な手牌（天和・地和の場合、実際の手牌は関係ない）
                { suit: 'm', number: 1, isShuntsu: true, tiles: [{ suit: 'm', number: 1 }, { suit: 'm', number: 2 }, { suit: 'm', number: 3 }] },
                { suit: 'p', number: 4, isShuntsu: true, tiles: [{ suit: 'p', number: 4 }, { suit: 'p', number: 5 }, { suit: 'p', number: 6 }] },
                { suit: 's', number: 4, isShuntsu: true, tiles: [{ suit: 's', number: 4 }, { suit: 's', number: 5 }, { suit: 's', number: 6 }] },
                { suit: 'p', number: 7, isKoutsu: true, tiles: [{ suit: 'p', number: 7 }, { suit: 'p', number: 7 }, { suit: 'p', number: 7 }] },
                { suit: 'm', number: 5, isJantou: true, tiles: [{ suit: 'm', number: 5 }, { suit: 'm', number: 5 }] }
            ];

            // 天和のテスト
            let result = calculateScore({
                handTiles,
                isTenhou: true,
                isTsumo: true,
                seatWind: 1,  // 東家
                roundWind: 1,
                winningTile: { suit: 'p', number: 7 }
            });
            expect(result.yakuList.find(yaku => yaku.name === '天和')).toBeTruthy();
            expect(result.han).toBe(13);

            // 地和のテスト
            result = calculateScore({
                handTiles,
                isChihou: true,
                isTsumo: true,
                seatWind: 2,  // 南家以降
                roundWind: 1,
                winningTile: { suit: 'p', number: 7 }
            });
            expect(result.yakuList.find(yaku => yaku.name === '地和')).toBeTruthy();
            expect(result.han).toBe(13);
        });
    });
});