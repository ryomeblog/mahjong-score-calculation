import { isMenzen } from './helpers';

/**
 * 3翻役の判定
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const checkThreeHanYaku = (handTiles, conditions) => {
    const yakuList = [];
    const isMenzenHand = isMenzen(handTiles);

    // 門前限定役
    if (isMenzenHand) {
        // 二盃口（仮実装）
        if (conditions.isRyanpeikou) {
            yakuList.push({ name: '二盃口', han: 3 });
        }
    }

    // 鳴きOKの役
    // 純全帯公九（仮実装）
    if (conditions.isJunchan) {
        yakuList.push({ name: '純全帯公九', han: 3 });
    }

    // 混一色（仮実装）
    if (conditions.isHonitsu) {
        yakuList.push({ name: '混一色', han: 3 });
    }

    return yakuList;
};