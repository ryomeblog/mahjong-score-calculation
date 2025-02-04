import { checkYakuman } from '../yakuman';

describe('門前限定役満の判定', () => {
    describe('四暗刻', () => {
        test('四暗刻が成立するケース', () => {
            const handTiles = [
                // 四つの暗刻
                { suit: 'm', number: 1, isKoutsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isKoutsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                // 雀頭
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '四暗刻', han: 13 });
        });

        test('鳴きがある場合は不成立', () => {
            const handTiles = [
                // 三つの暗刻と一つの明刻
                { suit: 'm', number: 1, isKoutsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isKoutsu: true },
                { suit: 'z', number: 1, isKoutsu: true, isCalled: true },
                // 雀頭
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '四暗刻', han: 13 });
        });
    });

    describe('国士無双', () => {
        test('国士無双が成立するケース', () => {
            const handTiles = [
                { suit: 'm', number: 1 },
                { suit: 'm', number: 9 },
                { suit: 'p', number: 1 },
                { suit: 'p', number: 9 },
                { suit: 's', number: 1 },
                { suit: 's', number: 9 },
                { suit: 'z', number: 1 },
                { suit: 'z', number: 2 },
                { suit: 'z', number: 3 },
                { suit: 'z', number: 4 },
                { suit: 'z', number: 5 },
                { suit: 'z', number: 6 },
                { suit: 'z', number: 7 }
            ];

            const result = checkYakuman(handTiles, { isKokushi: true });
            expect(result).toContainEqual({ name: '国士無双', han: 13 });
        });

        test('通常の手牌では不成立', () => {
            const handTiles = [
                // 一般的な手牌
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isShuntsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, { isKokushi: false });
            expect(result).not.toContainEqual({ name: '国士無双', han: 13 });
        });
    });

    describe('九蓮宝燈', () => {
        test('萬子での九蓮宝燈が成立するケース', () => {
            const handTiles = [
                // 1,1,1,2,3,4,5,6,7,8,9,9,9 + 1
                { suit: 'm', number: 1, isKoutsu: true },
                { suit: 'm', number: 2 },
                { suit: 'm', number: 3 },
                { suit: 'm', number: 4 },
                { suit: 'm', number: 5 },
                { suit: 'm', number: 6 },
                { suit: 'm', number: 7 },
                { suit: 'm', number: 8 },
                { suit: 'm', number: 9, isKoutsu: true },
                { suit: 'm', number: 1 }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).toContainEqual({ name: '九蓮宝燈', han: 13 });
        });

        test('鳴きがある場合は不成立', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'm', number: 2 },
                { suit: 'm', number: 3 },
                { suit: 'm', number: 4 },
                { suit: 'm', number: 5 },
                { suit: 'm', number: 6 },
                { suit: 'm', number: 7 },
                { suit: 'm', number: 8 },
                { suit: 'm', number: 9, isKoutsu: true },
                { suit: 'm', number: 1 }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '九蓮宝燈', han: 13 });
        });

        test('異なる種類の牌が混ざっている場合は不成立', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKoutsu: true },
                { suit: 'm', number: 2 },
                { suit: 'm', number: 3 },
                { suit: 'm', number: 4 },
                { suit: 'p', number: 5 }, // 筒子が混ざっている
                { suit: 'm', number: 6 },
                { suit: 'm', number: 7 },
                { suit: 'm', number: 8 },
                { suit: 'm', number: 9, isKoutsu: true },
                { suit: 'm', number: 1 }
            ];

            const result = checkYakuman(handTiles, {});
            expect(result).not.toContainEqual({ name: '九蓮宝燈', han: 13 });
        });
    });

    describe('地和', () => {
        test('地和が成立するケース', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isShuntsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, { isChihou: true });
            expect(result).toContainEqual({ name: '地和', han: 13 });
        });

        test('条件が満たされない場合は不成立', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isShuntsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, { isChihou: false });
            expect(result).not.toContainEqual({ name: '地和', han: 13 });
        });
    });

    describe('天和', () => {
        test('天和が成立するケース', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isShuntsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, { isTenhou: true });
            expect(result).toContainEqual({ name: '天和', han: 13 });
        });

        test('条件が満たされない場合は不成立', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isShuntsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, { isTenhou: false });
            expect(result).not.toContainEqual({ name: '天和', han: 13 });
        });
    });

    describe('複数の役満が同時に成立するケース', () => {
        test('四暗刻と天和が同時に成立', () => {
            const handTiles = [
                // 四つの暗刻
                { suit: 'm', number: 1, isKoutsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isKoutsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                // 雀頭
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkYakuman(handTiles, { isTenhou: true });
            expect(result).toContainEqual({ name: '四暗刻', han: 13 });
            expect(result).toContainEqual({ name: '天和', han: 13 });
            expect(result.length).toBe(2);
        });
    });
});