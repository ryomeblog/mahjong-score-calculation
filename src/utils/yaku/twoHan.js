import { isJihai, isMenzen, isRoutouhai } from './helpers';

/**
 * 2翻役の判定
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const checkTwoHanYaku = (handTiles, conditions) => {
    const yakuList = [];
    const isMenzenHand = isMenzen(handTiles);

    // 門前限定役
    if (isMenzenHand) {
        // ダブル立直
        if (conditions.isDoubleRiichi) {
            yakuList.push({ name: 'ダブル立直', han: 2 });
        }

        // 七対子
        if (conditions.isChitoitsu) {
            yakuList.push({ name: '七対子', han: 2 });
        }
    }

    // 鳴きOKの役
    // 三色同刻（仮実装）
    if (conditions.isSanshokudoukou) {
        yakuList.push({ name: '三色同刻', han: 2 });
    }

    // 三暗刻（仮実装）
    if (conditions.isSanankou) {
        yakuList.push({ name: '三暗刻', han: 2 });
    }

    // 対々和（仮実装）
    if (conditions.isToitoi) {
        yakuList.push({ name: '対々和', han: 2 });
    }

    // 三槓子（仮実装）
    if (conditions.isSankantsu) {
        yakuList.push({ name: '三槓子', han: 2 });
    }

    // 小三元（仮実装）
    if (conditions.isShousangen) {
        yakuList.push({ name: '小三元', han: 2 });
    }

    // 混老頭
    const isHonroutou = handTiles.every(tile => isJihai(tile) || isRoutouhai(tile));
    if (isHonroutou) {
        yakuList.push({ name: '混老頭', han: 2 });
    }

    // 喰い下り役（鳴きあり2翻、門前3翻）
    // 三色同順（仮実装）
    if (conditions.isSanshokudoujun) {
        yakuList.push({ name: '三色同順', han: isMenzenHand ? 3 : 2 });
    }

    // 一気通貫（仮実装）
    if (conditions.isIttsu) {
        yakuList.push({ name: '一気通貫', han: isMenzenHand ? 3 : 2 });
    }

    // 混全帯幺九（仮実装）
    if (conditions.isChanta) {
        yakuList.push({ name: '混全帯幺九', han: isMenzenHand ? 3 : 2 });
    }

    return yakuList;
};