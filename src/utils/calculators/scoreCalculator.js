import { checkOneHanYaku } from '../yaku/oneHan';
import { checkSixHanYaku } from '../yaku/sixHan';
import { checkThreeHanYaku } from '../yaku/threeHan';
import { checkTwoHanYaku } from '../yaku/twoHan';
import { checkYakuman } from '../yaku/yakuman';
import { calculateBasePoints, calculateFinalScore, calculateFu } from './pointCalculator';

/**
 * 手牌から役を判定する
 * @param {Array} handTiles - 手牌（14枚）
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const calculateYaku = (handTiles, conditions) => {
    const yakuList = [];

    // 役満を優先的に判定
    const yakumanList = checkYakuman(handTiles, conditions);
    if (yakumanList.length > 0) {
        return yakumanList;
    }

    // 通常の役を判定
    yakuList.push(...checkOneHanYaku(handTiles, conditions));
    yakuList.push(...checkTwoHanYaku(handTiles, conditions));
    yakuList.push(...checkThreeHanYaku(handTiles, conditions));
    yakuList.push(...checkSixHanYaku(handTiles, conditions));

    // ドラの判定
    const doraCount = conditions.doraTiles.length;
    if (doraCount > 0) {
        yakuList.push({ name: 'ドラ', han: doraCount });
    }

    // 裏ドラの判定（リーチ時のみ）
    if (conditions.isRiichi && conditions.uradoraTiles.length > 0) {
        yakuList.push({ name: '裏ドラ', han: conditions.uradoraTiles.length });
    }

    return yakuList;
};

/**
 * 総合的な点数計算を行う
 * @param {Object} handState - 手牌の状態
 * @returns {Object} 計算結果
 */
export const calculateScore = (handState) => {
    // 役の判定
    const yakuList = calculateYaku(handState.handTiles, handState);
    const totalHan = yakuList.reduce((sum, yaku) => sum + yaku.han, 0);

    // 符の計算
    const fu = calculateFu(handState.handTiles, handState.isTsumo, !handState.handTiles.some(tile => tile.isCalled));

    // 親かどうかの判定（東家の場合）
    const isDealer = handState.seatWind === 1;

    // 基本点と最終的な点数計算
    const basePoints = calculateBasePoints(totalHan, fu);
    const finalScore = calculateFinalScore(basePoints, handState.isTsumo, isDealer);

    // 最終結果を返す
    return {
        yakuList,
        han: totalHan,
        fu,
        basePoints,
        ...finalScore
    };
};
