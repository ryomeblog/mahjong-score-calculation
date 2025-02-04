import { SUIT_TYPES } from '../../../constants/tiles';
import { analyzeMentsu, isJihai, isRoutouhai, isYakuhai, isYaochuhai } from '../helpers';

describe('Tile type checks', () => {
    test('isJihai correctly identifies honor tiles', () => {
        expect(isJihai({ suit: SUIT_TYPES.JIHAI, number: 1 })).toBe(true);
        expect(isJihai({ suit: 'm', number: 1 })).toBe(false);
    });

    test('isRoutouhai correctly identifies terminal tiles', () => {
        expect(isRoutouhai({ suit: 'm', number: 1 })).toBe(true);
        expect(isRoutouhai({ suit: 'm', number: 9 })).toBe(true);
        expect(isRoutouhai({ suit: 'm', number: 5 })).toBe(false);
        expect(isRoutouhai({ suit: SUIT_TYPES.JIHAI, number: 1 })).toBe(false);
    });

    test('isYaochuhai correctly identifies terminal and honor tiles', () => {
        expect(isYaochuhai({ suit: 'm', number: 1 })).toBe(true);
        expect(isYaochuhai({ suit: 'm', number: 9 })).toBe(true);
        expect(isYaochuhai({ suit: SUIT_TYPES.JIHAI, number: 1 })).toBe(true);
        expect(isYaochuhai({ suit: 'm', number: 5 })).toBe(false);
    });

    test('isYakuhai correctly identifies value honor tiles', () => {
        const seatWind = 1; // 東家
        const roundWind = 2; // 南場

        // 三元牌
        expect(isYakuhai({ suit: SUIT_TYPES.JIHAI, number: 5 }, seatWind, roundWind)).toBe(true);
        expect(isYakuhai({ suit: SUIT_TYPES.JIHAI, number: 6 }, seatWind, roundWind)).toBe(true);
        expect(isYakuhai({ suit: SUIT_TYPES.JIHAI, number: 7 }, seatWind, roundWind)).toBe(true);

        // 自風牌
        expect(isYakuhai({ suit: SUIT_TYPES.JIHAI, number: 1 }, seatWind, roundWind)).toBe(true);

        // 場風牌
        expect(isYakuhai({ suit: SUIT_TYPES.JIHAI, number: 2 }, seatWind, roundWind)).toBe(true);

        // 数牌は役牌にならない
        expect(isYakuhai({ suit: 'm', number: 1 }, seatWind, roundWind)).toBe(false);
    });
});

describe('analyzeMentsu', () => {
    test('correctly identifies shuntsu (sequential triplets)', () => {
        const tiles = [
            { suit: 'm', number: 1 },
            { suit: 'm', number: 2 },
            { suit: 'm', number: 3 },
            { suit: 'p', number: 4 },
            { suit: 'p', number: 5 },
            { suit: 'p', number: 6 },
        ];

        const analyzed = analyzeMentsu(tiles);
        const shuntsuList = analyzed.filter(tile => tile.isShuntsu);

        expect(shuntsuList.length).toBe(2);
        expect(shuntsuList[0].suit).toBe('m');
        expect(shuntsuList[1].suit).toBe('p');
    });

    test('correctly identifies koutsu (triplets)', () => {
        const tiles = [
            { suit: 'm', number: 1 },
            { suit: 'm', number: 1 },
            { suit: 'm', number: 1 },
        ];

        const analyzed = analyzeMentsu(tiles);
        const koutsuList = analyzed.filter(tile => tile.isKoutsu);

        expect(koutsuList.length).toBe(1);
        expect(koutsuList[0].suit).toBe('m');
        expect(koutsuList[0].number).toBe(1);
    });

    test('correctly identifies jantou (pairs)', () => {
        const tiles = [
            { suit: 'm', number: 1 },
            { suit: 'm', number: 1 },
        ];

        const analyzed = analyzeMentsu(tiles);
        const jantouList = analyzed.filter(tile => tile.isJantou);

        expect(jantouList.length).toBe(1);
        expect(jantouList[0].suit).toBe('m');
        expect(jantouList[0].number).toBe(1);
    });

    test('correctly identifies ryanmen (two-sided wait)', () => {
        const tiles = [
            { suit: 'm', number: 2 },
            { suit: 'm', number: 3 },
            { suit: 'm', number: 4 },
        ];

        const analyzed = analyzeMentsu(tiles);
        const ryanmenList = analyzed.filter(tile => tile.isRyanmen);

        expect(ryanmenList.length).toBe(1);
    });

    test('correctly analyzes a complete hand', () => {
        const completeHand = [
            // 順子
            { suit: 'm', number: 1 },
            { suit: 'm', number: 2 },
            { suit: 'm', number: 3 },
            // 刻子
            { suit: 'p', number: 5 },
            { suit: 'p', number: 5 },
            { suit: 'p', number: 5 },
            // 順子
            { suit: 's', number: 7 },
            { suit: 's', number: 8 },
            { suit: 's', number: 9 },
            // 順子
            { suit: 'm', number: 4 },
            { suit: 'm', number: 5 },
            { suit: 'm', number: 6 },
            // 雀頭
            { suit: SUIT_TYPES.JIHAI, number: 1 },
            { suit: SUIT_TYPES.JIHAI, number: 1 },
        ];

        const analyzed = analyzeMentsu(completeHand);

        expect(analyzed.filter(tile => tile.isShuntsu).length).toBe(3);
        expect(analyzed.filter(tile => tile.isKoutsu).length).toBe(1);
        expect(analyzed.filter(tile => tile.isJantou).length).toBe(1);
    });
});