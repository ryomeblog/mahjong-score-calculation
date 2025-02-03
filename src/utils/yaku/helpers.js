import { SUIT_TYPES } from '../../constants/tiles';

/**
 * 特定の牌の枚数を数える
 * @param {Array} tiles - 手牌
 * @param {Object} condition - 条件（suit, number）
 * @returns {number} 枚数
 */
export const countTiles = (tiles, { suit, number }) => {
    return tiles.filter(tile =>
        tile.suit === suit && tile.number === number
    ).length;
};

/**
 * 門前かどうかを判定する
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 門前の場合true
 */
export const isMenzen = (handTiles) => {
    return handTiles.every(tile => !tile.isCalled);
};

/**
 * 字牌かどうかを判定する
 * @param {Object} tile - 牌
 * @returns {boolean} 字牌の場合true
 */
export const isJihai = (tile) => {
    return tile.suit === SUIT_TYPES.JIHAI;
};

/**
 * 老頭牌かどうかを判定する
 * @param {Object} tile - 牌
 * @returns {boolean} 老頭牌の場合true
 */
export const isRoutouhai = (tile) => {
    return tile.suit !== SUIT_TYPES.JIHAI && (tile.number === 1 || tile.number === 9);
};

/**
 * 幺九牌かどうかを判定する
 * @param {Object} tile - 牌
 * @returns {boolean} 幺九牌の場合true
 */
export const isYaochuhai = (tile) => {
    return isJihai(tile) || isRoutouhai(tile);
};

/**
 * 役牌かどうかを判定する
 * @param {Object} tile - 牌
 * @param {number} seatWind - 自風
 * @param {number} roundWind - 場風
 * @returns {boolean} 役牌の場合true
 */
export const isYakuhai = (tile, seatWind, roundWind) => {
    if (!isJihai(tile)) return false;
    // 三元牌（白、發、中）
    if (tile.number >= 5) return true;
    // 自風牌
    if (tile.number === seatWind) return true;
    // 場風牌
    if (tile.number === roundWind) return true;
    return false;
};