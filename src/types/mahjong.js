/**
 * @typedef {Object} Tile
 * @property {('m'|'p'|'s'|'z')} suit - 牌の種類（萬子、筒子、索子、字牌）
 * @property {number} number - 数字（1-9）または字牌の種類（1-7）
 * @property {boolean} isRed - 赤ドラフラグ
 * @property {boolean} [isShuntsu] - 順子フラグ
 * @property {boolean} [isKoutsu] - 刻子フラグ
 * @property {boolean} [isKantsu] - 槓子フラグ
 * @property {boolean} [isJantou] - 雀頭フラグ
 * @property {boolean} [isRyanmen] - 両面待ちフラグ
 * @property {boolean} [isCalled] - 鳴きフラグ
 */

/**
 * @typedef {Object} HandState
 * @property {Tile[]} tiles - 手牌
 * @property {Tile} winningTile - 和了牌
 * @property {Tile[]} dora - ドラ表示牌
 * @property {Tile[]} uradora - 裏ドラ表示牌
 * @property {number} seatWind - 自風（1-4: 東南西北）
 * @property {number} roundWind - 場風（1-4: 東南西北）
 * @property {boolean} isTsumo - ツモあがりフラグ
 * @property {boolean} isRiichi - リーチフラグ
 */

/**
 * @typedef {Object} ScoreCalculationResult
 * @property {number} han - 飜数
 * @property {number} fu - 符数
 * @property {number} score - 点数
 * @property {string[]} yaku - 成立した役のリスト
 */

export { };
