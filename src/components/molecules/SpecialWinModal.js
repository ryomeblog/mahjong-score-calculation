import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Stack,
} from '@mui/material';
import React from 'react';

// 特別上がりの定義
const SPECIAL_WINS = [
    { id: 'isIppatsu', name: '一発', han: 1 },
    { id: 'isChankan', name: '槍槓', han: 1 },
    { id: 'isRinshan', name: '嶺上開花', han: 1 },
    { id: 'isHoutei', name: '河底撈魚', han: 1 },
    { id: 'isHaitei', name: '海底撈月', han: 1 },
    { id: 'isChihou', name: '地和', han: 13 },
    { id: 'isTenhou', name: '天和', han: 13 },
];

/**
 * 特別上がり選択モーダル
 * @param {Object} props
 * @param {boolean} props.open - モーダルの表示状態
 * @param {function} props.onClose - モーダルを閉じる時のハンドラ
 * @param {Object} props.selectedWins - 選択された特別上がりの状態
 * @param {function} props.onUpdate - 更新時のハンドラ
 */
const SpecialWinModal = ({
    open,
    onClose,
    selectedWins,
    onUpdate
}) => {
    // チェックボックスの状態を更新
    const handleChange = (winId) => {
        onUpdate({
            ...selectedWins,
            [winId]: !selectedWins[winId]
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                特別上がり選択
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <Stack spacing={1}>
                        {SPECIAL_WINS.map(win => (
                            <FormControlLabel
                                key={win.id}
                                control={
                                    <Checkbox
                                        checked={selectedWins[win.id] || false}
                                        onChange={() => handleChange(win.id)}
                                        color="primary"
                                    />
                                }
                                label={`${win.name}（${win.han}翻）`}
                            />
                        ))}
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                >
                    閉じる
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// 他のコンポーネントでも使えるように定義を公開
export { SPECIAL_WINS };
export default SpecialWinModal;