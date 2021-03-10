/**
 * Created by buddy on 2020-07-23.
 */
import React, { useContext } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import Column, { AutoColumn } from '@/components/Column';
import { RowBetween } from '@/components/Row';
import { RemoveLiquidity } from '@/pages/Pool/RemoveLiquidity/context';
import { CursorPointer } from '@/theme';
import { NATIVE_TOKEN } from '@/constants';

const StyledText = styled.div`
	color: ${({ theme }) => theme.word3};
	font-size: 12px;
`;

const BaseInfo = observer(({ info }) => {
	const { state } = useContext(RemoveLiquidity);

	return (
		<Column>
			<AutoColumn gap="sm">
				<RowBetween>
					<StyledText>ExchangeRate</StyledText>
					<StyledText
						onClick={() => {
							state.changeMode();
						}}
					>
						{state.tokenRate}
					</StyledText>
				</RowBetween>
				<RowBetween>
					<StyledText>Current Pool Size</StyledText>
					<StyledText>{state.poolText}</StyledText>
				</RowBetween>
				<RowBetween>
					<StyledText>Your Pool Share</StyledText>
					<StyledText>{state.poolRate}</StyledText>
				</RowBetween>
				<RowBetween>
					<StyledText>Your Position</StyledText>
					<StyledText>{state.positionText}</StyledText>
				</RowBetween>
			</AutoColumn>
		</Column>
	);
});

export default BaseInfo;
