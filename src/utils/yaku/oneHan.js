import { SUIT_TYPES } from '../../constants/tiles';
import { isMenzen } from './helpers';

/**
 * 順子かどうかを判定する
 * @param {Object} tile - 牌情報
 * @returns {boolean} 順子の場合true
 */
const isShuntsu = (tile) => {
    return tile.isShuntsu && !tile.isCalled;
};

/**
 * 刻子かどうかを判定する
 * @param {Object} tile - 牌情報
 * @returns {boolean} 刻子の場合true
 */
const isKoutsu = (tile) => {
    return tile.isKoutsu && !tile.isCalled;
};

/**
 * 雀頭かどうかを判定する
 * @param {Object} tile - 牌情報
 * @returns {boolean} 雀頭の場合true
 */
const isJantou = (tile) => tile.isJantou;

/**
 * 順子を構成する3つの牌の情報を取得する
 * @param {Object} shuntsu - 順子の先頭牌情報
 * @returns {Array} 順子を構成する3つの牌
 */
const getShuntsuTiles = (shuntsu) => {
    return [
        { suit: shuntsu.suit, number: shuntsu.number },
        { suit: shuntsu.suit, number: shuntsu.number + 1 },
        { suit: shuntsu.suit, number: shuntsu.number + 2 }
    ];
};

/**
 * 手牌からすべての構成牌を取得する
 * @param {Array} handTiles - 手牌
 * @returns {Array} すべての構成牌のリスト
 */
const getAllTiles = (handTiles) => {
    const allTiles = [];

    handTiles.forEach(tile => {
        if (tile.isShuntsu) {
            allTiles.push(...getShuntsuTiles(tile));
        } else if (tile.isKoutsu) {
            // 刻子は同じ牌を3枚
            for (let i = 0; i < 3; i++) {
                allTiles.push({ suit: tile.suit, number: tile.number });
            }
        } else if (tile.isJantou) {
            // 雀頭は同じ牌を2枚
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
 * 牌が断么九の条件を満たすかチェック
 * @param {Object} tile - 牌情報
 * @returns {boolean} 断么九の条件を満たす場合true
 */
const isTanyaoTile = (tile) => {
    if (tile.suit === SUIT_TYPES.JIHAI) return false;
    if (tile.number === 1 || tile.number === 9) return false;
    return true;
};

/**
 * 順子の面子をまとめて取得する
 * @param {Array} handTiles - 手牌
 * @returns {Array} 順子のリスト
 */
const getShuntsuMentsu = (handTiles) => {
    return handTiles.filter(tile => {
        return isShuntsu(tile);
    });
};

/**
 * 2つの順子が同じものかどうかを判定する
 * @param {Object} shuntsu1 - 1つ目の順子
 * @param {Object} shuntsu2 - 2つ目の順子
 * @returns {boolean} 同じ順子の場合true
 */
const isSameShuntsu = (shuntsu1, shuntsu2) => {
    if (!shuntsu1 || !shuntsu2) return false;
    if (!shuntsu1.isShuntsu || !shuntsu2.isShuntsu) return false;

    return (
        shuntsu1.suit === shuntsu2.suit &&
        shuntsu1.number === shuntsu2.number
    );
};

/**
 * 和了牌が雀頭の一部かどうかを判定する
 * @param {Array} handTiles - 手牌
 * @param {Object} winningTile - 和了牌
 * @returns {boolean} 和了牌が雀頭の一部の場合true
 */
const isJantouWait = (handTiles, winningTile) => {
    if (!winningTile) return false;
    const jantou = handTiles.find(isJantou);
    return jantou && jantou.suit === winningTile.suit && jantou.number === winningTile.number;
};

/**
 * 平和形かどうかを判定する
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {boolean} 平和の場合true
 */
const isPinfu = (handTiles, conditions) => {
    console.log("handTiles", handTiles);
    // 門前でない場合は平和にならない
    if (!isMenzen(handTiles)) return false;

    // ツモ以外で頭待ちの場合は平和にならない
    if (!conditions.isTsumo && conditions.winningTile && isJantouWait(handTiles, conditions.winningTile)) {
        return false;
    }

    // 順子の面子を取得
    const shuntsuList = getShuntsuMentsu(handTiles);
    if (shuntsuList.length !== 4) return false;

    // 刻子があれば平和にならない
    if (handTiles.some(isKoutsu)) return false;

    // 両面待ちが必要
    const hasRyanmen = shuntsuList.some(tile => tile.isRyanmen);
    if (!hasRyanmen) return false;

    // 雀頭を取得
    const jantou = handTiles.find(isJantou);
    if (!jantou) return false;

    // 雀頭が役牌の場合は平和にならない
    if (jantou.suit === SUIT_TYPES.JIHAI) {
        // 三元牌
        if (jantou.number >= 5) return false;
        // 自風牌
        if (jantou.number === conditions.seatWind) return false;
        // 場風牌
        if (jantou.number === conditions.roundWind) return false;
    }

    return true;
};

/**
 * 一盃口かどうかを判定する
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 一盃口の場合true
 */
const isIipeikou = (handTiles) => {
    // 門前でない場合は一盃口にならない
    if (!isMenzen(handTiles)) return false;

    // 順子の面子を取得
    const shuntsuList = getShuntsuMentsu(handTiles);

    // 4つの順子が必要
    if (shuntsuList.length !== 4) return false;

    // 同じ順子のペアを探す
    let pairCount = 0;
    let usedIndices = new Set();

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

    // ちょうど1組の同じ順子のペアがある場合に一盃口
    return pairCount === 1;
};

/**
 * 手牌が断么九かどうかを判定する
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 断么九の場合true
 */
const hasTanyao = (handTiles) => {
    // 手牌の構成牌をすべて取得
    const allTiles = getAllTiles(handTiles);
    // すべての牌が断么九の条件を満たすかチェック
    return allTiles.every(isTanyaoTile);
};

/**
 * 1翻役の判定
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const checkOneHanYaku = (handTiles, conditions) => {
    const yakuList = [];
    const isMenzenHand = isMenzen(handTiles);

    // 門前限定役
    if (isMenzenHand) {
        // 立直
        if (conditions.isRiichi) {
            yakuList.push({ name: '立直', han: 1 });
        }

        // 一発
        if (conditions.isIppatsu) {
            yakuList.push({ name: '一発', han: 1 });
        }

        // 門前清自摸和（ツモ上がりの場合のみ）
        if (conditions.isTsumo) {
            yakuList.push({ name: '門前清自摸和', han: 1 });
        }

        // 平和
        if (isPinfu(handTiles, conditions)) {
            yakuList.push({ name: '平和', han: 1 });
        }

        // 一盃口
        if (isIipeikou(handTiles)) {
            yakuList.push({ name: '一盃口', han: 1 });
        }
    }

    // 役牌の判定
    handTiles.forEach(tile => {
        if (tile.isKoutsu && tile.suit === SUIT_TYPES.JIHAI) {
            if (tile.number === 5) {
                yakuList.push({ name: '役牌（白）', han: 1 });
            } else if (tile.number === 6) {
                yakuList.push({ name: '役牌（發）', han: 1 });
            } else if (tile.number === 7) {
                yakuList.push({ name: '役牌（中）', han: 1 });
            } else if (tile.number === conditions.seatWind) {
                yakuList.push({ name: `自風牌（${['東', '南', '西', '北'][tile.number - 1]}）`, han: 1 });
            } else if (tile.number === conditions.roundWind) {
                yakuList.push({ name: `場風牌（${['東', '南', '西', '北'][tile.number - 1]}）`, han: 1 });
            }
        }
    });

    // 断么九（1,9,字牌を含まない）
    if (hasTanyao(handTiles)) {
        yakuList.push({ name: '断么九', han: 1 });
    }

    return yakuList;
};