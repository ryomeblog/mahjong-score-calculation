import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
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
 * @param {boolean} props.autoClose - 牌選択時に自動でモーダルを閉じるかどうか
 * @param {boolean} props.showCallType - 鳴きタイプの選択を表示するかどうか
 * @param {function} props.onCallTypeChange - 鳴きタイプが変更された時のハンドラ
 */
const TileSelectModal = ({
    open,
    onClose,
    onSave,
    selectedTiles = [],
    onTileSelect,
    maxTiles = 14,
    title = '牌を選択',
    allowMultiple = false,
    autoClose = false,
    showCallType = false,
    onCallTypeChange
}) => {
    // 選択中の牌の状態
    const [currentTiles, setCurrentTiles] = useState([]);

    // モーダルが開かれたときに初期値を設定
    React.useEffect(() => {
        if (open) {
            setCurrentTiles(selectedTiles);
        }
    }, [open, selectedTiles]);

    // 鳴きタイプの状態
    const [callType, setCallType] = useState('');

    // 鳴きタイプの変更ハンドラ
    const handleCallTypeChange = (event, newCallType) => {
        setCallType(newCallType);
        if (onCallTypeChange) {
            onCallTypeChange(newCallType);
        }
    };

    // クリアボタンのハンドラ
    const handleClear = () => {
        setCurrentTiles([]);
    };

    // 牌選択のハンドラ
    const handleTileSelect = (tiles) => {
        setCurrentTiles(tiles);
        if (autoClose) {
            handleSave(tiles);
        }
    };

    // 完了ボタンのハンドラ
    const handleSave = (tiles = currentTiles) => {
        onTileSelect(tiles);
        if (onSave) {
            onSave(tiles);
        }
        onClose();
    };

    // キャンセルボタンのハンドラ
    const handleCancel = () => {
        setCurrentTiles(selectedTiles);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{title}</Typography>
                <IconButton onClick={handleClear} size="small">
                    <DeleteIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {showCallType && (
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                        <ToggleButtonGroup
                            value={callType}
                            exclusive
                            onChange={handleCallTypeChange}
                            aria-label="鳴きタイプ"
                        >
                            <ToggleButton value="chii" aria-label="チー">
                                チー
                            </ToggleButton>
                            <ToggleButton value="pon" aria-label="ポン">
                                ポン
                            </ToggleButton>
                            <ToggleButton value="kan" aria-label="カン">
                                カン
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                )}
                <Box sx={{ width: '100%', mt: 2 }}>
                    <TileSelector
                        selectedTiles={currentTiles}
                        onTileClick={handleTileSelect}
                        maxTiles={maxTiles}
                        allowMultiple={allowMultiple}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" spacing={1}>
                    <Button
                        onClick={handleCancel}
                        color="inherit"
                        variant="outlined"
                    >
                        キャンセル
                    </Button>
                    <Button
                        onClick={() => handleSave()}
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