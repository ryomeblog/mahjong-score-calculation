import { Box, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { analyzeMentsu } from '../../utils/yaku/helpers';
import MahjongTile from '../atoms/MahjongTile';
import DoraDisplay from '../molecules/DoraDisplay';
import SpecialWinModal, { SPECIAL_WINS } from '../molecules/SpecialWinModal';
import TileSelectModal from '../molecules/TileSelectModal';
import WindSelector from '../molecules/WindSelector';

/**
 * 手牌入力セクションのコンポーネント
 * @param {Object} props
 * @param {Array} props.handTiles - 手牌の配列
 * @param {Array} props.doraTiles - ドラ表示牌の配列
 * @param {Array} props.uradoraTiles - 裏ドラ表示牌の配列
 * @param {number} props.seatWind - 自風
 * @param {number} props.roundWind - 場風
 * @param {boolean} props.isRiichi - リーチ状態
 * @param {boolean} props.isTsumo - ツモ和了フラグ
 * @param {Object} props.winningTile - 和了牌
 * @param {Object} props.specialWins - 特別上がりの状態
 * @param {function} props.onUpdate - 状態更新時のコールバック
 */
const HandInput = ({
    handTiles = [],
    doraTiles = [],
    uradoraTiles = [],
    seatWind = 1,
    roundWind = 1,
    isRiichi = false,
    isTsumo = false,
    winningTile = null,
    specialWins = {},
    onUpdate
}) => {
    // モーダルの表示状態
    const [isHandModalOpen, setIsHandModalOpen] = useState(false);
    const [isWinningTileModalOpen, setIsWinningTileModalOpen] = useState(false);
    const [isSpecialWinModalOpen, setIsSpecialWinModalOpen] = useState(false);

    // 手牌の解析結果をキャッシュ
    const [analyzedTiles, setAnalyzedTiles] = useState([]);

    // 手牌の更新（13枚まで）
    const handleHandTilesUpdate = (newTiles) => {
        // 手牌が更新されたら面子解析を行う
        let newAnalyzedTiles = [];
        if (newTiles.length === 13 && winningTile) {
            // 14枚揃った状態で面子解析
            newAnalyzedTiles = analyzeMentsu([...newTiles, winningTile]);
            setAnalyzedTiles(newAnalyzedTiles);
        }

        onUpdate({
            ...getCurrentState(),
            handTiles: newTiles,
            analyzedTiles: newAnalyzedTiles
        });
    };

    // 上がり牌の更新
    const handleWinningTileSelect = (newTiles) => {
        const newWinningTile = newTiles[0] || null;

        // 手牌が13枚あり、上がり牌も選択された場合に面子解析
        let newAnalyzedTiles = [];
        if (handTiles.length === 13 && newWinningTile) {
            newAnalyzedTiles = analyzeMentsu([...handTiles, newWinningTile]);
            setAnalyzedTiles(newAnalyzedTiles);
        }

        onUpdate({
            ...getCurrentState(),
            winningTile: newWinningTile,
            analyzedTiles: newAnalyzedTiles
        });
        setIsWinningTileModalOpen(false);
    };

    // 特別上がりの更新
    const handleSpecialWinsUpdate = (newSpecialWins) => {
        onUpdate({ ...getCurrentState(), specialWins: newSpecialWins });
    };

    // ドラ表示牌の更新
    const handleDoraTileSelect = (newTiles) => {
        onUpdate({ ...getCurrentState(), doraTiles: newTiles });
    };

    // 裏ドラ表示牌の更新
    const handleUradoraTileSelect = (newTiles) => {
        onUpdate({ ...getCurrentState(), uradoraTiles: newTiles });
    };

    // 風の更新
    const handleSeatWindChange = (newWind) => {
        onUpdate({ ...getCurrentState(), seatWind: newWind });
    };

    const handleRoundWindChange = (newWind) => {
        onUpdate({ ...getCurrentState(), roundWind: newWind });
    };

    // リーチ状態の更新
    const handleRiichiChange = (newRiichi) => {
        onUpdate({ ...getCurrentState(), isRiichi: newRiichi });
    };

    // ツモ/ロンの切り替え
    const handleTsumoToggle = () => {
        onUpdate({
            ...getCurrentState(),
            isTsumo: !isTsumo,
            winningTile: null, // ツモ/ロン切り替え時に上がり牌をリセット
            analyzedTiles: [] // 面子解析結果もリセット
        });
    };

    // 現在の状態を取得
    const getCurrentState = () => ({
        handTiles,
        doraTiles,
        uradoraTiles,
        seatWind,
        roundWind,
        isRiichi,
        isTsumo,
        winningTile,
        analyzedTiles,
        specialWins
    });

    // 手牌をクリア
    const handleClear = () => {
        onUpdate({
            handTiles: [],
            doraTiles: [],
            uradoraTiles: [],
            seatWind,
            roundWind,
            isRiichi: false,
            isTsumo: false,
            winningTile: null,
            analyzedTiles: [],
            specialWins: {}
        });
    };

    // ヘッダーボタン
    const renderHeaderButtons = () => (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mb: 2 }}
        >
            <Stack
                direction="row"
                spacing={2}
            >
                <Box
                    component="button"
                    onClick={handleTsumoToggle}
                    sx={{
                        py: 1,
                        px: 2,
                        border: '1px solid',
                        borderColor: 'primary.main',
                        borderRadius: 1,
                        bgcolor: isTsumo ? 'primary.main' : 'transparent',
                        color: isTsumo ? 'white' : 'primary.main',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: isTsumo ? 'primary.dark' : 'primary.50',
                        },
                    }}
                >
                    {isTsumo ? "ツモ" : "ロン"}
                </Box>
                <Box
                    component="button"
                    onClick={handleClear}
                    sx={{
                        py: 1,
                        px: 2,
                        border: '1px solid',
                        borderColor: 'error.main',
                        borderRadius: 1,
                        bgcolor: 'transparent',
                        color: 'error.main',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: 'error.50',
                        },
                    }}
                >
                    クリア
                </Box>
            </Stack>
        </Stack>
    );

    // 選択された特別上がりを表示用にフォーマット
    const getSelectedSpecialWins = () => {
        return SPECIAL_WINS
            .filter(win => specialWins[win.id])
            .map(win => win.name)
            .join('、');
    };

    return (
        <Box sx={{ p: 2 }}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                {/* ヘッダーボタン */}
                {renderHeaderButtons()}

                <Typography variant="h6" sx={{ mb: 2 }}>
                    手牌入力
                </Typography>

                {/* 風選択 */}
                <WindSelector
                    seatWind={seatWind}
                    roundWind={roundWind}
                    onSeatWindChange={handleSeatWindChange}
                    onRoundWindChange={handleRoundWindChange}
                />

                {/* ドラ表示 */}
                <DoraDisplay
                    doraTiles={doraTiles}
                    uradoraTiles={uradoraTiles}
                    isRiichi={isRiichi}
                    onDoraTileSelect={handleDoraTileSelect}
                    onUradoraTileSelect={handleUradoraTileSelect}
                    onRiichiChange={handleRiichiChange}
                />

                {/* 特別上がり表示エリア */}
                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        特別上がり
                    </Typography>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            minHeight: '60px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={() => setIsSpecialWinModalOpen(true)}
                    >
                        {Object.keys(specialWins).some(id => specialWins[id]) ? (
                            <Typography>
                                {getSelectedSpecialWins()}
                            </Typography>
                        ) : (
                            <Typography color="text.secondary">
                                クリックして特別上がりを選択してください
                            </Typography>
                        )}
                    </Paper>
                </Box>

                {/* 手牌表示エリア */}
                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        手牌（13枚）
                    </Typography>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            minHeight: '60px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={() => setIsHandModalOpen(true)}
                    >
                        {handTiles.length > 0 ? (
                            handTiles.map((tile, index) => (
                                <MahjongTile
                                    key={index}
                                    {...tile}
                                />
                            ))
                        ) : (
                            <Typography color="text.secondary">
                                クリックして手牌を選択してください（13枚）
                            </Typography>
                        )}
                    </Paper>
                </Box>

                {/* 上がり牌表示エリア */}
                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {isTsumo ? "ツモ牌" : "ロン牌"}
                    </Typography>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            minHeight: '60px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={() => setIsWinningTileModalOpen(true)}
                    >
                        {winningTile ? (
                            <MahjongTile {...winningTile} />
                        ) : (
                            <Typography color="text.secondary">
                                クリックして{isTsumo ? "ツモ" : "ロン"}牌を選択してください
                            </Typography>
                        )}
                    </Paper>
                </Box>
            </Paper>

            {/* 手牌選択モーダル */}
            <TileSelectModal
                open={isHandModalOpen}
                onClose={() => setIsHandModalOpen(false)}
                selectedTiles={handTiles}
                onTileSelect={handleHandTilesUpdate}
                maxTiles={13}
                title="手牌を選択（13枚）"
                allowMultiple={true}
            />

            {/* 上がり牌選択モーダル */}
            <TileSelectModal
                open={isWinningTileModalOpen}
                onClose={() => setIsWinningTileModalOpen(false)}
                selectedTiles={winningTile ? [winningTile] : []}
                onTileSelect={handleWinningTileSelect}
                maxTiles={1}
                title={`${isTsumo ? "ツモ" : "ロン"}牌を選択`}
                allowMultiple={false}
            />

            {/* 特別上がり選択モーダル */}
            <SpecialWinModal
                open={isSpecialWinModalOpen}
                onClose={() => setIsSpecialWinModalOpen(false)}
                selectedWins={specialWins}
                onUpdate={handleSpecialWinsUpdate}
            />
        </Box>
    );
};

export default HandInput;