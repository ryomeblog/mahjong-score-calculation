import { checkThreeHanYaku } from '../threeHan';

describe('Three Han Yaku Tests', () => {
    describe('Ryanpeikou Tests', () => {
        test('correctly identifies ryanpeikou (two pairs of identical sequences)', () => {
            const handTiles = [
                // First pair of identical sequences (2,3,4 of manzu)
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 },
                        { suit: 'm', number: 4 }
                    ]
                },
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 },
                        { suit: 'm', number: 4 }
                    ]
                },
                // Second pair of identical sequences (6,7,8 of pinzu)
                {
                    suit: 'p',
                    number: 6,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'p', number: 6 },
                        { suit: 'p', number: 7 },
                        { suit: 'p', number: 8 }
                    ]
                },
                {
                    suit: 'p',
                    number: 6,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'p', number: 6 },
                        { suit: 'p', number: 7 },
                        { suit: 'p', number: 8 }
                    ]
                },
                // Pair
                {
                    suit: 's',
                    number: 5,
                    isJantou: true,
                    tiles: [
                        { suit: 's', number: 5 },
                        { suit: 's', number: 5 }
                    ]
                }
            ];

            const result = checkThreeHanYaku(handTiles, {});
            expect(result).toContainEqual({ name: '二盃口', han: 3 });
        });

        test('does not identify ryanpeikou with called tiles', () => {
            const handTiles = [
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    isCalled: true,
                    tiles: [
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 },
                        { suit: 'm', number: 4 }
                    ]
                },
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 },
                        { suit: 'm', number: 4 }
                    ]
                },
                {
                    suit: 'p',
                    number: 6,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'p', number: 6 },
                        { suit: 'p', number: 7 },
                        { suit: 'p', number: 8 }
                    ]
                },
                {
                    suit: 'p',
                    number: 6,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'p', number: 6 },
                        { suit: 'p', number: 7 },
                        { suit: 'p', number: 8 }
                    ]
                },
                {
                    suit: 's',
                    number: 5,
                    isJantou: true,
                    tiles: [
                        { suit: 's', number: 5 },
                        { suit: 's', number: 5 }
                    ]
                }
            ];

            const result = checkThreeHanYaku(handTiles, {});
            expect(result).not.toContainEqual({ name: '二盃口', han: 3 });
        });
    });

    describe('Junchan Tests', () => {
        test('correctly identifies junchan', () => {
            const handTiles = [
                // 1,2,3 sequence
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
                // 7,8,9 sequence
                {
                    suit: 'p',
                    number: 7,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'p', number: 7 },
                        { suit: 'p', number: 8 },
                        { suit: 'p', number: 9 }
                    ]
                },
                // 1,2,3 sequence
                {
                    suit: 's',
                    number: 1,
                    isShuntsu: true,
                    tiles: [
                        { suit: 's', number: 1 },
                        { suit: 's', number: 2 },
                        { suit: 's', number: 3 }
                    ]
                },
                // Triple 9s
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
                // Pair of 1s
                {
                    suit: 'p',
                    number: 1,
                    isJantou: true,
                    tiles: [
                        { suit: 'p', number: 1 },
                        { suit: 'p', number: 1 }
                    ]
                }
            ];

            const result = checkThreeHanYaku(handTiles, {});
            expect(result).toContainEqual({ name: '純全帯公九', han: 3 });
        });

        test('correctly identifies junchan with called tiles', () => {
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
                    suit: 'p',
                    number: 7,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'p', number: 7 },
                        { suit: 'p', number: 8 },
                        { suit: 'p', number: 9 }
                    ]
                },
                {
                    suit: 's',
                    number: 1,
                    isShuntsu: true,
                    tiles: [
                        { suit: 's', number: 1 },
                        { suit: 's', number: 2 },
                        { suit: 's', number: 3 }
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
                    suit: 'p',
                    number: 1,
                    isJantou: true,
                    tiles: [
                        { suit: 'p', number: 1 },
                        { suit: 'p', number: 1 }
                    ]
                }
            ];

            const result = checkThreeHanYaku(handTiles, {});
            expect(result).toContainEqual({ name: '純全帯公九', han: 2 });
        });
    });

    describe('Honiso Tests', () => {
        test('correctly identifies honiso', () => {
            const handTiles = [
                // Sequences in one suit
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    tiles: [
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 },
                        { suit: 'm', number: 4 }
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
                // Honor tiles
                {
                    suit: 'z',
                    number: 1,
                    isKoutsu: true,
                    tiles: [
                        { suit: 'z', number: 1 },
                        { suit: 'z', number: 1 },
                        { suit: 'z', number: 1 }
                    ]
                },
                {
                    suit: 'z',
                    number: 5,
                    isKoutsu: true,
                    tiles: [
                        { suit: 'z', number: 5 },
                        { suit: 'z', number: 5 },
                        { suit: 'z', number: 5 }
                    ]
                },
                {
                    suit: 'z',
                    number: 7,
                    isJantou: true,
                    tiles: [
                        { suit: 'z', number: 7 },
                        { suit: 'z', number: 7 }
                    ]
                }
            ];

            const result = checkThreeHanYaku(handTiles, {});
            expect(result).toContainEqual({ name: '混一色', han: 3 });
        });

        test('correctly identifies honiso with called tiles', () => {
            const handTiles = [
                {
                    suit: 'm',
                    number: 2,
                    isShuntsu: true,
                    isCalled: true,
                    tiles: [
                        { suit: 'm', number: 2 },
                        { suit: 'm', number: 3 },
                        { suit: 'm', number: 4 }
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
                    suit: 'z',
                    number: 1,
                    isKoutsu: true,
                    tiles: [
                        { suit: 'z', number: 1 },
                        { suit: 'z', number: 1 },
                        { suit: 'z', number: 1 }
                    ]
                },
                {
                    suit: 'z',
                    number: 5,
                    isKoutsu: true,
                    tiles: [
                        { suit: 'z', number: 5 },
                        { suit: 'z', number: 5 },
                        { suit: 'z', number: 5 }
                    ]
                },
                {
                    suit: 'z',
                    number: 7,
                    isJantou: true,
                    tiles: [
                        { suit: 'z', number: 7 },
                        { suit: 'z', number: 7 }
                    ]
                }
            ];

            const result = checkThreeHanYaku(handTiles, {});
            expect(result).toContainEqual({ name: '混一色', han: 2 });
        });
    });
});