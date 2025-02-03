import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

/**
 * スタイル付きのPaperコンポーネント
 */
const TileWrapper = styled(Paper)(({ theme }) => ({
    width: '30px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(0.5),
    cursor: 'pointer',
    fontFamily: '"Noto Sans JP", sans-serif',
    fontWeight: 'bold',
    position: 'relative',
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
    },
    '&.selected': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    }
}));

/**
 * 麻雀牌を表示するコンポーネント
 * @param {Object} props
 * @param {string} props.suit - 牌の種類（m:萬子, p:筒子, s:索子, z:字牌）
 * @param {number} props.number - 数字（1-9）または字牌の種類（1-7）
 * @param {boolean} props.isRed - 赤ドラフラグ
 * @param {boolean} props.selected - 選択状態
 * @param {function} props.onClick - クリックハンドラ
 */
const MahjongTile = ({ suit, number, isRed = false, selected = false, onClick }) => {
    // 牌の表示文字を決定
    const getTileDisplay = () => {
        if (suit === 'z') {
            // 字牌の場合
            if (number <= 4) {
                // 風牌
                return ['東', '南', '西', '北'][number - 1];
            } else {
                // 三元牌
                return ['白', '發', '中'][number - 5];
            }
        }
        // 数牌の場合
        return number;
    };

    // スーツの表示文字を決定
    const getSuitDisplay = () => {
        if (suit === 'z') return '';

        const suitCharacters = {
            'm': '萬',
            'p': '筒',
            's': '索'
        };
        return suitCharacters[suit] || '';
    };

    return (
        <TileWrapper
            elevation={2}
            className={selected ? 'selected' : ''}
            onClick={onClick}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: isRed ? 'red' : 'inherit'
            }}>
                <Box sx={{ lineHeight: 1.2 }}>
                    {getTileDisplay()}
                </Box>
                {suit !== 'z' && (
                    <Box sx={{
                        fontSize: '0.6rem',
                        lineHeight: 1
                    }}>
                        {getSuitDisplay()}
                    </Box>
                )}
            </Box>
        </TileWrapper>
    );
};

export default MahjongTile;