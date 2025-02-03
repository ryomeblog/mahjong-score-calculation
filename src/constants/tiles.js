/**
 * 牌の種類の定義
 */
export const SUIT_TYPES = {
    MANZU: 'm',   // 萬子
    PINZU: 'p',   // 筒子
    SOUZU: 's',   // 索子
    JIHAI: 'z'    // 字牌
};

/**
 * 風牌の定義（字牌1-4）
 */
export const WINDS = {
    EAST: 1,    // 東
    SOUTH: 2,   // 南
    WEST: 3,    // 西
    NORTH: 4    // 北
};

/**
 * 三元牌の定義（字牌5-7）
 */
export const DRAGONS = {
    WHITE: 5,   // 白
    GREEN: 6,   // 發
    RED: 7      // 中
};

/**
 * 牌の最大数字
 */
export const MAX_NUMBERS = {
    [SUIT_TYPES.MANZU]: 9,
    [SUIT_TYPES.PINZU]: 9,
    [SUIT_TYPES.SOUZU]: 9,
    [SUIT_TYPES.JIHAI]: 7
};

/**
 * 手牌の制限
 */
export const HAND_LIMITS = {
    MAX_TILES: 14,          // 手牌の最大数（和了時）
    MAX_SAME_TILE: 4,      // 同じ牌の最大数
    MAX_DORA_INDICATORS: 5, // ドラ表示牌の最大数
    MAX_URADORA: 5         // 裏ドラの最大数
};

/**
 * 点数関連の定数
 */
export const SCORE_CONSTANTS = {
    BASE_POINTS: {
        MANGAN: 2000,    // 満貫の基本点
        HANEMAN: 3000,   // 跳満の基本点
        BAIMAN: 4000,    // 倍満の基本点
        SANBAIMAN: 6000, // 三倍満の基本点
        YAKUMAN: 8000    // 役満の基本点
    },
    MIN_FU: 20,        // 最小符数
    MAX_FU: 110        // 最大符数
};