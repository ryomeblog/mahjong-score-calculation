import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from '@mui/material';
import React from 'react';
import { WINDS } from '../../constants/tiles';

/**
 * 風選択用のコンポーネント
 * @param {Object} props
 * @param {number} props.seatWind - 自風（1-4: 東南西北）
 * @param {number} props.roundWind - 場風（1-4: 東南西北）
 * @param {function} props.onSeatWindChange - 自風変更ハンドラ
 * @param {function} props.onRoundWindChange - 場風変更ハンドラ
 */
const WindSelector = ({
    seatWind,
    roundWind,
    onSeatWindChange,
    onRoundWindChange
}) => {
    // 風の表示名マッピング
    const windNames = {
        [WINDS.EAST]: '東',
        [WINDS.SOUTH]: '南',
        [WINDS.WEST]: '西',
        [WINDS.NORTH]: '北'
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: 'center',
            p: 2
        }}>
            {/* 場風選択 */}
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="round-wind-label">場風</InputLabel>
                    <Select
                        labelId="round-wind-label"
                        id="round-wind"
                        value={roundWind}
                        label="場風"
                        onChange={(e) => onRoundWindChange(e.target.value)}
                    >
                        {Object.entries(WINDS).map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                                {windNames[value]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* 自風選択 */}
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="seat-wind-label">自風</InputLabel>
                    <Select
                        labelId="seat-wind-label"
                        id="seat-wind"
                        value={seatWind}
                        label="自風"
                        onChange={(e) => onSeatWindChange(e.target.value)}
                    >
                        {Object.entries(WINDS).map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                                {windNames[value]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* 風の説明表示 */}
            <Typography variant="body2" color="text.secondary">
                {`${windNames[roundWind]}場 ${windNames[seatWind]}家`}
            </Typography>
        </Box>
    );
};

export default WindSelector;