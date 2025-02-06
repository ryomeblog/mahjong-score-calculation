import { SUIT_TYPES } from '../../constants/tiles';
import { isMenzen } from './helpers';

// 手牌からすべての構成牌を取得
const getAllTiles = (handTiles) => {
    const allTiles = [];

    handTiles.forEach(tile => {
        if (tile.isShuntsu) {
            allTiles.push(
                { suit: tile.suit, number: tile.number },
                { suit: tile.suit, number: tile.number + 1 },
                { suit: tile.suit, number: tile.number + 2 }
            );
        } else if (tile.isKoutsu) {
            for (let i = 0; i < 3; i++) {
                allTiles.push({ suit: tile.suit, number: tile.number });
            }
        } else if (tile.isJantou) {
            for (let i = 0; i < 2; i++) {
                allTiles.push({ suit: tile.suit, number: tile.number });
            }
        } else {
            allTiles.push(tile);
        }
    });

    return allTiles;
};

/**
 * 清一色判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 清一色の場合true
 */
const isChinitsu = (handTiles) => {
    // すべての牌を取得
    const allTiles = getAllTiles(handTiles);

    // 字牌が含まれていないことを確認
    const hasHonors = allTiles.some(tile => tile.suit === SUIT_TYPES.JIHAI);
    if (hasHonors) return false;

    // すべての牌の種類を確認
    const suits = new Set(allTiles.map(tile => tile.suit));

    // 1種類の数牌のみであることを確認
    return suits.size === 1;
};

/**
 * 6翻役の判定
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const checkSixHanYaku = (handTiles, _conditions) => {
    const yakuList = [];

    // 清一色（喰い下り有り）
    if (isChinitsu(handTiles)) {
        yakuList.push({
            name: '清一色',
            han: isMenzen(handTiles) ? 6 : 5
        });
    }

    return yakuList;
};