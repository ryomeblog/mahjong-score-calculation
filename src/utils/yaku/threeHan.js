import { SUIT_TYPES } from '../../constants/tiles';
import { isMenzen } from './helpers';

// 順子の面子を取得
const getShuntsuMentsu = (handTiles) => {
    return handTiles.filter(tile => tile.isShuntsu);
};

// 2つの順子が同じものかどうかを判定
const isSameShuntsu = (shuntsu1, shuntsu2) => {
    if (!shuntsu1 || !shuntsu2) return false;
    if (!shuntsu1.isShuntsu || !shuntsu2.isShuntsu) return false;

    return (
        shuntsu1.suit === shuntsu2.suit &&
        shuntsu1.number === shuntsu2.number
    );
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

/**
 * 二盃口判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 二盃口の場合true
 */
const isRyanpeikou = (handTiles) => {
    // 門前でない場合は二盃口にならない
    if (!isMenzen(handTiles)) return false;

    // 順子の面子を取得
    const shuntsuList = getShuntsuMentsu(handTiles);

    // 4つの順子が必要
    if (shuntsuList.length !== 4) return false;

    // 同じ順子のペアを探す
    let pairCount = 0;
    let usedIndices = new Set();

    // 最初のペアを探す
    for (let i = 0; i < shuntsuList.length - 1; i++) {
        if (usedIndices.has(i)) continue;

        for (let j = i + 1; j < shuntsuList.length; j++) {
            if (usedIndices.has(j)) continue;

            if (isSameShuntsu(shuntsuList[i], shuntsuList[j])) {
                pairCount++;
                usedIndices.add(i);
                usedIndices.add(j);
                break;
            }
        }
    }

    // ちょうど2組の同じ順子のペアがある場合に二盃口
    return pairCount === 2;
};

/**
 * 純全帯公九判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 純全帯公九の場合true
 */
const isJunchan = (handTiles) => {
    // すべての牌を取得
    const allTiles = getAllTiles(handTiles);

    // すべての牌に1,9の端牌が含まれているか確認
    const hasTerminals = allTiles.some(tile => {
        return tile.suit !== SUIT_TYPES.JIHAI && (tile.number === 1 || tile.number === 9);
    });

    if (!hasTerminals) return false;

    // すべての面子が端牌を含むか確認
    return handTiles.every(mentsu => {
        // 雀頭は1,9の数牌
        if (mentsu.isJantou) {
            return mentsu.suit !== SUIT_TYPES.JIHAI && (mentsu.number === 1 || mentsu.number === 9);
        }
        // 順子は1-2-3か7-8-9
        if (mentsu.isShuntsu) {
            return mentsu.number === 1 || mentsu.number === 7;
        }
        // 刻子は1か9
        if (mentsu.isKoutsu) {
            return mentsu.suit !== SUIT_TYPES.JIHAI && (mentsu.number === 1 || mentsu.number === 9);
        }
        return false;
    });
};

/**
 * 混一色判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 混一色の場合true
 */
const isHoniso = (handTiles) => {
    // すべての牌を取得
    const allTiles = getAllTiles(handTiles);

    // 字牌が含まれているか確認
    const hasHonors = allTiles.some(tile => tile.suit === SUIT_TYPES.JIHAI);
    if (!hasHonors) return false;

    // 数牌の種類を確認
    const numeralSuits = new Set(
        allTiles
            .filter(tile => tile.suit !== SUIT_TYPES.JIHAI)
            .map(tile => tile.suit)
    );

    // 数牌が1種類のみであることを確認
    return numeralSuits.size === 1;
};

/**
 * 3翻役の判定
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const checkThreeHanYaku = (handTiles, _conditions) => {
    const yakuList = [];

    // 門前限定役
    if (isMenzen(handTiles)) {
        // 二盃口
        if (isRyanpeikou(handTiles)) {
            yakuList.push({ name: '二盃口', han: 3 });
        }
    }

    // 純全帯公九（鳴きあり）
    if (isJunchan(handTiles)) {
        yakuList.push({
            name: '純全帯公九',
            han: isMenzen(handTiles) ? 3 : 2
        });
    }

    // 混一色（鳴きあり）
    if (isHoniso(handTiles)) {
        yakuList.push({
            name: '混一色',
            han: isMenzen(handTiles) ? 3 : 2
        });
    }

    return yakuList;
};