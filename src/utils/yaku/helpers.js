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

/**
 * 順子の構成牌を生成する
 * @param {Object} tile - 先頭の牌
 * @returns {Array} 順子を構成する3つの牌
 */
const createShuntsuTiles = (tile) => {
    return [
        { suit: tile.suit, number: tile.number },
        { suit: tile.suit, number: tile.number + 1 },
        { suit: tile.suit, number: tile.number + 2 }
    ];
};

/**
 * 刻子の構成牌を生成する
 * @param {Object} tile - 牌
 * @returns {Array} 刻子を構成する3つの牌
 */
const createKoutsuTiles = (tile) => {
    return Array(3).fill({ suit: tile.suit, number: tile.number });
};

/**
 * 雀頭の構成牌を生成する
 * @param {Object} tile - 牌
 * @returns {Array} 雀頭を構成する2つの牌
 */
const createJantouTiles = (tile) => {
    return Array(2).fill({ suit: tile.suit, number: tile.number });
};

/**
 * 手牌を順子、刻子、雀頭に分類する
 * @param {Array} handTiles - 手牌
 * @returns {Object} 分類結果と待ち判定の情報を含むオブジェクト
 */
export const analyzeMentsu = (handTiles) => {
    // 手牌をコピーして作業用の配列を作成
    const tiles = [...handTiles].sort((a, b) => {
        if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
        return a.number - b.number;
    });

    // 同じ牌が3枚以上ある場合は刻子として抽出
    const koutsuList = [];
    const remainingTiles = [];
    let i = 0;
    while (i < tiles.length) {
        const current = tiles[i];
        const sameCount = tiles.filter(t =>
            t.suit === current.suit && t.number === current.number
        ).length;

        if (sameCount >= 3) {
            // 刻子を抽出
            const koutsu = {
                suit: current.suit,
                number: current.number,
                type: 'koutsu',
                isKoutsu: true,
                isAnkou: !tiles[i].isCalled && !tiles[i + 1].isCalled && !tiles[i + 2].isCalled,
                tiles: createKoutsuTiles(current)
            };
            koutsuList.push(koutsu);
            i += 3;
        } else {
            remainingTiles.push(current);
            i++;
        }
    }

    // 同じ牌が2枚ある場合は雀頭候補として抽出
    const jantouList = [];
    const afterJantouTiles = [];
    i = 0;
    while (i < remainingTiles.length) {
        const current = remainingTiles[i];
        const next = remainingTiles[i + 1];
        if (next && current.suit === next.suit && current.number === next.number) {
            const jantou = {
                suit: current.suit,
                number: current.number,
                type: 'jantou',
                isJantou: true,
                tiles: createJantouTiles(current)
            };
            jantouList.push(jantou);
            i += 2;
        } else {
            afterJantouTiles.push(current);
            i++;
        }
    }

    // 残りの牌から順子を抽出
    const shuntsuList = [];
    const finalTiles = [...afterJantouTiles];

    for (let suit of ['m', 'p', 's']) {
        for (let num = 1; num <= 7; num++) {
            const idx1 = finalTiles.findIndex(t => t.suit === suit && t.number === num);
            if (idx1 === -1) continue;

            const idx2 = finalTiles.findIndex(t => t.suit === suit && t.number === num + 1);
            if (idx2 === -1) continue;

            const idx3 = finalTiles.findIndex(t => t.suit === suit && t.number === num + 2);
            if (idx3 === -1) continue;

            // 順子を見つけた場合
            const shuntsu = {
                suit: suit,
                number: num,
                type: 'shuntsu',
                isShuntsu: true,
                isRyanmen: num !== 1 && num !== 7, // 両面待ちかどうか
                tiles: createShuntsuTiles({ suit, number: num })
            };
            shuntsuList.push(shuntsu);

            // 使用した牌を削除
            [idx3, idx2, idx1].forEach(idx => {
                finalTiles.splice(idx, 1);
            });
        }
    }

    // 面子構成の情報を付加した手牌を作成
    const analyzedTiles = [
        ...koutsuList,
        ...shuntsuList,
        ...jantouList,
        ...finalTiles.map(tile => ({ ...tile, tiles: [tile] }))
    ];

    return analyzedTiles;
};