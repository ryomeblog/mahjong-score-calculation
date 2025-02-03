import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
} from '@mui/material';
import React from 'react';
import TileSelector from './TileSelector';

/**
 * 牌選択モーダルコンポーネント
 * @param {Object} props
 * @param {boolean} props.open - モーダルの表示状態
 * @param {function} props.onClose - モーダルを閉じる時のハンドラ
 * @param {function} props.onSave - 保存ボタンクリック時のハンドラ
 * @param {Array} props.selectedTiles - 選択された牌の配列
 * @param {function} props.onTileSelect - 牌選択時のハンドラ
 * @param {number} props.maxTiles - 選択可能な最大牌数
 * @param {string} props.title - モーダルのタイトル
 * @param {boolean} props.allowMultiple - 同じ牌を複数回選択可能にするかどうか
 */
const TileSelectModal = ({
    open,
    onClose,
    onSave,
    selectedTiles = [],
    onTileSelect,
    maxTiles = 14,
    title = '牌を選択',
    allowMultiple = false
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%', mt: 2 }}>
                    <TileSelector
                        selectedTiles={selectedTiles}
                        onTileClick={onTileSelect}
                        maxTiles={maxTiles}
                        allowMultiple={allowMultiple}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={1}>
                    <Button
                        onClick={onClose}
                        color="inherit"
                        variant="outlined"
                    >
                        キャンセル
                    </Button>
                    <Button
                        onClick={onSave || onClose}
                        color="primary"
                        variant="contained"
                    >
                        完了
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default TileSelectModal;