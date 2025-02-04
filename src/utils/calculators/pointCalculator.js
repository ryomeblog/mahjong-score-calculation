import { SCORE_CONSTANTS } from '../../constants/tiles';
import { isYaochuhai } from '../yaku/helpers';

/**
 * 基本点を計算する
 * @param {number} han - 飜数
 * @param {number} fu - 符数
 * @returns {number} 基本点
 */
export const calculateBasePoints = (han, fu) => {
    // 役満の場合
    if (han >= 13) {
        return SCORE_CONSTANTS.BASE_POINTS.YAKUMAN;
    }

    // 三倍満
    if (han >= 11) {
        return SCORE_CONSTANTS.BASE_POINTS.SANBAIMAN;
    }

    // 倍満
    if (han >= 8) {
        return SCORE_CONSTANTS.BASE_POINTS.BAIMAN;
    }

    // 跳満
    if (han >= 6) {
        return SCORE_CONSTANTS.BASE_POINTS.HANEMAN;
    }

    // 満貫
    if (han >= 5 || (han >= 4 && fu >= 40) || (han >= 3 && fu >= 70)) {
        return SCORE_CONSTANTS.BASE_POINTS.MANGAN;
    }

    // 通常の計算
    const rawPoints = fu * Math.pow(2, han + 2);
    return Math.min(rawPoints, SCORE_CONSTANTS.BASE_POINTS.MANGAN);
};

/**
 * 最終的な点数を計算する
 * @param {number} basePoints - 基本点
 * @param {boolean} isTsumo - ツモ和了かどうか
 * @param {boolean} isDealer - 親かどうか
 * @returns {Object} 点数情報
 */
export const calculateFinalScore = (basePoints, isTsumo, isDealer) => {
    const points = Math.ceil(basePoints / 100) * 100;  // 100点単位に切り上げ

    if (isTsumo) {
        if (isDealer) {
            // 親のツモ: 全員から2倍
            return {
                points,
                paymentFromEach: points * 2,
                total: points * 6  // 2点 × 3人
            };
        } else {
            // 子のツモ: 親から2倍、子から1倍
            return {
                points,
                paymentFromDealer: points * 2,
                paymentFromOthers: points,
                total: points * 4  // 親2点 + 子1点 × 2人
            };
        }
    } else {
        // ロン和了
        const ronPoints = points * (isDealer ? 6 : 4);
        return {
            points,
            total: ronPoints
        };
    }
};

/**
 * 手牌から符数を計算する
 * @param {Array} handTiles - 手牌（14枚）
 * @param {boolean} isTsumo - ツモ和了かどうか
 * @param {boolean} isMenzen - 門前かどうか
 * @returns {number} 符数
 */
export const calculateFu = (handTiles, isTsumo, isMenzen) => {
    let fu = 20; // 基本符

    // 七対子は固定25符
    if (handTiles.some(tile => tile.isChitoitsu)) {
        return 25;
    }

    // 平和形の場合
    const isPinfu = handTiles.every(tile =>
        tile.isJantou || tile.isShuntsu
    ) && handTiles.some(tile => tile.isRyanmen);

    if (isPinfu) {
        if (isTsumo) {
            return 20;
        }
        if (isMenzen) {
            return 30;
        }
    }

    // ツモ符（門前のみ）
    if (isTsumo && isMenzen) {
        fu += 2;
    }

    // メンツ構成による符
    handTiles.forEach(tile => {
        if (tile.isKantsu) {
            // 槓子
            fu += tile.isAnkan ? 32 : 16; // 暗槓: 32符, 明槓: 16符
            if (isYaochuhai(tile)) {
                fu += tile.isAnkan ? 32 : 16; // 幺九牌は2倍
            }
        } else if (tile.isKoutsu) {
            // 刻子
            fu += tile.isAnkou ? 8 : 4; // 暗刻: 8符, 明刻: 4符
            if (isYaochuhai(tile)) {
                fu += tile.isAnkou ? 8 : 4; // 幺九牌は2倍
            }
        }
    });

    // 雀頭の符
    const jantou = handTiles.find(tile => tile.isJantou);
    if (jantou) {
        // 役牌の場合2符
        if (jantou.isYakuhai) {
            fu += 2;
        }
        // 連風牌の場合4符
        if (jantou.isDoubleWinds) {
            fu += 4;
        }
    }

    // 符数は10の倍数に切り上げ
    return Math.ceil(fu / 10) * 10;
};