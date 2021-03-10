/**
 * Created by buddy on 2020-07-24.
 */
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, Chip } from '@material-ui/core';
import Row, { AutoRow } from '@/components/Row';
import { AutoColumn } from '@/components/Column';
import { SwapContext } from '@/pages/Swap/context';
import { observer } from 'mobx-react';
import { CursorPointer } from '@/theme';
import setting from '@/modules/setting';
import { ChevronDown, ChevronUp } from 'react-feather';
import wallet from '@/modules/wallet';

const Card = styled.div`
	padding: 20px;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.background1};
	font-size: 12px;
	color: ${({ theme }) => theme.word1};
	overflow: hidden;
`;

const OuterCard = styled(Card)`
	padding-bottom: 30px;
`;

const InnerCard = styled(Card)`
	background-color: ${({ theme }) => theme.background2};
	margin-top: -20px;
`;

const StyledText = styled.div`
	line-height: 1.6;
	margin-bottom: 6px;
`;

const StyledP = styled.p`
	display: flex;
	align-items: center;
	font-size: 14px;
`;

const TabOption = styled(Button)<any>`
	background: ${({ theme, isSelected }) => (isSelected ? theme.main1 : 'transparent')} !important;
	&& {
		height: 28px;
		border: 1px solid ${({ theme, isSelected }) => (isSelected ? theme.main1 : theme.word4)};
		color: #fff;
		font-size: 12px;
		margin-right: 10px;
		text-transform: unset;
		border-radius: 14px;
		padding: 4px 10px;
	}

	&:active {
		border-color: ${({ theme }) => theme.main1};
	}
	&:hover {
		border-color: ${({ isSelected, theme }) => !isSelected && '#fff'} !important;
	}
`;

const InputWrapper = styled.div`
	width: 120px;
	height: 30px;
	border-radius: 15px;
	border: 1px solid ${({ theme }) => theme.word4};
	&:active {
		border-color: ${({ theme }) => theme.main1};
	}
	&:hover {
		border-color: #fff;
	}
	padding: 0 12px;
	display: flex;
	align-items: center;
`;

const Input = styled.input`
	background: transparent;
	flex: 1;
	outline: none;
	border: none;
	width: 100%;
	height: 100%;
	color: #fff;
`;

const DeadlineInput = styled(Input)`
	text-align: right;
`;

const SlippageInput = styled(Input)`
	&:focus {
		text-align: right;
	}
`;

const SwapSetting = observer(() => {
	const { state } = useContext(SwapContext);

	const inputTag = state.focusType;
	const outputTag = state.focusType === 'input' ? 'output' : 'input';
	const input = state[inputTag];
	const output = state[outputTag];

	const [show, setShow] = useState(false);

	if (!wallet.isInstalled) {
		return null;
	}

	// if (!wallet.isLogin) {
	// 	return <StyledP style={{ minWidth: 120, justifyContent: 'center' }}>Cyano Wallet Not Connected.</StyledP>;
	// }

	if (!state.input || !state.output) {
		return <StyledP style={{ minWidth: 120, justifyContent: 'center' }}>Select a token to continue.</StyledP>;
	}

	if (!state.inputValue || !state.outputValue) {
		return <StyledP style={{ minWidth: 120, justifyContent: 'center' }}>Enter a value to continue.</StyledP>;
	}

	return (
		<div>
			<CursorPointer>
				<AutoRow
					justify={'center'}
					onClick={() => {
						setShow(c => !c);
					}}
				>
					<StyledP>
						<Row style={{ minWidth: 120, justifyContent: 'center', color: 'rgb(0, 162, 180)' }}>
							{show ? 'Hide' : 'Advanced'} Details
						</Row>
						{show ? (
							<ChevronUp size={20} color="rgb(0, 162, 180)" />
						) : (
							<ChevronDown size={20} color="rgb(0, 162, 180)" />
						)}
					</StyledP>
				</AutoRow>
			</CursorPointer>

			{show && (
				<>
					<OuterCard>
						<StyledText>
							You are {state.focusType === 'input' ? 'selling' : 'buying'}&nbsp;&nbsp;
							<Chip size="small" label={state.inputValue + ' ' + input?.name} />
							&nbsp;&nbsp;for at {state.focusType === 'input' ? 'least' : 'most'} &nbsp;&nbsp;
							<Chip size="small" label={`${state.limitNum} ${output?.name}`} />
						</StyledText>
						<StyledText>
							{`Expected price slippage`}&nbsp;&nbsp;
							<Chip size="small" label="<0.01%" />
						</StyledText>
					</OuterCard>
					<InnerCard>
						<AutoColumn gap="md">
							<div>Limit additional price slippage</div>
							<AutoRow gap="sm">
								{[0.001, 0.005, 0.01].map(rate => (
									<TabOption
										onClick={() => {
											setting.setSlippage(rate);
										}}
										key={rate}
										isSelected={rate === setting.slippage}
									>
										{rate * 100}%
									</TabOption>
								))}

								<InputWrapper>
									<SlippageInput
										type="text"
										placeholder="Custom"
										onChange={(e: any) => {
											if (!/^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) {
												e.target.value = state.slippage;
											} else {
												setting.setSlippage(e.target.value / 100);
											}
										}}
									/>
									&nbsp;%
								</InputWrapper>
							</AutoRow>
							<div>Set swap deadline (minutes from now)</div>
							<InputWrapper>
								<DeadlineInput
									type="text"
									placeholder="Deadline"
									value={setting.deadline}
									onChange={(e: any) => {
										if (!/^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) {
											e.target.value = state.deadline;
										} else {
											setting.setDeadline(e.target.value);
										}
									}}
								/>
							</InputWrapper>
						</AutoColumn>
					</InnerCard>
				</>
			)}
		</div>
	);
});

export default SwapSetting;
