import { SUIT_TYPES } from '../../constants/tiles';
import { countTiles, isMenzen, isYakuhai, isYaochuhai } from './helpers';

/**
 * 平和形かどうかを判定する
 * @param {Array} handTiles - 手牌
 * @param {Object} conditions - 和了条件
 * @returns {boolean} 平和形の場合true
 */
const isPinfu = (handTiles, conditions) => {
    // 門前でない場合は平和にならない
    if (!isMenzen(handTiles)) return false;

    // 全ての面子が順子であることを確認
    const hasOnlyShuntsu = handTiles.every(tile =>
        tile.isJantou || tile.isShuntsu
    );
    if (!hasOnlyShuntsu) return false;

    // 雀頭が役牌でないことを確認
    const jantou = handTiles.find(tile => tile.isJantou);
    if (isYakuhai(jantou, conditions.seatWind, conditions.roundWind)) return false;

    // 両面待ちであることを確認
    return handTiles.some(tile => tile.isRyanmen);
};

/**
 * 一盃口かどうかを判定する
 * @param {Array} handTiles - 手牌
 * @returns {boolean} 一盃口の場合true
 */
const isIipeikou = (handTiles) => {
    // 門前でない場合は一盃口にならない
    if (!isMenzen(handTiles)) return false;

    // 順子のみを抽出
    const shuntsuList = handTiles.filter(tile => tile.isShuntsu);

    // 同じ順子のペアを探す
    for (let i = 0; i < shuntsuList.length - 1; i++) {
        for (let j = i + 1; j < shuntsuList.length; j++) {
            const shuntsu1 = shuntsuList[i];
            const shuntsu2 = shuntsuList[j];
            if (shuntsu1.suit === shuntsu2.suit &&
                shuntsu1.number === shuntsu2.number) {
                return true;
            }
        }
    }
    return false;
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

        // 平和（ロン上がりでも成立）
        if (isPinfu(handTiles, conditions)) {
            yakuList.push({ name: '平和', han: 1 });
        }

        // 一盃口（ロン上がりでも成立）
        if (isIipeikou(handTiles)) {
            yakuList.push({ name: '一盃口', han: 1 });
        }
    }

    // 鳴きOKの役
    // 役牌
    ['白', '發', '中'].forEach((name, index) => {
        const count = countTiles(handTiles, { suit: SUIT_TYPES.JIHAI, number: 5 + index });
        if (count >= 3) {
            yakuList.push({ name: `役牌（${name}）`, han: 1 });
        }
    });

    // 自風牌
    const seatWindCount = countTiles(handTiles, { suit: SUIT_TYPES.JIHAI, number: conditions.seatWind });
    if (seatWindCount >= 3) {
        yakuList.push({ name: `自風牌（${['東', '南', '西', '北'][conditions.seatWind - 1]}）`, han: 1 });
    }

    // 場風牌
    const roundWindCount = countTiles(handTiles, { suit: SUIT_TYPES.JIHAI, number: conditions.roundWind });
    if (roundWindCount >= 3) {
        yakuList.push({ name: `場風牌（${['東', '南', '西', '北'][conditions.roundWind - 1]}）`, han: 1 });
    }

    // 断么九
    const hasTanyao = !handTiles.some(isYaochuhai);
    if (hasTanyao) {
        yakuList.push({ name: '断么九', han: 1 });
    }

    // 海底摸月
    if (conditions.isHaitei && conditions.isTsumo) {
        yakuList.push({ name: '海底摸月', han: 1 });
    }

    // 河底撈魚
    if (conditions.isHoutei && !conditions.isTsumo) {
        yakuList.push({ name: '河底撈魚', han: 1 });
    }

    // 嶺上開花
    if (conditions.isRinshan) {
        yakuList.push({ name: '嶺上開花', han: 1 });
    }

    // 槍槓
    if (conditions.isChankan) {
        yakuList.push({ name: '槍槓', han: 1 });
    }

    return yakuList;
};