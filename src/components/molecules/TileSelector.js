import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { MAX_NUMBERS, SUIT_TYPES } from '../../constants/tiles';
import MahjongTile from '../atoms/MahjongTile';

/**
 * 牌選択用のコンポーネント
 * @param {Object} props
 * @param {Array} props.selectedTiles - 選択された牌の配列
 * @param {function} props.onTileClick - 牌クリック時のハンドラ
 * @param {number} props.maxTiles - 選択可能な最大牌数
 * @param {boolean} props.allowMultiple - 同じ牌を複数回選択可能かどうか
 */
const TileSelector = ({
    selectedTiles = [],
    onTileClick,
    maxTiles = 14,
    allowMultiple = false
}) => {
    // 特定の牌の選択数を取得
    const getTileCount = (suit, number, isRed = false) => {
        if (maxTiles === 1) return 0; // 上がり牌選択モードではカウンターを表示しない

        return selectedTiles.filter(
            tile => tile.suit === suit &&
                tile.number === number &&
                tile.isRed === isRed
        ).length;
    };

    // 特定の牌が選択されているかどうかを判定
    const isTileSelected = (suit, number, isRed = false) => {
        return selectedTiles.some(
            tile => tile.suit === suit &&
                tile.number === number &&
                tile.isRed === isRed
        );
    };

    // 牌クリック時の処理
    const handleTileClick = (suit, number, isRed = false) => {
        const currentCount = getTileCount(suit, number, isRed);

        // 現在の牌の配列から、クリックされた牌を除外
        const otherTiles = selectedTiles.filter(
            tile => !(tile.suit === suit &&
                tile.number === number &&
                tile.isRed === isRed)
        );

        if (currentCount === 0) {
            // 未選択の場合は1枚追加
            if (selectedTiles.length < maxTiles || maxTiles === 1) {
                onTileClick([...otherTiles, { suit, number, isRed }]);
            }
        } else if (currentCount < 4 && allowMultiple) {
            // 既に選択されていて4未満の場合は1枚追加
            if (otherTiles.length + currentCount + 1 <= maxTiles) {
                onTileClick([...otherTiles, ...Array(currentCount + 1).fill({ suit, number, isRed })]);
            }
        } else {
            // 4枚選択されている場合は選択解除
            onTileClick(otherTiles);
        }
    };

    // 選択をクリア
    const handleClear = () => {
        onTileClick([]);
    };

    // 牌グループを生成する関数
    const renderTileGroup = (suit) => {
        const maxNum = MAX_NUMBERS[suit];
        const tiles = [];

        for (let i = 1; i <= maxNum; i++) {
            // 5の牌の場合、通常の5と赤5を表示
            if (i === 5 && suit !== SUIT_TYPES.JIHAI) {
                // 通常の5
                const normalCount = getTileCount(suit, i, false);
                tiles.push(
                    <Grid item key={`${suit}-${i}`}>
                        <Box position="relative">
                            <MahjongTile
                                suit={suit}
                                number={i}
                                isRed={false}
                                selected={isTileSelected(suit, i, false)}
                                onClick={() => handleTileClick(suit, i, false)}
                            />
                            {normalCount > 0 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 20,
                                        height: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {normalCount}
                                </Box>
                            )}
                        </Box>
                    </Grid>
                );
                // 赤5
                const redCount = getTileCount(suit, i, true);
                tiles.push(
                    <Grid item key={`${suit}-${i}-red`}>
                        <Box position="relative">
                            <MahjongTile
                                suit={suit}
                                number={i}
                                isRed={true}
                                selected={isTileSelected(suit, i, true)}
                                onClick={() => handleTileClick(suit, i, true)}
                            />
                            {redCount > 0 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 20,
                                        height: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {redCount}
                                </Box>
                            )}
                        </Box>
                    </Grid>
                );
            } else {
                const count = getTileCount(suit, i);
                tiles.push(
                    <Grid item key={`${suit}-${i}`}>
                        <Box position="relative">
                            <MahjongTile
                                suit={suit}
                                number={i}
                                selected={isTileSelected(suit, i)}
                                onClick={() => handleTileClick(suit, i)}
                            />
                            {count > 0 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 20,
                                        height: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {count}
                                </Box>
                            )}
                        </Box>
                    </Grid>
                );
            }
        }
        return tiles;
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* クリアボタンと選択状況 */}
            <Box
                sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {`選択: ${selectedTiles.length}/${maxTiles}牌`}
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={handleClear}
                    disabled={selectedTiles.length === 0}
                >
                    クリア
                </Button>
            </Box>

            {/* 数牌グループ */}
            {Object.entries({
                [SUIT_TYPES.MANZU]: '萬子',
                [SUIT_TYPES.PINZU]: '筒子',
                [SUIT_TYPES.SOUZU]: '索子'
            }).map(([suit, label]) => (
                <Box key={suit} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {label}
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                        {renderTileGroup(suit)}
                    </Grid>
                    <Divider />
                </Box>
            ))}

            {/* 字牌グループ */}
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    字牌
                </Typography>
                <Grid container spacing={1}>
                    {renderTileGroup(SUIT_TYPES.JIHAI)}
                </Grid>
            </Box>
        </Box>
    );
};

export default TileSelector;