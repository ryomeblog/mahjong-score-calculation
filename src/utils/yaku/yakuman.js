import { isMenzen } from './helpers';

/**
 * 役満の判定
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {Array} 成立した役のリスト
 */
export const checkYakuman = (handTiles, conditions) => {
    const yakuList = [];
    const isMenzenHand = isMenzen(handTiles);

    // 門前限定役
    if (isMenzenHand) {
        // 四暗刻（仮実装）
        if (conditions.isSuuankou) {
            yakuList.push({ name: '四暗刻', han: 13 });
        }

        // 国士無双（仮実装）
        if (conditions.isKokushi) {
            yakuList.push({ name: '国士無双', han: 13 });
        }

        // 九蓮宝燈（仮実装）
        if (conditions.isChuurenpoutou) {
            yakuList.push({ name: '九蓮宝燈', han: 13 });
        }

        // 地和
        if (conditions.isChihou) {
            yakuList.push({ name: '地和', han: 13 });
        }

        // 天和
        if (conditions.isTenhou) {
            yakuList.push({ name: '天和', han: 13 });
        }
    }

    // 鳴きOKの役
    // 大三元（仮実装）
    if (conditions.isDaisangen) {
        yakuList.push({ name: '大三元', han: 13 });
    }

    // 緑一色（仮実装）
    if (conditions.isRyuuiisou) {
        yakuList.push({ name: '緑一色', han: 13 });
    }

    // 字一色（仮実装）
    if (conditions.isTsuuiisou) {
        yakuList.push({ name: '字一色', han: 13 });
    }

    // 清老頭（仮実装）
    if (conditions.isChinroutou) {
        yakuList.push({ name: '清老頭', han: 13 });
    }

    // 四槓子（仮実装）
    if (conditions.isSuukantsu) {
        yakuList.push({ name: '四槓子', han: 13 });
    }

    // 小四喜（仮実装）
    if (conditions.isShousushi) {
        yakuList.push({ name: '小四喜', han: 13 });
    }

    // 大四喜（二倍役満）（仮実装）
    if (conditions.isDaisushi) {
        yakuList.push({ name: '大四喜', han: 26 });
    }

    return yakuList;
};