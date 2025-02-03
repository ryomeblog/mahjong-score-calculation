import { isMenzen } from './helpers';

/**
 * 6翻役の判定
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const checkSixHanYaku = (handTiles, conditions) => {
    const yakuList = [];
    const isMenzenHand = isMenzen(handTiles);

    // 清一色（仮実装）
    if (conditions.isChinitsu) {
        yakuList.push({ name: '清一色', han: isMenzenHand ? 6 : 5 });
    }

    return yakuList;
};