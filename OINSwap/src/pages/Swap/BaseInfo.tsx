/**
 * Created by buddy on 2020-07-23.
 */
import { RowBetween } from '@/components/Row';
import { AutoColumn } from '@/components/Column';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { SwapContext } from '@/pages/Swap/context';
import { CursorPointer } from '@/theme';

const StyledText = styled.div`
	display: flex;
	align-items: center;
	color: ${({ theme }) => theme.word3};
	font-size: 12px;
`;

export default observer(() => {
	const { state } = useContext(SwapContext);
	return (
		<AutoColumn gap="sm">
			<RowBetween>
				<StyledText>Exchange Rate</StyledText>
				<CursorPointer>
					<StyledText
						onClick={() => {
							state.changeMode();
						}}
					>
						{state.exchangeRate}
					</StyledText>
				</CursorPointer>
			</RowBetween>
			{/*{setting.slippage !== 0.005 && (*/}
			{/*	<RowBetween>*/}
			{/*		<StyledText>Slippage Tolerance</StyledText>*/}
			{/*		<StyledText>{setting.slippage * 100}%</StyledText>*/}
			{/*	</RowBetween>*/}
			{/*)}*/}

			{/*<RowBetween>*/}
			{/*	<StyledText>*/}
			{/*		{state.focusType === 'input' ? 'Minimum received' : 'Maximum sold'}*/}
			{/*		<QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />*/}
			{/*	</StyledText>*/}
			{/*	<StyledText>*/}
			{/*		{state.limitNum}&nbsp;*/}
			{/*		{state.limitNum === '--' ? '' : state.focusType === 'input' ? state.output.name : state.input.name}*/}
			{/*	</StyledText>*/}
			{/*</RowBetween>*/}

			{/*<RowBetween>*/}
			{/*	<StyledText>*/}
			{/*		Price Impact*/}
			{/*		<QuestionHelper text="The difference between the market price and estimated price due to trade size." />*/}
			{/*	</StyledText>*/}
			{/*	<StyledText>{setting.slippage * 100}%</StyledText>*/}
			{/*</RowBetween>*/}
			{/*<RowBetween>*/}
			{/*	<StyledText>*/}
			{/*		Liquidity Provider Fee*/}
			{/*		<QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />*/}
			{/*	</StyledText>*/}
			{/*	<StyledText>{setting.slippage * 100}%</StyledText>*/}
			{/*</RowBetween>*/}
		</AutoColumn>
	);
});
