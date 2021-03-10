/**
 * Created by buddy on 2020-07-20.
 */
import styled from 'styled-components';
import { RowBetween } from '@/components/Row';
import React from 'react';
import { X } from 'react-feather';

export default styled.div`
	color: ${({ theme }) => theme.main1};
`;

export const StyledBetaTip = styled.div`
	color: ${({ theme }) => theme.main1};
	background: ${({ theme }) => theme.background3};
	font-size: 14px;
	height: 2rem;
	display: flex;
	align-items: center;
	padding: 0 1rem;
	border-radius: 1rem;
	cursor: pointer;
`;

const Close = styled(X)`
	color: ${({ theme }) => theme.word3};
`;

export const BetaTip = () => (
	<StyledBetaTip>
		<RowBetween>
			<div>该项目尚处于beta阶段，使用需自行承担风险</div>
			<Close size={16} />
		</RowBetween>
	</StyledBetaTip>
);
