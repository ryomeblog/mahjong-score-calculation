import { checkYakuman } from '../yakuman';

describe('鳴きOKの役満の判定', () => {
    describe('大三元', () => {
        test('大三元が成立するケース', () => {
            const handTiles = [
                // 三元牌の刻子
                { suit: 'z', number: 5, isKoutsu: true, isCalled: true }, // 白
                { suit: 'z', number: 6, isKoutsu: true, isCalled: true }, // 發
                { suit: 'z', number: 7, isKoutsu: true, isCalled: true }, // 中
                // その他の面子
                { suit: 'm', number: 1, isShuntsu: true },
                // 雀頭
                { suit: 'p', number: 1, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '大三元', han: 13 });
        });

        test('三元牌が揃っていない場合は不成立', () => {
            const handTiles = [
                // 二つの三元牌の刻子
                { suit: 'z', number: 5, isKoutsu: true, isCalled: true }, // 白
                { suit: 'z', number: 6, isKoutsu: true, isCalled: true }, // 發
                // その他の面子
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                // 雀頭
                { suit: 'z', number: 7, isJantou: true } // 中
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '大三元', han: 13 });
        });
    });

    describe('緑一色', () => {
        test('緑一色が成立するケース', () => {
            const handTiles = [
                // 索子2,3,4,6,8と發で構成
                { suit: 's', number: 2, isShuntsu: true, isCalled: true },
                { suit: 's', number: 3, isKoutsu: true, isCalled: true },
                { suit: 's', number: 6, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 6, isKoutsu: true, isCalled: true }, // 發
                { suit: 's', number: 8, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '緑一色', han: 13 });
        });

        test('緑以外の牌が含まれる場合は不成立', () => {
            const handTiles = [
                { suit: 's', number: 2, isShuntsu: true, isCalled: true },
                { suit: 's', number: 3, isKoutsu: true, isCalled: true },
                { suit: 's', number: 6, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 5, isKoutsu: true, isCalled: true }, // 白
                { suit: 's', number: 8, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '緑一色', han: 13 });
        });
    });

    describe('字一色', () => {
        test('字一色が成立するケース', () => {
            const handTiles = [
                { suit: 'z', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 2, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 5, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 6, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 7, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '字一色', han: 13 });
        });

        test('数牌が含まれる場合は不成立', () => {
            const handTiles = [
                { suit: 'z', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 2, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 5, isKoutsu: true, isCalled: true },
                { suit: 'm', number: 1, isKoutsu: true, isCalled: true }, // 数牌
                { suit: 'z', number: 7, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '字一色', han: 13 });
        });
    });

    describe('清老頭', () => {
        test('清老頭が成立するケース', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'm', number: 9, isKoutsu: true, isCalled: true },
                { suit: 'p', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'p', number: 9, isKoutsu: true, isCalled: true },
                { suit: 's', number: 1, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '清老頭', han: 13 });
        });

        test('老頭牌以外が含まれる場合は不成立', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'm', number: 9, isKoutsu: true, isCalled: true },
                { suit: 'p', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'p', number: 5, isKoutsu: true, isCalled: true }, // 中張牌
                { suit: 's', number: 1, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '清老頭', han: 13 });
        });
    });

    describe('四槓子', () => {
        test('四槓子が成立するケース', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKantsu: true, isCalled: true },
                { suit: 'p', number: 2, isKantsu: true, isCalled: true },
                { suit: 's', number: 3, isKantsu: true, isCalled: true },
                { suit: 'z', number: 1, isKantsu: true, isCalled: true },
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '四槓子', han: 13 });
        });

        test('槓子が4つない場合は不成立', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKantsu: true, isCalled: true },
                { suit: 'p', number: 2, isKantsu: true, isCalled: true },
                { suit: 's', number: 3, isKantsu: true, isCalled: true },
                { suit: 'z', number: 1, isKoutsu: true, isCalled: true }, // 刻子
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '四槓子', han: 13 });
        });
    });

    describe('小四喜', () => {
        test('小四喜が成立するケース', () => {
            const handTiles = [
                { suit: 'z', number: 1, isKoutsu: true, isCalled: true }, // 東
                { suit: 'z', number: 2, isKoutsu: true, isCalled: true }, // 南
                { suit: 'z', number: 3, isKoutsu: true, isCalled: true }, // 西
                { suit: 'm', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 4, isJantou: true }  // 北
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '小四喜', han: 13 });
        });

        test('風牌が3刻子1雀頭でない場合は不成立', () => {
            const handTiles = [
                { suit: 'z', number: 1, isKoutsu: true, isCalled: true }, // 東
                { suit: 'z', number: 2, isKoutsu: true, isCalled: true }, // 南
                { suit: 'z', number: 3, isKoutsu: true, isCalled: true }, // 西
                { suit: 'm', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'm', number: 2, isJantou: true }  // 風牌以外の雀頭
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '小四喜', han: 13 });
        });
    });

    describe('大四喜', () => {
        test('大四喜が成立するケース', () => {
            const handTiles = [
                { suit: 'z', number: 1, isKoutsu: true, isCalled: true }, // 東
                { suit: 'z', number: 2, isKoutsu: true, isCalled: true }, // 南
                { suit: 'z', number: 3, isKoutsu: true, isCalled: true }, // 西
                { suit: 'z', number: 4, isKoutsu: true, isCalled: true }, // 北
                { suit: 'm', number: 1, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '大四喜', han: 13 });
        });

        test('風牌が4刻子でない場合は不成立', () => {
            const handTiles = [
                { suit: 'z', number: 1, isKoutsu: true, isCalled: true }, // 東
                { suit: 'z', number: 2, isKoutsu: true, isCalled: true }, // 南
                { suit: 'z', number: 3, isKoutsu: true, isCalled: true }, // 西
                { suit: 'm', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'z', number: 4, isJantou: true }  // 北が雀頭
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '大四喜', han: 13 });
        });
    });

    describe('複数の役満が同時に成立するケース', () => {
        test('大四喜と字一色が同時に成立', () => {
            const handTiles = [
                { suit: 'z', number: 1, isKoutsu: true, isCalled: true }, // 東
                { suit: 'z', number: 2, isKoutsu: true, isCalled: true }, // 南
                { suit: 'z', number: 3, isKoutsu: true, isCalled: true }, // 西
                { suit: 'z', number: 4, isKoutsu: true, isCalled: true }, // 北
                { suit: 'z', number: 5, isJantou: true }  // 白
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '大四喜', han: 13 });
            expect(result).toContainEqual({ name: '字一色', han: 13 });
            expect(result.length).toBe(2);
        });
    });
});