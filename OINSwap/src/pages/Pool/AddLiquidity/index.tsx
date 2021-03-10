/**
 * Created by buddy on 2020-07-20.
 */
import AppBody from '@/pages/AppBody';
import React, { useContext, useMemo } from 'react';
import { AutoColumn } from '@/components/Column';
import Row, { AutoRow } from '@/components/Row';
import { PoolBar } from '@/components/NavigationTabs';
import InputBox from '@/components/InputBox';
import { Plus } from 'react-feather';
import { SubmitButton, WorkWrapper } from '@/components/common';
import styled from 'styled-components';
import { Tips } from '@/constants';
import InjectedPool from '@/modules/injectedpool';
import BaseInfo from '@/pages/Pool/AddLiquidity/BaseInfo';
import { AddLiquidityContext } from './context';
import Updater from './updater';
import { observer } from 'mobx-react';
import ErrorBox from '@/pages/ErrorBox';
import { withLimitFn } from '@/utils';
import wallet from '@/modules/wallet';
import tokensModule from '@/modules/tokens';
import { Box } from '@material-ui/core';

const StyledX = styled(Plus)`
	color: ${({ theme }) => theme.word3};
	cursor: pointer;
`;

const InputView = observer(() => {
	const { state } = useContext(AddLiquidityContext);

	return (
		<InputBox
			fieldText="Deposit"
			tokenModal={false}
			token={wallet.nativeToken}
			value={state.nativeValue}
			onInput={value => {
				state.onInput(value, 'input');
			}}
			onMax={value => {
				state.onMax(value, 'input');
			}}
			needBalance={false}
			modalBalance={false}
			tokens={[]}
			balanceText={'MyLiquidity'}
		/>
	);
});

const OutputView = observer(() => {
	const { state } = useContext(AddLiquidityContext);

	const tokenHash = state.token?.hash;
	const tokens = useMemo(() => {
		const ts = JSON.parse(JSON.stringify(tokensModule.allCoins));
		ts.forEach(t => {
			if ([tokenHash, wallet.nativeToken.hash].includes(t.hash)) {
				t.isSelected = true;
			}
		});
		return ts;
		// eslint-disable-next-line
	}, [tokenHash,tokensModule.allCoins]);

	return (
		<InputBox
			fieldText="Deposit"
			token={state.token}
			value={state.tokenValue}
			onInput={value => {
				state.onInput(value, 'output');
			}}
			onMax={value => {
				state.onMax(value, 'output');
			}}
			onTokenSelected={state.setupToken}
			needBalance={false}
			modalBalance={false}
			tokens={tokens}
		/>
	);
});

const Submit = observer(() => {
	const { state } = useContext(AddLiquidityContext);

	const text = !state.token
		? Tips.SelectToken
		: !state.tokenValue
		? Tips.NoValue
		: !state.isEnough
		? Tips.NoEnoughBalance
		: !state.overLiquidity
		? Tips.InvalidValue
		: 'Add Liquidity';

	return (
		<SubmitButton
			onClick={withLimitFn(() => state.onSubmit())}
			disabled={!state.token || !state.tokenValue || !state.isEnough || !state.overLiquidity}
			loading={state.loading}
		>
			{text}
		</SubmitButton>
	);
});

const SyltedLink = styled.span`
	color: ${({ theme }) => theme.main1};
	:hover {
		cursor: pointer;
		text-decoration: underline;
	}
`;

const LiquidityBar = styled(Row)`
	justify-content: center;
	margin-top: 1rem;
`;

const ObserveLiquidityBar = observer(() => {
	const { state } = useContext(AddLiquidityContext);

	return (
		state.isFirstLoaded &&
		!state.isPoolExisted && (
			<LiquidityBar>
				The pool isn't existed. <span>&nbsp;&nbsp;</span>
				<SyltedLink
					onClick={() => {
						state.createExchange();
					}}
				>
					You can Create pool.
				</SyltedLink>
			</LiquidityBar>
		)
	);
});

const LiquidityTip = styled(Box)`
	color: ${({ theme }) => theme.main1};
	background: ${({ theme }) => theme.background3};
	font-size: 14px;
	min-height: 2rem;
	border-radius: 1rem;
	cursor: pointer;
	word-break: break-all;
	padding: 20px;
`;

const ObserveLiquidityTip = observer(() => {
	const { state } = useContext(AddLiquidityContext);

	console.log({
		isFirstLoaded: state.isFirstLoaded,
		isPoolExisted: state.isPoolExisted,
		isEmpty: state.isEmpty,
	});

	return (
		state.isFirstLoaded &&
		state.isPoolExisted &&
		state.isEmpty && (
			<LiquidityTip>
				<AutoColumn gap="md">
					<Box>You are the first liquidity provider.</Box>
					<Box>The ratio of tokens you add will set the price of this pool.</Box>
					<Box>Once you are happy with the rate click supply to review.</Box>
				</AutoColumn>
			</LiquidityTip>
		)
	);
});

const InjectedPoolPage = () => {
	const injectedPool = useMemo(() => new InjectedPool(), []);

	return (
		<AppBody>
			<AddLiquidityContext.Provider value={{ state: injectedPool }}>
				<Updater />
				<AutoColumn gap="md">
					<ErrorBox />
					<ObserveLiquidityTip />

					<WorkWrapper>
						<AutoColumn gap="sm">
							<PoolBar active />
							<InputView />
							<AutoRow justify="center">
								<StyledX size={20} />
							</AutoRow>
							<OutputView />
							<BaseInfo />
							<ObserveLiquidityBar />
						</AutoColumn>
					</WorkWrapper>
				</AutoColumn>
				<AutoRow justify={'center'}>
					<Submit />
				</AutoRow>
			</AddLiquidityContext.Provider>
		</AppBody>
	);
};

export default observer(() => React.useMemo(() => <InjectedPoolPage key={wallet.network.type} />, []));
