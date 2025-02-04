import { SUIT_TYPES } from '../../constants/tiles';
import { isMenzen } from './helpers';

// 暗刻の数を数える
const countAnkou = (handTiles) => {
    return handTiles.filter(tile => tile.isKoutsu && !tile.isCalled).length;
};

// 槓子の数を数える
const countKantsu = (handTiles) => {
    return handTiles.filter(tile => tile.isKantsu).length;
};

// 刻子の数を数える（暗刻+明刻）
const countKoutsu = (handTiles) => {
    return handTiles.filter(tile => tile.isKoutsu).length;
};

// 風牌の刻子の数を数える
const countWindKoutsu = (handTiles) => {
    return handTiles.filter(tile =>
        tile.isKoutsu && tile.suit === SUIT_TYPES.JIHAI && tile.number <= 4
    ).length;
};

// 三元牌の刻子の数を数える
const countDragonKoutsu = (handTiles) => {
    return handTiles.filter(tile =>
        tile.isKoutsu && tile.suit === SUIT_TYPES.JIHAI && tile.number >= 5
    ).length;
};

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

// 緑一色の牌かどうか判定
const isGreenTile = (tile) => {
    if (tile.suit === SUIT_TYPES.JIHAI) {
        return tile.number === 6; // 發
    }
    if (tile.suit === SUIT_TYPES.SOUZU) {
        return [2, 3, 4, 6, 8].includes(tile.number);
    }
    return false;
};

// 老頭牌かどうか判定
const isTerminal = (tile) => {
    return tile.suit !== SUIT_TYPES.JIHAI && (tile.number === 1 || tile.number === 9);
};

/**
 * 四暗刻判定（門前限定）
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 四暗刻の場合true
 */
const isSuuankou = (handTiles) => {
    // 門前で4つの暗刻が必要
    return isMenzen(handTiles) && countAnkou(handTiles) === 4;
};

/**
 * 国士無双判定（門前限定）
 * @param {Object} conditions - 和了条件
 * @returns {boolean} 国士無双の場合true
 */
const isKokushi = (conditions) => {
    // conditions.isKokushiがtrueの場合のみ国士無双として判定
    return conditions.isKokushi;
};

/**
 * 九蓮宝燈判定（門前限定）
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 九蓮宝燈の場合true
 */
const isChuuren = (handTiles) => {
    if (!isMenzen(handTiles)) return false;

    // すべての牌を取得
    const allTiles = getAllTiles(handTiles);

    // スートを確認（すべて同じスートである必要がある）
    const suit = allTiles[0].suit;
    if (suit === SUIT_TYPES.JIHAI) return false;
    if (!allTiles.every(tile => tile.suit === suit)) return false;

    // 1,9が3枚ずつ、2-8が1枚ずつ必要
    const counts = new Array(10).fill(0);
    allTiles.forEach(tile => counts[tile.number]++);

    return counts[1] >= 3 && counts[9] >= 3 &&
        counts.slice(2, 9).every(count => count >= 1);
};

/**
 * 大三元判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 大三元の場合true
 */
const isDaisangen = (handTiles) => {
    // 三元牌の刻子が3つ必要
    return countDragonKoutsu(handTiles) === 3;
};

/**
 * 緑一色判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 緑一色の場合true
 */
const isRyuuiisou = (handTiles) => {
    // すべての牌が緑の牌である必要がある
    const allTiles = getAllTiles(handTiles);
    return allTiles.every(isGreenTile);
};

/**
 * 字一色判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 字一色の場合true
 */
const isTsuuiisou = (handTiles) => {
    // すべての牌が字牌である必要がある
    const allTiles = getAllTiles(handTiles);
    return allTiles.every(tile => tile.suit === SUIT_TYPES.JIHAI);
};

/**
 * 清老頭判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 清老頭の場合true
 */
const isChinroutou = (handTiles) => {
    // すべての牌が老頭牌である必要がある
    const allTiles = getAllTiles(handTiles);
    return allTiles.every(isTerminal);
};

/**
 * 四槓子判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 四槓子の場合true
 */
const isSuukantsu = (handTiles) => {
    // 4つの槓子が必要
    return countKantsu(handTiles) === 4;
};

/**
 * 小四喜判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 小四喜の場合true
 */
const isShousuushii = (handTiles) => {
    // 風牌の刻子が3つと、風牌の雀頭が必要
    const windKoutsuCount = countWindKoutsu(handTiles);
    const hasWindJantou = handTiles.some(tile =>
        tile.isJantou && tile.suit === SUIT_TYPES.JIHAI && tile.number <= 4
    );
    return windKoutsuCount === 3 && hasWindJantou;
};

/**
 * 大四喜判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 大四喜の場合true
 */
const isDaisuushii = (handTiles) => {
    // 風牌の刻子が4つ必要
    return countWindKoutsu(handTiles) === 4;
};

/**
 * 役満の判定
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役満のリスト
 */
export const checkYakuman = (handTiles, conditions) => {
    const yakumanList = [];

    // 門前限定役満
    if (isMenzen(handTiles)) {
        // 四暗刻
        if (isSuuankou(handTiles)) {
            yakumanList.push({ name: '四暗刻', han: 13 });
        }
        // 九蓮宝燈
        if (isChuuren(handTiles)) {
            yakumanList.push({ name: '九蓮宝燈', han: 13 });
        }
    }

    // 国士無双（条件で判定）
    if (isKokushi(conditions)) {
        yakumanList.push({ name: '国士無双', han: 13 });
        return yakumanList; // 国士無双は他の役満と複合しない
    }

    // 天和・地和
    if (conditions.isTenhou) {
        yakumanList.push({ name: '天和', han: 13 });
    }
    if (conditions.isChihou) {
        yakumanList.push({ name: '地和', han: 13 });
    }

    // 鳴きOKの役満（優先順位の高い順に判定）
    const hasDaisuushi = isDaisuushii(handTiles);
    const hasTsuuiisou = isTsuuiisou(handTiles);

    // 1. 大四喜（他の役満と組み合わせ可能）
    if (hasDaisuushi) {
        yakumanList.push({ name: '大四喜', han: 13 });
    }

    // 2. 字一色（大四喜との組み合わせが可能）
    if (hasTsuuiisou) {
        yakumanList.push({ name: '字一色', han: 13 });
        return yakumanList;
    }

    // 3. その他の役満
    // 既に役満が成立している場合は判定しない（大四喜を除く）
    if (yakumanList.length === 0 || (yakumanList.length === 1 && hasDaisuushi)) {
        // 大三元
        if (isDaisangen(handTiles)) {
            yakumanList.push({ name: '大三元', han: 13 });
        }
        // 緑一色
        else if (isRyuuiisou(handTiles)) {
            yakumanList.push({ name: '緑一色', han: 13 });
        }
        // 清老頭
        else if (isChinroutou(handTiles)) {
            yakumanList.push({ name: '清老頭', han: 13 });
        }
        // 四槓子
        else if (isSuukantsu(handTiles)) {
            yakumanList.push({ name: '四槓子', han: 13 });
        }
        // 小四喜（大四喜が成立していない場合のみ）
        else if (!hasDaisuushi && isShousuushii(handTiles)) {
            yakumanList.push({ name: '小四喜', han: 13 });
        }
    }

    return yakumanList;
};