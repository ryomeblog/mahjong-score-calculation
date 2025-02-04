import { isYaochuhai } from './helpers';

/**
 * 対子の数を数える
 * @param {Array} handTiles - 手牌
 * @returns {number} 対子の数
 */
const countToitsu = (handTiles) => {
    return handTiles.filter(tile =>
        tile.isJantou ||
        (tile.tiles && tile.tiles.length === 2)
    ).length;
};

/**
 * 七対子かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 七対子の場合true
 */
const isChitoitsu = (handTiles) => {
    return countToitsu(handTiles) === 7;
};

/**
 * 三色同刻かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 三色同刻の場合true
 */
const isSanshokudoukou = (handTiles) => {
    const koutsuNumbers = handTiles
        .filter(tile => tile.isKoutsu)
        .map(tile => tile.number);

    // 同じ数字の刻子が3つあるかチェック
    for (const num of [...new Set(koutsuNumbers)]) {
        const sameNumberKoutsu = handTiles.filter(tile =>
            tile.isKoutsu && tile.number === num
        );
        if (sameNumberKoutsu.length >= 3) {
            // 異なる種類の刻子があるかチェック
            const suits = new Set(sameNumberKoutsu.map(tile => tile.suit));
            if (suits.size >= 3) {
                return true;
            }
        }
    }
    return false;
};

/**
 * 三暗刻かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 三暗刻の場合true
 */
const isSanankou = (handTiles) => {
    const ankou = handTiles.filter(tile =>
        tile.isKoutsu && !tile.isCalled
    );
    return ankou.length >= 3;
};

/**
 * 対々和かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 対々和の場合true
 */
const isToitoi = (handTiles) => {
    const koutsuCount = handTiles.filter(tile => tile.isKoutsu).length;
    return koutsuCount === 4;
};

/**
 * 三槓子かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 三槓子の場合true
 */
const isSankanzu = (handTiles) => {
    const kanCount = handTiles.filter(tile => tile.isKan).length;
    return kanCount >= 3;
};

/**
 * 小三元かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 小三元の場合true
 */
const isShousangen = (handTiles) => {
    // 三元牌の刻子と対子の数を数える
    const sangenCount = {
        koutsu: 0,
        toitsu: 0
    };

    handTiles.forEach(tile => {
        if (tile.suit === 'z' && tile.number >= 5) {
            if (tile.isKoutsu) {
                sangenCount.koutsu++;
            } else if (tile.isJantou) {
                sangenCount.toitsu++;
            }
        }
    });

    return sangenCount.koutsu === 2 && sangenCount.toitsu === 1;
};

/**
 * 混老頭かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 混老頭の場合true
 */
const isHonroutou = (handTiles) => {
    return handTiles.every(tile => {
        const number = tile.number;
        return tile.suit === 'z' || number === 1 || number === 9;
    });
};

/**
 * 三色同順かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 三色同順の場合true
 */
const isSanshokudoujun = (handTiles) => {
    const shuntsuTiles = handTiles.filter(tile => tile.isShuntsu);

    for (const shuntsu of shuntsuTiles) {
        // 同じ数から始まる順子を探す
        const sameNumberShuntsu = shuntsuTiles.filter(tile =>
            tile.number === shuntsu.number
        );
        if (sameNumberShuntsu.length >= 3) {
            // 異なる種類の順子があるかチェック
            const suits = new Set(sameNumberShuntsu.map(tile => tile.suit));
            if (suits.size >= 3) {
                return true;
            }
        }
    }
    return false;
};

/**
 * 一気通貫かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 一気通貫の場合true
 */
const isIkkitsukan = (handTiles) => {
    // 各種類ごとに順子を分類
    const shuntsuBySuit = {
        m: new Set(),
        p: new Set(),
        s: new Set()
    };

    handTiles
        .filter(tile => tile.isShuntsu)
        .forEach(tile => {
            if (tile.suit !== 'z') {
                shuntsuBySuit[tile.suit].add(tile.number);
            }
        });

    // いずれかの種類で1-9の連続した順子があるかチェック
    return Object.values(shuntsuBySuit).some(numbers => {
        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
        return sortedNumbers.length >= 3 &&
            sortedNumbers[0] === 1 &&
            sortedNumbers[1] === 4 &&
            sortedNumbers[2] === 7;
    });
};

/**
 * 混全帯幺九かどうかを判定
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 混全帯幺九の場合true
 */
const isChantaiyao = (handTiles) => {
    return handTiles.every(tile => {
        if (tile.isShuntsu) {
            // 順子の場合、1-2-3か7-8-9の順子のみ許可
            const firstNumber = tile.number;
            return firstNumber === 1 || firstNumber === 7;
        } else {
            // 刻子・対子の場合、老頭牌か字牌のみ許可
            return isYaochuhai(tile);
        }
    });
};

/**
 * 二翻役の判定
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const checkTwoHanYaku = (handTiles, conditions = {}) => {
    const yakuList = [];

    // 門前限定役
    if (!handTiles.some(tile => tile.isCalled)) {
        // ダブル立直
        if (conditions.isDoubleRiichi) {
            yakuList.push({ name: 'ダブル立直', han: 2 });
        }

        // 七対子
        if (isChitoitsu(handTiles)) {
            yakuList.push({ name: '七対子', han: 2 });
        }
    }

    // 鳴きOK役
    if (isSanshokudoukou(handTiles)) {
        yakuList.push({ name: '三色同刻', han: 2 });
    }
    if (isSanankou(handTiles)) {
        yakuList.push({ name: '三暗刻', han: 2 });
    }
    if (isToitoi(handTiles)) {
        yakuList.push({ name: '対々和', han: 2 });
    }
    if (isSankanzu(handTiles)) {
        yakuList.push({ name: '三槓子', han: 2 });
    }
    if (isShousangen(handTiles)) {
        yakuList.push({ name: '小三元', han: 2 });
    }
    if (isHonroutou(handTiles)) {
        yakuList.push({ name: '混老頭', han: 2 });
    }

    // 喰い下り役（鳴きがあると1翻）
    const isCalled = handTiles.some(tile => tile.isCalled);
    if (isSanshokudoujun(handTiles)) {
        yakuList.push({ name: '三色同順', han: isCalled ? 1 : 2 });
    }
    if (isIkkitsukan(handTiles)) {
        yakuList.push({ name: '一気通貫', han: isCalled ? 1 : 2 });
    }
    if (isChantaiyao(handTiles)) {
        yakuList.push({ name: '混全帯幺九', han: isCalled ? 1 : 2 });
    }

    return yakuList;
};