import { checkTwoHanYaku } from '../twoHan';

describe('Two Han Yaku Tests', () => {
    describe('Chitoitsu Tests', () => {
        test('correctly identifies chitoitsu', () => {
            const handTiles = [
                { suit: 'm', number: 1, isJantou: true },
                { suit: 'm', number: 3, isJantou: true },
                { suit: 'm', number: 5, isJantou: true },
                { suit: 'p', number: 2, isJantou: true },
                { suit: 'p', number: 4, isJantou: true },
                { suit: 's', number: 6, isJantou: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '七対子', han: 2 });
        });

        test('does not identify chitoitsu with calls', () => {
            const handTiles = [
                { suit: 'm', number: 1, isJantou: true, isCalled: true },
                { suit: 'm', number: 3, isJantou: true },
                { suit: 'm', number: 5, isJantou: true },
                { suit: 'p', number: 2, isJantou: true },
                { suit: 'p', number: 4, isJantou: true },
                { suit: 's', number: 6, isJantou: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).not.toContainEqual({ name: '七対子', han: 2 });
        });
    });

    describe('Toitoi Tests', () => {
        test('correctly identifies toitoi', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKoutsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isKoutsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '対々和', han: 2 });
        });
    });

    describe('Sanshoku Doujun Tests', () => {
        test('correctly identifies sanshoku doujun (menzen)', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 1, isShuntsu: true },
                { suit: 's', number: 1, isShuntsu: true },
                { suit: 'm', number: 4, isShuntsu: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '三色同順', han: 2 });
        });

        test('correctly identifies sanshoku doujun with calls (kuisagari)', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 1, isShuntsu: true, isCalled: true },
                { suit: 's', number: 1, isShuntsu: true },
                { suit: 'm', number: 4, isShuntsu: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '三色同順', han: 1 });
        });
    });

    describe('Sanshoku Doukou Tests', () => {
        test('correctly identifies sanshoku doukou', () => {
            const handTiles = [
                { suit: 'm', number: 5, isKoutsu: true },
                { suit: 'p', number: 5, isKoutsu: true },
                { suit: 's', number: 5, isKoutsu: true },
                { suit: 'm', number: 7, isShuntsu: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '三色同刻', han: 2 });
        });
    });

    describe('Ikkitsukan Tests', () => {
        test('correctly identifies ikkitsukan (menzen)', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'm', number: 4, isShuntsu: true },
                { suit: 'm', number: 7, isShuntsu: true },
                { suit: 'p', number: 3, isShuntsu: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '一気通貫', han: 2 });
        });

        test('correctly identifies ikkitsukan with calls (kuisagari)', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'm', number: 4, isShuntsu: true, isCalled: true },
                { suit: 'm', number: 7, isShuntsu: true },
                { suit: 'p', number: 3, isShuntsu: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '一気通貫', han: 1 });
        });
    });

    describe('Sanankou Tests', () => {
        test('correctly identifies sanankou', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKoutsu: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isKoutsu: true },
                { suit: 'm', number: 7, isShuntsu: true, isCalled: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '三暗刻', han: 2 });
        });

        test('does not identify sanankou with called koutsu', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKoutsu: true, isCalled: true },
                { suit: 'p', number: 2, isKoutsu: true },
                { suit: 's', number: 3, isKoutsu: true },
                { suit: 'm', number: 7, isShuntsu: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).not.toContainEqual({ name: '三暗刻', han: 2 });
        });
    });

    describe('Honroutou Tests', () => {
        test('correctly identifies honroutou', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKoutsu: true },
                { suit: 'p', number: 9, isKoutsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                { suit: 'z', number: 2, isKoutsu: true },
                { suit: 's', number: 9, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '混老頭', han: 2 });
        });
    });

    describe('Double Riichi Tests', () => {
        test('correctly identifies double riichi', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'm', number: 4, isShuntsu: true },
                { suit: 's', number: 3, isShuntsu: true },
                { suit: 'p', number: 5, isShuntsu: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles, { isDoubleRiichi: true });
            expect(result).toContainEqual({ name: 'ダブル立直', han: 2 });
        });

        test('does not identify double riichi with calls', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true, isCalled: true },
                { suit: 'm', number: 4, isShuntsu: true },
                { suit: 's', number: 3, isShuntsu: true },
                { suit: 'p', number: 5, isShuntsu: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles, { isDoubleRiichi: true });
            expect(result).not.toContainEqual({ name: 'ダブル立直', han: 2 });
        });
    });

    describe('Shousangen Tests', () => {
        test('correctly identifies shousangen', () => {
            const handTiles = [
                { suit: 'z', number: 5, isKoutsu: true },
                { suit: 'z', number: 6, isKoutsu: true },
                { suit: 'z', number: 7, isJantou: true },
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 2, isShuntsu: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '小三元', han: 2 });
        });
    });

    describe('Sankanzu Tests', () => {
        test('correctly identifies sankanzu', () => {
            const handTiles = [
                { suit: 'm', number: 1, isKoutsu: true, isKan: true },
                { suit: 'p', number: 2, isKoutsu: true, isKan: true },
                { suit: 's', number: 3, isKoutsu: true, isKan: true },
                { suit: 'm', number: 7, isShuntsu: true },
                { suit: 'z', number: 1, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '三槓子', han: 2 });
        });
    });

    describe('Chantaiyao Tests', () => {
        test('correctly identifies chantaiyao (menzen)', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 7, isShuntsu: true },
                { suit: 's', number: 1, isShuntsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '混全帯幺九', han: 2 });
        });

        test('correctly identifies chantaiyao with calls (kuisagari)', () => {
            const handTiles = [
                { suit: 'm', number: 1, isShuntsu: true },
                { suit: 'p', number: 7, isShuntsu: true, isCalled: true },
                { suit: 's', number: 1, isShuntsu: true },
                { suit: 'z', number: 1, isKoutsu: true },
                { suit: 'z', number: 2, isJantou: true }
            ];

            const result = checkTwoHanYaku(handTiles);
            expect(result).toContainEqual({ name: '混全帯幺九', han: 1 });
        });
    });
});