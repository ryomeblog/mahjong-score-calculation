import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
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
 * @param {Array} props.calledTiles - 鳴き牌の配列
 * @param {number} props.honba - 本場数
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
    calledTiles = [],
    honba = 0,
    onUpdate
}) => {
    // モーダルの表示状態
    const [isHandModalOpen, setIsHandModalOpen] = useState(false);
    const [isWinningTileModalOpen, setIsWinningTileModalOpen] = useState(false);
    const [isSpecialWinModalOpen, setIsSpecialWinModalOpen] = useState(false);
    const [isCalledTileModalOpen, setIsCalledTileModalOpen] = useState(false);

    // 編集中の鳴き牌のインデックス
    const [editingCalledTileIndex, setEditingCalledTileIndex] = useState(-1);

    // 手牌の解析結果をキャッシュ
    const [analyzedTiles, setAnalyzedTiles] = useState([]);

    // 現在の鳴きタイプ
    const [currentCallType, setCurrentCallType] = useState('');
    // 一時的な選択状態
    const [tempHandTiles, setTempHandTiles] = useState([]);
    const [tempWinningTile, setTempWinningTile] = useState(null);
    const [tempCalledTiles, setTempCalledTiles] = useState([]);

    // 使用可能な手牌の枚数を計算
    const calculateAvailableHandTiles = () => {
        const kanCount = calledTiles.filter(tile => tile.type === 'kan').length;
        const otherCallCount = calledTiles.filter(tile => tile.type !== 'kan').length;
        return 13 - (kanCount * 3 + otherCallCount * 3);
    };

    // 手牌の更新（上限は鳴き牌に応じて調整）
    const handleHandTilesUpdate = (newTiles) => {
        const maxTiles = calculateAvailableHandTiles();
        const trimmedTiles = newTiles.slice(0, maxTiles);

        let newAnalyzedTiles = [];
        if (trimmedTiles.length === maxTiles && winningTile) {
            newAnalyzedTiles = analyzeMentsu([...trimmedTiles, winningTile]);
            setAnalyzedTiles(newAnalyzedTiles);
        }

        onUpdate({
            ...getCurrentState(),
            handTiles: trimmedTiles,
            analyzedTiles: newAnalyzedTiles
        });
    };

    // 上がり牌の更新
    const handleWinningTileSelect = (newTiles) => {
        const newWinningTile = newTiles[0] || null;
        const maxTiles = calculateAvailableHandTiles();
        const totalCalledTiles = calledTiles.reduce((acc, tile) =>
            acc + (tile.type === 'kan' ? 4 : 3), 0);

        // 上がり牌が選択され、手牌が揃っている場合のみ点数計算
        // 手牌と鳴き牌の合計が14になるように調整（13枚 + 上がり牌）
        if (newWinningTile && handTiles.length === maxTiles && (handTiles.length + totalCalledTiles === 13)) {
            console.log('Hand complete with:', {
                handTiles: handTiles.length,
                calledTiles: totalCalledTiles,
                total: handTiles.length + totalCalledTiles
            });

            // 手牌と鳴き牌を組み合わせて解析
            const allTiles = [...handTiles];
            calledTiles.forEach(calledTile => {
                allTiles.push(...calledTile.tiles);
            });
            const newAnalyzedTiles = analyzeMentsu([...allTiles, newWinningTile]);
            setAnalyzedTiles(newAnalyzedTiles);

            // 点数計算に必要な情報を更新
            onUpdate({
                ...getCurrentState(),
                winningTile: newWinningTile,
                analyzedTiles: newAnalyzedTiles
            });

            console.log('Calculating score with:', {
                handTiles,
                calledTiles,
                winningTile: newWinningTile,
                analyzedTiles: newAnalyzedTiles
            });
        } else {
            // 条件を満たさない場合は上がり牌のみを更新
            onUpdate({
                ...getCurrentState(),
                winningTile: newWinningTile,
                analyzedTiles: []
            });
        }
    };

    // 鳴き牌の更新
    const handleCalledTilesUpdate = (newTiles) => {
        if (newTiles.length === 0) return;

        const newCalledTile = {
            tiles: newTiles,
            type: currentCallType,
            isCalled: true
        };

        let updatedCalledTiles;
        if (editingCalledTileIndex >= 0) {
            // 既存の鳴き牌を編集
            updatedCalledTiles = [...calledTiles];
            updatedCalledTiles[editingCalledTileIndex] = newCalledTile;
        } else {
            // 新しい鳴き牌を追加
            updatedCalledTiles = [...calledTiles, newCalledTile];
        }

        // 鳴き牌の更新後に手牌の枚数を調整
        const newMaxTiles = 13 - (updatedCalledTiles.reduce((acc, tile) =>
            acc + (tile.type === 'kan' ? 3 : 3), 0));
        const adjustedHandTiles = handTiles.slice(0, newMaxTiles);

        onUpdate({
            ...getCurrentState(),
            calledTiles: updatedCalledTiles,
            handTiles: adjustedHandTiles
        });

        setEditingCalledTileIndex(-1);
        setIsCalledTileModalOpen(false);
    };

    // 鳴き牌の編集
    const handleEditCalledTile = (index) => {
        const calledTile = calledTiles[index];
        setCurrentCallType(calledTile.type);
        setEditingCalledTileIndex(index);
        setIsCalledTileModalOpen(true);
    };

    // 鳴き牌の削除
    const handleDeleteCalledTile = (index) => {
        const updatedCalledTiles = calledTiles.filter((_, i) => i !== index);
        onUpdate({
            ...getCurrentState(),
            calledTiles: updatedCalledTiles
        });
    };

    // 鳴きタイプの更新
    const handleCallTypeChange = (newType) => {
        setCurrentCallType(newType);
    };

    // 本場の更新
    const handleHonbaChange = (delta) => {
        const newHonba = Math.max(0, honba + delta);
        onUpdate({
            ...getCurrentState(),
            honba: newHonba
        });
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
            winningTile: null,
            analyzedTiles: []
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
        specialWins,
        calledTiles,
        honba
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
            specialWins: {},
            calledTiles: [],
            honba: 0
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
                alignItems="center"
            >
                {/* 本場カウンター */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>本場:</Typography>
                    <IconButton
                        size="small"
                        onClick={() => handleHonbaChange(-1)}
                    >
                        <RemoveIcon />
                    </IconButton>
                    <Typography>{honba}</Typography>
                    <IconButton
                        size="small"
                        onClick={() => handleHonbaChange(1)}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>

                {/* ツモ/ロン切り替えボタン */}
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

                {/* クリアボタン */}
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

    // 鳴き牌の表示
    const renderCalledTile = (calledTile, index) => {
        return (
            <Box key={index} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover .actions': {
                    opacity: 1
                }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {calledTile.type === 'chii' ? 'チー' :
                            calledTile.type === 'pon' ? 'ポン' : 'カン'}:
                    </Typography>
                    {calledTile.tiles.map((tile, i) => (
                        <MahjongTile key={i} {...tile} />
                    ))}
                </Box>
                <Box className="actions" sx={{
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    gap: 1
                }}>
                    <IconButton
                        size="small"
                        onClick={() => handleEditCalledTile(index)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDeleteCalledTile(index)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        );
    };

    const maxHandTiles = calculateAvailableHandTiles();

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

                {/* 鳴き牌表示エリア */}
                <Box sx={{ my: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1">
                            鳴き牌
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setEditingCalledTileIndex(-1);
                                setCurrentCallType('');
                                setIsCalledTileModalOpen(true);
                            }}
                            sx={{ ml: 1 }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            minHeight: '60px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}
                    >
                        {calledTiles.length > 0 ? (
                            calledTiles.map((calledTile, index) => renderCalledTile(calledTile, index))
                        ) : (
                            <Typography color="text.secondary">
                                鳴き牌はありません
                            </Typography>
                        )}
                    </Paper>
                </Box>

                {/* 手牌表示エリア */}
                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        手牌（{maxHandTiles}枚）
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
                                クリックして手牌を選択してください（{maxHandTiles}枚）
                            </Typography>
                        )}
                    </Paper>

                    {/* 上がり牌表示エリア */}
                    <Box sx={{ mt: 2 }}>
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
                </Box>
            </Paper>

            {/* モーダル群 */}
            {/* 手牌選択モーダル */}
            <TileSelectModal
                open={isHandModalOpen}
                onClose={() => setIsHandModalOpen(false)}
                selectedTiles={tempHandTiles.length > 0 ? tempHandTiles : handTiles}
                onTileSelect={setTempHandTiles}
                onSave={(tiles) => {
                    handleHandTilesUpdate(tiles);
                    setTempHandTiles([]);
                    setIsHandModalOpen(false);
                }}
                maxTiles={maxHandTiles}
                title={`手牌を選択（${maxHandTiles}枚）`}
                allowMultiple={true}
                autoClose={false}
            />

            {/* 上がり牌選択モーダル */}
            <TileSelectModal
                open={isWinningTileModalOpen}
                onClose={() => {
                    setIsWinningTileModalOpen(false);
                    setTempWinningTile(null);
                }}
                selectedTiles={tempWinningTile ? [tempWinningTile] : winningTile ? [winningTile] : []}
                onTileSelect={(tiles) => {
                    const selectedTile = tiles[0] || null;
                    console.log('Temporary winning tile selected:', selectedTile);
                    setTempWinningTile(selectedTile);
                }}
                onSave={(tiles) => {
                    console.log('Saving winning tile and calculating score');
                    handleWinningTileSelect(tiles);
                    setTempWinningTile(null);
                    setIsWinningTileModalOpen(false);
                }}
                maxTiles={1}
                title={`${isTsumo ? "ツモ" : "ロン"}牌を選択`}
                allowMultiple={false}
                autoClose={false}
            />

            {/* 鳴き牌選択モーダル */}
            <TileSelectModal
                open={isCalledTileModalOpen}
                onClose={() => {
                    setIsCalledTileModalOpen(false);
                    setEditingCalledTileIndex(-1);
                    setTempCalledTiles([]);
                }}
                onTileSelect={setTempCalledTiles}
                onSave={(tiles) => {
                    handleCalledTilesUpdate(tiles);
                    setTempCalledTiles([]);
                    setEditingCalledTileIndex(-1);
                    setIsCalledTileModalOpen(false);
                }}
                selectedTiles={tempCalledTiles.length > 0 ? tempCalledTiles :
                    editingCalledTileIndex >= 0 ? calledTiles[editingCalledTileIndex].tiles : []}
                maxTiles={currentCallType === 'kan' ? 4 : 3}
                title={editingCalledTileIndex >= 0 ? "鳴き牌を編集" : "鳴き牌を選択"}
                allowMultiple={true}
                autoClose={false}
                showCallType={true}
                onCallTypeChange={handleCallTypeChange}
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
