/**
 * Created by buddy on 2020-07-20.
 */
import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import AppBody from '@/pages/AppBody';
import { AutoColumn } from '@/components/Column';
import Row, { AutoRow } from '@/components/Row';
import { SubmitButton, WorkWrapper } from '@/components/common';
import InputBox, { RecipientInput } from '@/components/InputBox';
import { SwapContext } from '@/pages/Swap/context';
import Swap from '@/modules/swap';
import BaseInfo from './BaseInfo';
import Updater from './updater';
import SwapSetting from '@/pages/Swap/SwapSetting';
import ErrorBox from '@/pages/ErrorBox';
import { StyledChevronsDown } from '@/components/Icon';
import { IconButton } from '@material-ui/core';
import { Tips } from '@/constants';
import { withLimitFn } from '@/utils';
import wallet from '@/modules/wallet';
import tokensModule from '@/modules/tokens';
import SwapTokenWarning from '@/components/Modal/SwapTokenWarning';

const SendBtn = styled.div`
	position: absolute;
	right: 0;
	color: ${({ theme }) => theme.main1};
	cursor: pointer;
	font-size: 14px;
	&:hover {
		text-decoration: underline;
	}
`;

const ReactiveSendBtn = observer(() => {
	const { state } = useContext(SwapContext);

	return (
		!state.isSendMode && (
			<SendBtn
				onClick={() => {
					state.setSendMode();
				}}
			>
				+ send (optional)
			</SendBtn>
		)
	);
});

const SendView = observer(() => {
	const { state } = useContext(SwapContext);
	return (
		state.isSendMode && (
			<>
				<AutoRow justify={'center'} style={{ position: 'relative' }}>
					<StyledChevronsDown size={20} />
					<SendBtn
						onClick={() => {
							state.setSwapMode();
						}}
					>
						- remove send
					</SendBtn>
				</AutoRow>
				<RecipientInput
					onChange={e => {
						state.setRecipient(e);
					}}
				/>
			</>
		)
	);
});

const InputView = observer(() => {
	const { state } = useContext(SwapContext);

	const inner = state?.input?.hash;

	const tokens = useMemo(() => {
		const ts = JSON.parse(JSON.stringify(tokensModule.allCoins));
		ts.forEach(t => {
			if ([inner].includes(t.hash)) {
				t.isSelected = true;
			}
		});
		return ts;
		// eslint-disable-next-line
	}, [inner,tokensModule.allCoins]);

	return (
		<InputBox
			fieldText={`Input ${state.focusType === 'output' ? '(estimated)' : ''}`}
			token={state.input}
			value={state.inputValue}
			onInput={value => {
				state.onInput(value, 'input');
			}}
			onTokenSelected={token => {
				state.onTokenSelected(token, 'input');
			}}
			onMax={value => {
				state.onInput(value, 'input');
			}}
			tokens={tokens}
		/>
	);
});

const OutputView = observer(() => {
	const { state } = useContext(SwapContext);

	const outer = state?.output?.hash;

	const tokens = useMemo(() => {
		const ts = JSON.parse(JSON.stringify(tokensModule.allCoins));
		ts.forEach(t => {
			if ([outer].includes(t.hash)) {
				t.isSelected = true;
			}
		});
		return ts;
		// eslint-disable-next-line
	}, [outer,tokensModule.allCoins]);

	return (
		<InputBox
			fieldText={`Output ${state.focusType === 'input' ? '(estimated)' : ''}`}
			token={state.output}
			value={state.outputValue}
			onInput={value => {
				state.onInput(value, 'output');
			}}
			onTokenSelected={token => {
				state.onTokenSelected(token, 'output');
			}}
			onMax={value => {
				state.onInput(value, 'output');
			}}
			tokens={tokens}
		/>
	);
});

const ObserveSwapTokenWarning = observer(() => {
	const { state } = useContext(SwapContext);

	return (
		<SwapTokenWarning
			open={state.tokenWarningShow}
			onClose={() => {
				tokensModule.addWarned(state.warningToken);
				state.tokenWarningShow = false;
			}}
			coin={state.warningToken}
		/>
	);
});

const Submit = observer(() => {
	const { state } = useContext(SwapContext);

	/*
		TODO
			- 判断是否选择token
			- 判断 交易对 合约是否正常 流通量
			- 判断 是否输入值
			- 判断 值是否有效
			- 判断是否超出余额
	* */

	const text = !state.isSelectedToken
		? Tips.SelectToken
		: !state.inputValue
		? Tips.NoValue
		: state.isAbove
		? Tips.NoLiquidity
		: state.isInvalid
		? Tips.InvalidValue
		: !state.isEnough
		? Tips.NoEnoughBalance
		: 'Swap';

	return (
		<SubmitButton
			onClick={withLimitFn(() => state.onSubmit())}
			disabled={!state.isSelectedToken || !state.isEnough || state.isAbove || !+state.inputValue || state.isInvalid}
			loading={state.loading}
		>
			{text}
		</SubmitButton>
	);
});

const SwapPage = () => {
	const swap = new Swap();

	const onInverted = useCallback(() => {
		swap.inverted();
	}, [swap]);

	return (
		<AppBody>
			<SwapContext.Provider value={{ state: swap }}>
				<Updater />
				<ObserveSwapTokenWarning />
				<AutoColumn gap="md">
					<ErrorBox />

					<WorkWrapper gap="sm">
						<InputView />
						<Row>
							<AutoRow justify={'center'} style={{ position: 'relative' }}>
								<IconButton size="small">
									<StyledChevronsDown size={20} onClick={onInverted} active />
								</IconButton>
								<ReactiveSendBtn />
							</AutoRow>
						</Row>
						<OutputView />
						<SendView />
						<BaseInfo />
					</WorkWrapper>
					<SwapSetting />
					<AutoRow justify={'center'}>
						<Submit />
					</AutoRow>
				</AutoColumn>
			</SwapContext.Provider>
		</AppBody>
	);
};

// eslint-disable-next-line
export default observer(() => React.useMemo(() => <SwapPage key={wallet.network.type} />, [wallet.network.type]));
