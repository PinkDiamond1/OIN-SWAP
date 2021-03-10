/**
 * Created by buddy on 2020-07-23.
 */
import React, { useContext } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import Column, { AutoColumn } from '@/components/Column';
import { RowBetween } from '@/components/Row';
import { AddLiquidityContext } from '@/pages/Pool/AddLiquidity/context';
import { CursorPointer } from '@/theme';

const StyledText = styled.div`
	color: ${({ theme }) => theme.word3};
	font-size: 12px;
`;

const BaseInfo = observer(() => {
	const { state } = useContext(AddLiquidityContext);

	return (
		<Column>
			<AutoColumn gap="sm">
				<RowBetween>
					<StyledText>ExchangeRate</StyledText>
					<CursorPointer>
						<StyledText
							onClick={() => {
								state.changeMode();
							}}
						>
							{state.tokenRate}
						</StyledText>
					</CursorPointer>
				</RowBetween>
				<RowBetween>
					<StyledText>Current Pool Size</StyledText>
					<StyledText>{state.poolText}</StyledText>
				</RowBetween>
				<RowBetween>
					<StyledText>Your Pool Share</StyledText>
					<StyledText>{state.poolRate}</StyledText>
				</RowBetween>
			</AutoColumn>
		</Column>
	);
});

export default BaseInfo;
