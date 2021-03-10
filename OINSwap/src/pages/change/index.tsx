/**
 * Created by buddy on 2020-08-11.
 */
import React, { useContext, useMemo } from 'react';
import { AutoColumn } from '@/components/Column';
import ErrorBox from '@/pages/ErrorBox';
import { SubmitButton, WorkWrapper } from '@/components/common';
import Row, { AutoRow, RowBetween } from '@/components/Row';
import AppBody from '@/pages/AppBody';
import { StyledChevronsDown } from '@/components/Icon';
import { observer } from 'mobx-react';
import InputBox from '@/components/InputBox';
import ToOntd from '@/modules/change';
import { ChangeContext } from './context';
import styled from 'styled-components';
import { Tips } from '@/constants';
import { IconButton } from '@material-ui/core';
import QuestionHelper from '@/components/QuestionHelper';
import { withLimitFn } from '@/utils';
import wallet from '@/modules/wallet';

const StyledText = styled.div`
	display: flex;
	align-items: center;

	color: ${({ theme }) => theme.word3};
	font-size: 12px;
`;

const InputView = observer(() => {
	const { state } = useContext(ChangeContext);

	const tokens = useMemo(() => {
		const ts = JSON.parse(JSON.stringify(wallet.changeTokens));
		ts.forEach(t => {
			if ([state.input.hash].includes(t.hash)) {
				t.isSelected = true;
			}
		});
		return ts;
		// eslint-disable-next-line
	}, [state.input.hash]);

	return (
		<InputBox
			fieldText={`Input ${state.focusType === 'output' ? '(estimated)' : ''}`}
			token={state.input}
			value={state.input.value}
			onInput={value => {
				state.onInput(value, 'input');
			}}
			onMax={value => {
				state.onInput(value, 'input');
			}}
			tokens={tokens}
			onTokenSelected={token => {
				state.onTokenSelected(token, 'input');
			}}
		/>
	);
});

const OutputView = observer(() => {
	const { state } = useContext(ChangeContext);

	const tokens = useMemo(() => {
		const ts = JSON.parse(JSON.stringify(wallet.changeTokens));
		ts.forEach(t => {
			if ([state.output.hash].includes(t.hash)) {
				t.isSelected = true;
			}
		});
		return ts;
		// eslint-disable-next-line
	}, [state.output.hash]);

	return (
		<InputBox
			fieldText={`Output ${state.focusType === 'input' ? '(estimated)' : ''}`}
			token={state.output}
			value={state.output.value}
			onInput={value => {
				state.onInput(value, 'output');
			}}
			onMax={value => {
				state.onInput(value, 'output');
			}}
			tokens={tokens}
			onTokenSelected={token => {
				state.onTokenSelected(token, 'output');
			}}
		/>
	);
});

const OutputResult = observer(() => {
	const { state } = useContext(ChangeContext);

	return (
		<RowBetween>
			<StyledText>
				Receive <QuestionHelper text="ONT decimal is 0 ,So only Integer values are allowed change." />
			</StyledText>
			<StyledText>{state.receivedText}</StyledText>
		</RowBetween>
	);
});

const Submit = observer(() => {
	const { state } = useContext(ChangeContext);

	const text = !state.input.value
		? Tips.NoValue
		: !Math.floor(+state.input.value)
		? Tips.InvalidValue
		: !state.isEnoughBalance
		? Tips.NoEnoughBalance
		: 'Change';

	return (
		<SubmitButton
			onClick={withLimitFn(() => state.onSubmit())}
			disabled={!state.input.value || !Math.floor(+state.input.value) || !state.isEnoughBalance}
			loading={state.loading}
		>
			{text}
		</SubmitButton>
	);
});

export default () => {
	const state = new ToOntd();

	const onInverted = () => {
		state.inverted();
	};

	return (
		<AppBody>
			<ChangeContext.Provider value={{ state }}>
				<AutoColumn gap="md">
					{/*<BetaTip />*/}
					<ErrorBox />

					<WorkWrapper gap="sm">
						<InputView />
						<Row>
							<AutoRow justify={'center'} style={{ position: 'relative' }}>
								<IconButton size="small">
									<StyledChevronsDown size={20} active onClick={onInverted} />
								</IconButton>
							</AutoRow>
						</Row>
						<OutputView />
						<OutputResult />
					</WorkWrapper>
					<AutoRow justify={'center'}>
						<Submit />
					</AutoRow>
				</AutoColumn>
			</ChangeContext.Provider>
		</AppBody>
	);
};
