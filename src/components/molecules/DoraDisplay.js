import { Box, FormControlLabel, Paper, Switch, Typography } from '@mui/material';
import React, { useState } from 'react';
import { HAND_LIMITS } from '../../constants/tiles';
import MahjongTile from '../atoms/MahjongTile';
import TileSelectModal from './TileSelectModal';

/**
 * ドラ表示用のコンポーネント
 * @param {Object} props
 * @param {Array} props.doraTiles - ドラ表示牌の配列
 * @param {Array} props.uradoraTiles - 裏ドラ表示牌の配列
 * @param {boolean} props.isRiichi - リーチ状態
 * @param {function} props.onDoraTileSelect - ドラ表示牌選択時のハンドラ
 * @param {function} props.onUradoraTileSelect - 裏ドラ表示牌選択時のハンドラ
 * @param {function} props.onRiichiChange - リーチ状態変更時のハンドラ
 */
const DoraDisplay = ({
    doraTiles = [],
    uradoraTiles = [],
    isRiichi = false,
    onDoraTileSelect,
    onUradoraTileSelect,
    onRiichiChange
}) => {
    // モーダルの状態管理
    const [isDoraModalOpen, setIsDoraModalOpen] = useState(false);
    const [isUradoraModalOpen, setIsUradoraModalOpen] = useState(false);
    // 一時的な選択状態の管理
    const [tempDoraTiles, setTempDoraTiles] = useState([]);
    const [tempUradoraTiles, setTempUradoraTiles] = useState([]);

    // モーダルを開く時の処理
    const handleOpenDoraModal = () => {
        const initialDora = [...doraTiles];
        setTempDoraTiles(initialDora);
        setIsDoraModalOpen(true);
    };

    const handleOpenUradoraModal = () => {
        const initialUradora = [...uradoraTiles];
        setTempUradoraTiles(initialUradora);
        setIsUradoraModalOpen(true);
    };

    // モーダルを閉じる時の処理
    const handleCloseDoraModal = () => {
        setIsDoraModalOpen(false);
        setTempDoraTiles([]);
    };

    const handleCloseUradoraModal = () => {
        setIsUradoraModalOpen(false);
        setTempUradoraTiles([]);
    };


    // 一時的な選択状態の更新
    const handleTempDoraUpdate = (tiles) => {
        console.log('Updating temp dora tiles:', tiles); // デバッグ用
        const updatedTiles = [...tiles];
        setTempDoraTiles(updatedTiles);
    };

    const handleTempUradoraUpdate = (tiles) => {
        console.log('Updating temp uradora tiles:', tiles); // デバッグ用
        const updatedTiles = [...tiles];
        setTempUradoraTiles(updatedTiles);
    };

    // 選択済み牌の表示エリア
    const renderTileArea = (title, tiles, emptyMessage, onClick) => {
        return (
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {title}
                </Typography>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        alignItems: 'center',
                        cursor: 'pointer',
                        minHeight: '50px'
                    }}
                    onClick={onClick}
                >
                    {tiles.length > 0 ? (
                        tiles.map((tile, index) => {
                            return (
                                <MahjongTile
                                    key={index}
                                    {...tile}
                                />
                            )
                        })
                    ) : (
                        <Typography color="text.secondary">
                            {emptyMessage}
                        </Typography>
                    )}
                </Paper>
            </Box>
        )
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* 通常ドラ */}
            {renderTileArea(
                'ドラ表示牌',
                doraTiles,
                'クリックしてドラ表示牌を選択',
                handleOpenDoraModal
            )}

            {/* リーチ切り替えスイッチ */}
            <FormControlLabel
                control={
                    <Switch
                        checked={isRiichi}
                        onChange={(e) => onRiichiChange(e.target.checked)}
                        name="riichi"
                    />
                }
                label="リーチ"
            />

            {/* 裏ドラ（リーチ時のみ表示） */}
            {isRiichi && renderTileArea(
                '裏ドラ表示牌',
                uradoraTiles,
                'クリックして裏ドラ表示牌を選択',
                handleOpenUradoraModal
            )}

            {/* ドラ選択モーダル */}
            <TileSelectModal
                open={isDoraModalOpen}
                onClose={handleCloseDoraModal}
                selectedTiles={tempDoraTiles}
                onTileSelect={(tiles) => {
                    console.log('Dora tile selected:', tiles); // デバッグ用
                    handleTempDoraUpdate(tiles);
                }}
                onSave={(tiles) => {
                    console.log('Saving dora tiles:', tiles); // デバッグ用
                    onDoraTileSelect(tiles);
                    setTempDoraTiles([]);
                    setIsDoraModalOpen(false);
                }}
                maxTiles={HAND_LIMITS.MAX_DORA_INDICATORS}
                title="ドラ表示牌を選択"
                allowMultiple={true}
            />

            {/* 裏ドラ選択モーダル */}
            <TileSelectModal
                open={isUradoraModalOpen}
                onClose={handleCloseUradoraModal}
                selectedTiles={tempUradoraTiles}
                onTileSelect={(tiles) => {
                    console.log('Uradora tile selected:', tiles); // デバッグ用
                    handleTempUradoraUpdate(tiles);
                }}
                onSave={(tiles) => {
                    console.log('Saving uradora tiles:', tiles); // デバッグ用
                    onUradoraTileSelect(tiles);
                    setTempUradoraTiles([]);
                    setIsUradoraModalOpen(false);
                }}
                maxTiles={HAND_LIMITS.MAX_URADORA}
                title="裏ドラ表示牌を選択"
                allowMultiple={true}
            />
        </Box>
    );
};

export default DoraDisplay;