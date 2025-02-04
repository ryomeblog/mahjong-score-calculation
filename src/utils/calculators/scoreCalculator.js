import { checkOneHanYaku } from '../yaku/oneHan';
import { checkSixHanYaku } from '../yaku/sixHan';
import { checkThreeHanYaku } from '../yaku/threeHan';
import { checkTwoHanYaku } from '../yaku/twoHan';
import { checkYakuman } from '../yaku/yakuman';
import { calculateBasePoints, calculateFinalScore, calculateFu } from './pointCalculator';

/**
 * 手牌から役を判定する
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const calculateYaku = (handTiles, conditions) => {
    // デバッグ情報: 入力された手牌の構造を確認
    console.log('Input hand tiles:', JSON.stringify(handTiles, null, 2));
    console.log('Conditions:', JSON.stringify(conditions, null, 2));

    const yakuList = [];

    // 役満を優先的に判定
    const yakumanList = checkYakuman(handTiles, conditions);
    if (yakumanList.length > 0) {
        return yakumanList;
    }

    // 一般役を判定
    const oneHanYaku = checkOneHanYaku(handTiles, conditions);
    const twoHanYaku = checkTwoHanYaku(handTiles, conditions);
    const threeHanYaku = checkThreeHanYaku(handTiles, conditions);
    const sixHanYaku = checkSixHanYaku(handTiles, conditions);

    yakuList.push(...oneHanYaku);
    yakuList.push(...twoHanYaku);
    yakuList.push(...threeHanYaku);
    yakuList.push(...sixHanYaku);

    // 特別上がりの判定（1翻）
    if (conditions.isIppatsu) {
        yakuList.push({ name: '一発', han: 1 });
    }
    if (conditions.isChankan) {
        yakuList.push({ name: '槍槓', han: 1 });
    }
    if (conditions.isRinshan) {
        yakuList.push({ name: '嶺上開花', han: 1 });
    }
    if (conditions.isHoutei) {
        yakuList.push({ name: '河底撈魚', han: 1 });
    }
    if (conditions.isHaitei) {
        yakuList.push({ name: '海底撈月', han: 1 });
    }

    // ドラの判定
    const doraCount = conditions.doraTiles?.length || 0;
    if (doraCount > 0) {
        yakuList.push({ name: 'ドラ', han: doraCount });
    }

    // 裏ドラの判定（リーチ時のみ）
    const uradoraCount = conditions.uradoraTiles?.length || 0;
    if (conditions.isRiichi && uradoraCount > 0) {
        yakuList.push({ name: '裏ドラ', han: uradoraCount });
    }

    // 重複する役を除外
    const uniqueYaku = Array.from(new Set(yakuList.map(yaku => yaku.name)))
        .map(name => yakuList.find(yaku => yaku.name === name));

    // デバッグ情報: 判定された役を確認
    console.log('Detected yaku:', uniqueYaku.map(yaku => yaku.name));

    return uniqueYaku;
};

/**
 * 総合的な点数計算を行う
 * @param {Object} handState - 手牌の状態
 * @returns {Object} 計算結果
 */
export const calculateScore = (handState) => {
    // 条件をまとめる
    const conditions = {
        isRiichi: handState.isRiichi || false,
        isTsumo: handState.isTsumo || false,
        seatWind: handState.seatWind || 1,
        roundWind: handState.roundWind || 1,
        doraTiles: handState.doraTiles || [],
        uradoraTiles: handState.uradoraTiles || [],
        // 特別上がりの条件
        isIppatsu: handState.isIppatsu || false,
        isChankan: handState.isChankan || false,
        isRinshan: handState.isRinshan || false,
        isHoutei: handState.isHoutei || false,
        isHaitei: handState.isHaitei || false,
        isChihou: handState.isChihou || false,
        isTenhou: handState.isTenhou || false,
        // 和了牌の情報を追加
        winningTile: handState.winningTile || null
    };

    // 役を判定
    const yakuList = calculateYaku(handState.handTiles, conditions);

    // 翻数の合計を計算
    const totalHan = yakuList.reduce((sum, yaku) => sum + yaku.han, 0);

    // 符の計算
    const fu = calculateFu(
        handState.handTiles,
        conditions.isTsumo,
        !handState.handTiles.some(tile => tile.isCalled)
    );

    // 親かどうかの判定（東家の場合）
    const isDealer = conditions.seatWind === 1;

    // 基本点と最終的な点数計算
    const basePoints = calculateBasePoints(totalHan, fu);
    const finalScore = calculateFinalScore(basePoints, conditions.isTsumo, isDealer);

    // デバッグ情報
    console.log('Score calculation result:', {
        yakuList: yakuList.map(yaku => yaku.name),
        han: totalHan,
        fu,
        basePoints
    });

    // 最終結果を返す
    return {
        yakuList,
        han: totalHan,
        fu,
        basePoints,
        ...finalScore
    };
};
