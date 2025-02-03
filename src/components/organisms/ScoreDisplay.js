import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import React from 'react';

/**
 * 点数表示用のコンポーネント
 * @param {Object} props
 * @param {Array} props.yakuList - 成立した役のリスト
 * @param {number} props.han - 飜数
 * @param {number} props.fu - 符数
 * @param {number} props.total - 合計点数
 * @param {number} props.paymentFromEach - ツモ時の支払い点数（各自）
 * @param {number} props.paymentFromDealer - ツモ時の親からの支払い点数
 * @param {number} props.paymentFromOthers - ツモ時の子からの支払い点数
 * @param {boolean} props.isTsumo - ツモ和了かどうか
 */
const ScoreDisplay = ({
    yakuList = [],
    han = 0,
    fu = 0,
    total = 0,
    paymentFromEach,
    paymentFromDealer,
    paymentFromOthers,
    isTsumo = false
}) => {
    // 点数の表示形式を整える
    const formatScore = (score) => {
        return score ? score.toLocaleString() : '0';
    };

    // 役満かどうかを判定
    const isYakuman = han >= 13;
    // 満貫以上かどうかを判定
    const isLimit = han >= 5 || (han >= 4 && fu >= 40) || (han >= 3 && fu >= 70);

    // 点数の種類を判定
    const getScoreType = () => {
        if (isYakuman) return '役満';
        if (han >= 11) return '三倍満';
        if (han >= 8) return '倍満';
        if (han >= 6) return '跳満';
        if (isLimit) return '満貫';
        return '通常';
    };

    return (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                点数計算結果
            </Typography>

            {/* 役一覧 */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    成立した役
                </Typography>
                <List dense>
                    {yakuList.map((yaku, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={yaku.name}
                                secondary={`${yaku.han}飜`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 基本情報 */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                    {getScoreType()}
                </Typography>
                {!isYakuman && (
                    <Typography variant="body1">
                        {`${han}飜${isLimit ? '' : `${fu}符`}`}
                    </Typography>
                )}
            </Box>

            {/* 点数詳細 */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    点数
                </Typography>

                {isTsumo ? (
                    // ツモ和了の場合
                    <Box>
                        {paymentFromEach ? (
                            // 親のツモ
                            <Typography variant="body1">
                                {`${formatScore(paymentFromEach)}点オール`}
                            </Typography>
                        ) : (
                            // 子のツモ
                            <Box>
                                <Typography variant="body1">
                                    {`親: ${formatScore(paymentFromDealer)}点`}
                                </Typography>
                                <Typography variant="body1">
                                    {`子: ${formatScore(paymentFromOthers)}点`}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
                    // ロン和了の場合
                    <Typography variant="body1">
                        {`${formatScore(total)}点`}
                    </Typography>
                )}
            </Box>

            {/* 合計点数 */}
            <Box sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                p: 2,
                borderRadius: 1
            }}>
                <Typography variant="h6">
                    {`合計: ${formatScore(total)}点`}
                </Typography>
            </Box>
        </Paper>
    );
};

export default ScoreDisplay;