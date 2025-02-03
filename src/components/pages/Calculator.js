import { Box, Container } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { calculateScore as calculateHandScore } from '../../utils/calculators/scoreCalculator';
import HandInput from '../organisms/HandInput';
import ScoreDisplay from '../organisms/ScoreDisplay';

/**
 * 点数計算メインページコンポーネント
 */
const Calculator = () => {
    // 手牌の状態を管理
    const [handState, setHandState] = useState({
        handTiles: [],          // 手牌（13枚）
        winningTile: null,      // 上がり牌
        doraTiles: [],          // ドラ表示牌
        uradoraTiles: [],       // 裏ドラ表示牌
        seatWind: 1,           // 自風
        roundWind: 1,          // 場風
        isRiichi: false,       // リーチ状態
        isTsumo: false         // ツモあがりフラグ
    });

    // 点数計算結果を管理
    const [scoreResult, setScoreResult] = useState(null);

    // 手牌の状態が更新されたときの処理
    const handleHandStateUpdate = useCallback((newState) => {
        // 状態を更新
        setHandState(newState);

        // 手牌が揃っている場合（13枚＋上がり牌）のみ点数計算を行う
        if (newState.handTiles.length === 13 && newState.winningTile) {
            // 計算用に14枚の手牌を作成（手牌＋上がり牌）
            const fullHandTiles = [...newState.handTiles];
            if (newState.winningTile) {
                fullHandTiles.push(newState.winningTile);
            }

            // 点数を計算
            const result = calculateHandScore({
                handTiles: fullHandTiles,
                isRiichi: newState.isRiichi,
                isTsumo: newState.isTsumo,
                seatWind: newState.seatWind,
                roundWind: newState.roundWind,
                doraTiles: newState.doraTiles || [],
                uradoraTiles: newState.uradoraTiles || []
            });

            setScoreResult(result);
        } else {
            setScoreResult(null);
        }
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{
                py: 4,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {/* 手牌入力セクション */}
                <HandInput
                    {...handState}
                    onUpdate={handleHandStateUpdate}
                />

                {/* 点数表示セクション */}
                {scoreResult && (
                    <ScoreDisplay
                        {...scoreResult}
                        isTsumo={handState.isTsumo}
                    />
                )}
            </Box>
        </Container>
    );
};

export default Calculator;