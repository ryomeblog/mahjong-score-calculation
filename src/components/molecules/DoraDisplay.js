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
        setTempDoraTiles([...doraTiles]);
        setIsDoraModalOpen(true);
    };

    const handleOpenUradoraModal = () => {
        setTempUradoraTiles([...uradoraTiles]);
        setIsUradoraModalOpen(true);
    };

    // モーダルを閉じる時の処理
    const handleCloseDoraModal = (save = false) => {
        if (save && tempDoraTiles.length <= HAND_LIMITS.MAX_DORA_INDICATORS) {
            onDoraTileSelect(tempDoraTiles);
        }
        setIsDoraModalOpen(false);
    };

    const handleCloseUradoraModal = (save = false) => {
        if (save && tempUradoraTiles.length <= HAND_LIMITS.MAX_URADORA) {
            onUradoraTileSelect(tempUradoraTiles);
        }
        setIsUradoraModalOpen(false);
    };

    // 一時的な選択状態の更新
    const handleTempDoraUpdate = (tiles) => {
        setTempDoraTiles(tiles);
    };

    const handleTempUradoraUpdate = (tiles) => {
        setTempUradoraTiles(tiles);
    };

    // 選択済み牌の表示エリア
    const renderTileArea = (title, tiles, emptyMessage, onClick) => (
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
                    tiles.map((tile, index) => (
                        <MahjongTile
                            key={index}
                            {...tile}
                        />
                    ))
                ) : (
                    <Typography color="text.secondary">
                        {emptyMessage}
                    </Typography>
                )}
            </Paper>
        </Box>
    );

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
                onClose={() => handleCloseDoraModal(false)}
                selectedTiles={tempDoraTiles}
                onTileSelect={handleTempDoraUpdate}
                onSave={() => handleCloseDoraModal(true)}
                maxTiles={HAND_LIMITS.MAX_DORA_INDICATORS}
                title="ドラ表示牌を選択"
                allowMultiple={true}
            />

            {/* 裏ドラ選択モーダル */}
            <TileSelectModal
                open={isUradoraModalOpen}
                onClose={() => handleCloseUradoraModal(false)}
                selectedTiles={tempUradoraTiles}
                onTileSelect={handleTempUradoraUpdate}
                onSave={() => handleCloseUradoraModal(true)}
                maxTiles={HAND_LIMITS.MAX_URADORA}
                title="裏ドラ表示牌を選択"
                allowMultiple={true}
            />
        </Box>
    );
};

export default DoraDisplay;