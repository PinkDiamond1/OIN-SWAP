/**
 * Created by buddy on 2020-07-20.
 */
import AppBody from '@/pages/AppBody';
import React, { useContext, useMemo } from 'react';
import { AutoColumn } from '@/components/Column';
import { AutoRow } from '@/components/Row';
import { PoolBar } from '@/components/NavigationTabs';
import { SubmitButton, WorkWrapper } from '@/components/common';
import styled from 'styled-components';
import { ChevronsDown } from 'react-feather';
import InputBox from '@/components/InputBox';
import { RemoveLiquidity } from './context';
import RelevantPool from '@/modules/relevantpool';
import { observer } from 'mobx-react';
import Updater from './updater';
import BaseInfo from './BaseInfo';
import ErrorBox from '@/pages/ErrorBox';
import { Tips } from '@/constants';
import { withLimitFn } from '@/utils';
import wallet from '@/modules/wallet';
import tokensModule from '@/modules/tokens';

const StyledChevronsDown = styled(ChevronsDown)`
	color: ${({ theme }) => theme.word3};
	cursor: pointer;
`;

const InputView = observer(() => {
	const { state } = useContext(RemoveLiquidity);

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
			fieldText="Pool Tokens"
			balance={state.token?.myLiquidity}
			onTokenSelected={state.setupToken}
			token={state.token}
			value={state.input}
			onInput={state.onInput}
			onMax={state.onMax}
			modalBalance={false}
			tokens={tokens}
		/>
	);
});

const OutputView = observer(() => {
	const { state } = useContext(RemoveLiquidity);

	return (
		<InputBox fieldText="Output(estimated)" needBalance={false} needToken={false} readonly value={state.outputText} />
	);
});

const Submit = observer(() => {
	const { state } = useContext(RemoveLiquidity);

	const text = !state.token
		? Tips.SelectToken
		: !+state.input
		? Tips.NoValue
		: state.isInvalidValue
		? Tips.InvalidValue
		: !state.overMyLiquidity
		? Tips.NoLiquidity
		: 'Remove Liquidity';

	return (
		<SubmitButton
			onClick={withLimitFn(() => state.onSubmit())}
			disabled={!state.token || !+state.input || state.isInvalidValue || !state.overMyLiquidity}
			loading={state.loading}
		>
			{text}
		</SubmitButton>
	);
});

const RelevanntPage = () => {
	const relevantPool = new RelevantPool();

	return (
		<AppBody>
			<RemoveLiquidity.Provider value={{ state: relevantPool }}>
				<Updater />
				<AutoColumn gap="md">
					<ErrorBox />
					<WorkWrapper>
						<AutoColumn gap="sm">
							<PoolBar />
							<InputView />
							<AutoRow justify="center">
								<StyledChevronsDown size={20} />
							</AutoRow>
							<OutputView />
							<BaseInfo />
						</AutoColumn>
					</WorkWrapper>
					<AutoRow justify={'center'}>
						<Submit />
					</AutoRow>
				</AutoColumn>
			</RemoveLiquidity.Provider>
		</AppBody>
	);
};

export default observer(() => {
	return React.useMemo(() => <RelevanntPage key={wallet.network.type} />, []);
});
