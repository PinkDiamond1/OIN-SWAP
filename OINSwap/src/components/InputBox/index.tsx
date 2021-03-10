/**
 * Created by buddy on 2020-07-21.
 */
import React from 'react';
import styled from 'styled-components';
import Column, { AutoColumn } from '@/components/Column';
import Row, { RowBetween } from '@/components/Row';
import TokenBtn from '@/components/TokenBtn';
import { observer } from 'mobx-react';
import user from '@/modules/user';

const InputWrapper = styled(Column)<any>`
	background: ${({ theme }) => theme.background2};
	border-radius: 10px;
	padding: 10px;
	border: 1px solid transparent;
`;

const InputWrapperFocus = styled(InputWrapper)`
	&:focus-within {
		border-color: ${({ theme }) => theme.main1};
	}
`;

const InputField = styled.div`
	color: ${({ theme }) => theme.word3};
`;

const InputBalance = styled.div`
	color: ${({ theme }) => theme.word3};
	&:hover {
		transition: opacity 300ms;
		opacity: 0.6;
		cursor: pointer;
	}
`;

const InputWidget = styled.input<any>`
	background: transparent;
	border: none;
	outline: none;
	font-size: 24px;
	color: #fff;
	width: 100%;
`;

const InputReadonlyWidget = styled.div`
	background: transparent;
	border: none;
	outline: none;
	font-size: 20px;
	height: 24px;
	color: #fff;
	width: 100%;
`;

const InputWidgetWrapper = styled.div`
	flex: 1;
`;

const BalanceText = observer(({ name, onMax, balance: b }) => {
	const balance = (b === undefined ? user.balance[name] : b) || 0;

	return (
		<InputBalance
			onClick={() => {
				onMax(balance);
			}}
		>
			Balance: {balance}
		</InputBalance>
	);
});

export default ({
	fieldText,
	needBalance = true,
	needToken = true,
	readonly = false,
	tokenModal,
	token,
	value = '',
	onFocus = () => {},
	onInput = () => {},
	onMax = () => {},
	onTokenSelected = () => {},
	tokens,
	modalBalance,
	balance,
}: any) => {
	return (
		<InputWrapperFocus>
			<AutoColumn gap="lg">
				<RowBetween>
					<InputField>{fieldText}</InputField>
					{needBalance && <BalanceText onMax={onMax} name={token?.name} balance={balance} />}
				</RowBetween>
				<Row>
					<InputWidgetWrapper>
						{readonly ? (
							<InputReadonlyWidget>{value}</InputReadonlyWidget>
						) : (
							<InputWidget
								value={value}
								type="text"
								inputMode="decimal"
								pattern="^[0-9]*[.]?[0-9]*$"
								autoCorrect="off"
								autoComplete="off"
								spellCheck={false}
								placeholder="0.00"
								minLength={1}
								maxLength={79}
								onFocus={onFocus}
								onChange={e => {
									if (!new RegExp(e.target.pattern).test(e.target.value)) {
										e.target.value = value;
									} else {
										onInput(e.target.value);
									}
								}}
							/>
						)}
					</InputWidgetWrapper>

					{needToken && (
						<TokenBtn
							modal={tokenModal}
							token={token?.name ? token : null}
							tokens={tokens}
							onSelected={onTokenSelected}
							modalBalance={modalBalance}
						/>
					)}
				</Row>
			</AutoColumn>
		</InputWrapperFocus>
	);
};

const RecipientInputWidget = styled(InputWidget)`
	font-size: 20px;
	color: ${({ theme }) => theme.main1};
`;
export const RecipientInput = ({ onChange = () => {} }: any) => {
	return (
		<InputWrapper>
			<AutoColumn gap="lg">
				<InputField>Recipient</InputField>

				<RecipientInputWidget
					type="text"
					autoCorrect="off"
					autoComplete="off"
					spellCheck={false}
					placeholder="T..."
					minLength={1}
					maxLength={79}
					onChange={e => {
						onChange(e.target.value);
					}}
				/>
			</AutoColumn>
		</InputWrapper>
	);
};
