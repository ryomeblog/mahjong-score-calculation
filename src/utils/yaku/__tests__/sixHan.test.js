import { checkSixHanYaku } from '../sixHan';

describe('Six Han Yaku Tests', () => {
    describe('Chinitsu Tests', () => {
        test('correctly identifies chinitsu', () => {
            const handTiles = [
                // All tiles are manzu (characters)
                {
                    suit: 'm',
                    number: 1,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 1 },
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 }
                    ]
                },
                {
                    suit: 'm',
                    number: 4,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 4 },
                        { suit: 'm', number: 5 },
                        { suit: 'm', number: 6 }
                    ]
                },
                {
                    suit: 'm',
                    number: 7,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 7 },
                        { suit: 'm', number: 8 },
                        { suit: 'm', number: 9 }
                    ]
                },
                {
                    suit: 'm',
                    number: 9,
                    isKoutsu: true,
                    tiles: [
                        { suit: 'm', number: 9 },
                        { suit: 'm', number: 9 },
                        { suit: 'm', number: 9 }
                    ]
                },
                {
                    suit: 'm',
                    number: 1,
                    isJantou: true,
                    tiles: [
                        { suit: 'm', number: 1 },
                        { suit: 'm', number: 1 }
                    ]
                }
            ];

            const result = checkSixHanYaku(handTiles, {});
            expect(result).toContainEqual({ name: '清一色', han: 6 });
        });

        test('correctly identifies chinitsu with called tiles', () => {
            const handTiles = [
                {
                    suit: 'm',
                    number: 1,
                    isShuntsu: true,
                    isCalled: true,
                    tiles: [
                        { suit: 'm', number: 1 },
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 }
                    ]
                },
                {
                    suit: 'm',
                    number: 4,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 4 },
                        { suit: 'm', number: 5 },
                        { suit: 'm', number: 6 }
                    ]
                },
                {
                    suit: 'm',
                    number: 7,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 7 },
                        { suit: 'm', number: 8 },
                        { suit: 'm', number: 9 }
                    ]
                },
                {
                    suit: 'm',
                    number: 9,
                    isKoutsu: true,
                    tiles: [
                        { suit: 'm', number: 9 },
                        { suit: 'm', number: 9 },
                        { suit: 'm', number: 9 }
                    ]
                },
                {
                    suit: 'm',
                    number: 1,
                    isJantou: true,
                    tiles: [
                        { suit: 'm', number: 1 },
                        { suit: 'm', number: 1 }
                    ]
                }
            ];

            const result = checkSixHanYaku(handTiles, {});
            expect(result).toContainEqual({ name: '清一色', han: 5 });
        });

        test('does not identify chinitsu with honors', () => {
            const handTiles = [
                {
                    suit: 'm',
                    number: 1,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 1 },
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 }
                    ]
                },
                {
                    suit: 'm',
                    number: 4,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 4 },
                        { suit: 'm', number: 5 },
                        { suit: 'm', number: 6 }
                    ]
                },
                {
                    suit: 'm',
                    number: 7,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 7 },
                        { suit: 'm', number: 8 },
                        { suit: 'm', number: 9 }
                    ]
                },
                {
                    suit: 'm',
                    number: 9,
                    isKoutsu: true,
                    tiles: [
                        { suit: 'm', number: 9 },
                        { suit: 'm', number: 9 },
                        { suit: 'm', number: 9 }
                    ]
                },
                // Honor tile pair breaks chinitsu
                {
                    suit: 'z',
                    number: 1,
                    isJantou: true,
                    tiles: [
                        { suit: 'z', number: 1 },
                        { suit: 'z', number: 1 }
                    ]
                }
            ];

            const result = checkSixHanYaku(handTiles, {});
            expect(result).not.toContainEqual({ name: '清一色', han: 6 });
            expect(result).not.toContainEqual({ name: '清一色', han: 5 });
        });

        test('does not identify chinitsu with mixed suits', () => {
            const handTiles = [
                {
                    suit: 'm',
                    number: 1,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 1 },
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 }
                    ]
                },
                {
                    suit: 'm',
                    number: 4,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 4 },
                        { suit: 'm', number: 5 },
                        { suit: 'm', number: 6 }
                    ]
                },
                {
                    suit: 'm',
                    number: 7,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 7 },
                        { suit: 'm', number: 8 },
                        { suit: 'm', number: 9 }
                    ]
                },
                // Different suit breaks chinitsu
                {
                    suit: 'p',
                    number: 9,
                    isKoutsu: true,
                    tiles: [
                        { suit: 'p', number: 9 },
                        { suit: 'p', number: 9 },
                        { suit: 'p', number: 9 }
                    ]
                },
                {
                    suit: 'm',
                    number: 1,
                    isJantou: true,
                    tiles: [
                        { suit: 'm', number: 1 },
                        { suit: 'm', number: 1 }
                    ]
                }
            ];

            const result = checkSixHanYaku(handTiles, {});
            expect(result).not.toContainEqual({ name: '清一色', han: 6 });
            expect(result).not.toContainEqual({ name: '清一色', han: 5 });
        });
    });
});