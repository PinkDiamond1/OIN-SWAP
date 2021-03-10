/**
 * Created by buddy on 2020-07-23.
 */
import { computed, observable } from 'mobx';
import { NATIVE_TOKEN, NULL_TEXT, OntParamType, SWAP_METHOD, SWAP_METHOD_CODE, TOKEN_MODE } from '@/constants';
import { getBackMode, toDownFixed, withFactor } from '@/utils';
import CountUtil from '@/modules/CountUtil';
import setting from '@/modules/setting';
import { Token } from '@/types';
import * as iWallet from '@/wallet';
import { swapTokens } from '@/wallet';
import user from '@/modules/user';
import Big from 'big.js';
import { toast } from 'react-toastify';
import wallet from '@/modules/wallet';
import tokensModule from '@/modules/tokens';

const initialToken = {
	balance: 0,
	nativeBalance: 0,
};

export default class Swap extends CountUtil {
	@observable input?: Token = {
		...initialToken,
		...wallet.nativeToken,
	};

	@observable output?: Token = null;

	@observable inputValue: any = '';
	@observable outputValue: any = '';

	@observable recipient = null;

	async fetchTokenBalance(mode: TOKEN_MODE) {
		try {
			if (!this[mode] || this[mode].name === NATIVE_TOKEN) {
				return;
			}
			const token = this[mode];

			const [balance, nativeBalance] = await iWallet.getExchangeBalance(this[mode]);

			if (token.name !== this[mode].name) {
				return;
			}
			// if (balance == 0 || nativeBalance == 0) {
			// 	error.setMessage("The token's liquidity is invalid.You can contact our service");
			// 	return;
			// }

			const { balance: prevB, nativeBalance: prevNb } = this[mode];

			this[mode].balance = balance as number;
			this[mode].nativeBalance = nativeBalance as number;
			if (prevB != balance || prevNb != nativeBalance) {
				this.onInput(this[this.focusType + 'Value'], this.focusType);
			}
		} catch (e) {
			// error.setMessage(e);
		}
	}

	inverted() {
		let x: any = this.input;
		this.input = this.output;
		this.output = x;
		x = this.inputValue;
		this.inputValue = this.outputValue;
		this.outputValue = x;
		const invertedType = getBackMode(this.focusType);
		this.onInput(this[invertedType + 'Value'], invertedType);
	}

	@observable focusType = 'input';
	setFocus(type) {
		this.focusType = type;
	}

	onTokenSelected = (token: Token, mode: TOKEN_MODE) => {
		if (this[mode]?.name === token.name) {
			return;
		}
		if (this[mode]?.name !== token.name && this[getBackMode(mode)]?.name === token.name) {
			this.inverted();
			return;
		}
		this[mode] = { ...initialToken, ...token };
		if (tokensModule.isAlertCoin(token)) {
			this.tokenWarningShow = true;
			this.warningToken = token;
		}
	};

	@computed get isNativeInput() {
		return this.input.name === NATIVE_TOKEN;
	}

	@computed get isNativeOutput() {
		if (!this.output) {
			return false;
		}
		return this.output.name === NATIVE_TOKEN;
	}

	midOng: string;
	onInput = (xvalue, type) => {
		this.focusType = type;
		this[type + 'Value'] = xvalue;
		if (!this.input || !this.output) {
			return;
		}

		if (this.isNativeInput && !this.output.balance) {
			return;
		}
		if (this.isNativeOutput && !this.input.balance) {
			return;
		}

		if (!this.isNativeOutput && !this.isNativeInput && (!this.output.balance || !this.input.balance)) {
			return;
		}

		const value = Big(xvalue || 0);
		if (this.isNativeOutput || this.isNativeInput) {
			const backMode = getBackMode(type);

			// nativeToTokenInput input can be bigger but output must be limited.
			let result;
			if (this.isNativeInput && this.output.balance) {
				result =
					type === TOKEN_MODE.INPUT
						? toDownFixed(
								this.getInputPrice(value, this.output.nativeBalance, this.output.balance),
								this.output.decimal
						  )
						: toDownFixed(
								this.getOutputPrice(value, this.output.nativeBalance, this.output.balance, 10 ** -this.output.decimal),
								wallet.nativeToken.decimal
						  );
			}
			// tokenToNativeOutput
			if (this.isNativeOutput && this.input.balance) {
				result =
					type === 'input'
						? toDownFixed(
								this.getInputPrice(value, this.input.balance, this.input.nativeBalance),
								wallet.nativeToken.decimal
						  )
						: toDownFixed(
								this.getOutputPrice(
									value,
									this.input.balance,
									this.input.nativeBalance,
									10 ** -wallet.nativeToken.decimal
								),
								this.input.decimal
						  );
			}

			this[backMode + 'Value'] = Big(result || 0).lte(0) ? '' : result;

			return;
		}

		if (type === TOKEN_MODE.INPUT) {
			/* tokenToTokenInput */
			const midOng = (this.midOng = toDownFixed(
				this.getInputPrice(value, this.input.balance, this.input.nativeBalance),
				wallet.nativeToken.decimal
			));

			const result = toDownFixed(
				this.getInputPrice(midOng, this.output.nativeBalance, this.output.balance),
				this.output.decimal
			);
			this.outputValue = Big(result).lte(0) ? '' : result;
		} else {
			/* tokenToTokenOutput */
			const midOng = (this.midOng = toDownFixed(
				this.getOutputPrice(value, this.output.nativeBalance, this.output.balance, 10 ** -wallet.nativeToken.decimal),
				wallet.nativeToken.decimal
			));

			const result = toDownFixed(
				this.getOutputPrice(midOng, this.input.balance, this.input.nativeBalance, 10 ** -this.output.decimal),
				this.input.decimal
			);
			this.inputValue = Big(result).lte(0) ? '' : result;
		}
	};

	getAaiMethodConfig() {
		const isNativeTokenInput = this.input.name === NATIVE_TOKEN;
		const isNativeTokenOutput = this.output.name === NATIVE_TOKEN;
		const isSend = !!this.recipient;
		const isInput = this.focusType === TOKEN_MODE.INPUT;

		const swapMethodCode = `${isNativeTokenInput ? 1 : 0}${isNativeTokenOutput ? 1 : 0}${isSend ? 0 : 1}${
			isInput ? 1 : 0
		}`;

		const method = SWAP_METHOD[swapMethodCode];
		const invoker = user.address;

		let inputValue = +(isInput
			? this.inputValue
			: toDownFixed(new Big(this.inputValue).mul(setting.upSlippageRate), this.input.decimal));
		let outputValue = +(isInput
			? toDownFixed(new Big(this.outputValue).mul(setting.downSlippageRate), this.output.decimal)
			: this.outputValue);

		inputValue = withFactor(inputValue, this.input.factor);
		outputValue = withFactor(outputValue, this.output.factor);

		const deadline = setting.deadlineValue;

		switch (swapMethodCode) {
			case SWAP_METHOD_CODE.ONT_TO_TOKEN_SWAP_INPUT:
				return [
					this.output.hash,
					method,
					[outputValue, deadline, invoker, inputValue],
					[OntParamType.Integer, OntParamType.Time, OntParamType.Address, OntParamType.Integer],
				];
			case SWAP_METHOD_CODE.ONT_TO_TOKEN_TRANSFER_INPUT:
				return [
					this.output.hash,
					method,
					[outputValue, deadline, this.recipient, invoker, inputValue],
					[OntParamType.Integer, OntParamType.Time, OntParamType.Address, OntParamType.Address, OntParamType.Integer],
				];
			case SWAP_METHOD_CODE.ONT_TO_TOKEN_SWAP_OUTPUT:
				return [
					this.output.hash,
					method,
					[outputValue, deadline, invoker, inputValue],
					[OntParamType.Integer, OntParamType.Time, OntParamType.Address, OntParamType.Integer],
				];
			case SWAP_METHOD_CODE.ONT_TO_TOKEN_TRANSFER_OUTPUT:
				return [
					this.output.hash,
					method,
					[outputValue, deadline, this.recipient, invoker, inputValue],
					[OntParamType.Integer, OntParamType.Time, OntParamType.Address, OntParamType.Address, OntParamType.Integer],
				];

			case SWAP_METHOD_CODE.TOKEN_TO_ONT_SWAP_INPUT:
				return [
					this.input.hash,
					method,
					[inputValue, outputValue, deadline, invoker],
					[OntParamType.Integer, OntParamType.Integer, OntParamType.Time, OntParamType.Address],
				];
			case SWAP_METHOD_CODE.TOKEN_TO_ONT_TRANSFER_INPUT:
				return [
					this.input.hash,
					method,
					[inputValue, outputValue, deadline, invoker, this.recipient],
					[OntParamType.Integer, OntParamType.Integer, OntParamType.Time, OntParamType.Address, OntParamType.Address],
				];
			case SWAP_METHOD_CODE.TOKEN_TO_ONT_SWAP_OUTPUT:
				return [
					this.input.hash,
					method,
					[outputValue, inputValue, deadline, invoker],
					[OntParamType.Integer, OntParamType.Integer, OntParamType.Time, OntParamType.Address],
				];
			case SWAP_METHOD_CODE.TOKEN_TO_ONT_TRANSFER_OUTPUT:
				return [
					this.input.hash,
					method,
					[outputValue, inputValue, deadline, this.recipient, invoker],
					[OntParamType.Integer, OntParamType.Integer, OntParamType.Time, OntParamType.Address, OntParamType.Address],
				];

			case SWAP_METHOD_CODE.TOKEN_TO_TOKEN_SWAP_INPUT:
				return [
					this.input.hash,
					method,
					[
						inputValue,
						outputValue,
						withFactor(this.midOng, wallet.nativeToken.factor),
						deadline,
						this.output.hash,
						invoker,
					],
					[
						OntParamType.Integer,
						OntParamType.Integer,
						OntParamType.Integer,
						OntParamType.Time,
						OntParamType.ByteArray,
						OntParamType.Address,
					],
				];
			case SWAP_METHOD_CODE.TOKEN_TO_TOKEN_TRANSFER_INPUT:
				return [
					this.input.hash,
					method,
					[
						inputValue,
						outputValue,
						withFactor(this.midOng, wallet.nativeToken.factor),
						deadline,
						this.recipient,
						this.output.hash,
						invoker,
					],
					[
						OntParamType.Integer,
						OntParamType.Integer,
						OntParamType.Integer,
						OntParamType.Time,
						OntParamType.Address,
						OntParamType.ByteArray,
						OntParamType.Address,
					],
				];
			case SWAP_METHOD_CODE.TOKEN_TO_TOKEN_SWAP_OUTPUT:
				return [
					this.input.hash,
					method,
					[
						outputValue,
						inputValue,
						withFactor(this.midOng, wallet.nativeToken.factor),
						deadline,
						this.output.hash,
						invoker,
					],
					[
						OntParamType.Integer,
						OntParamType.Integer,
						OntParamType.Integer,
						OntParamType.Time,
						OntParamType.ByteArray,
						OntParamType.Address,
					],
				];

			case SWAP_METHOD_CODE.TOKEN_TO_TOKEN_TRANSFER_OUTPUT:
				return [
					this.input.hash,
					method,
					[
						outputValue,
						inputValue,
						withFactor(this.midOng, wallet.nativeToken.factor),
						deadline,
						this.recipient,
						this.output.hash,
						invoker,
					],
					[
						OntParamType.Integer,
						OntParamType.Integer,
						OntParamType.Integer,
						OntParamType.Time,
						OntParamType.Address,
						OntParamType.ByteArray,
						OntParamType.Address,
					],
				];
			default:
				return null;
		}
	}

	@observable loading = 0;
	async onSubmit() {
		try {
			this.loading++;
			const res = await swapTokens.apply(swapTokens, this.getAaiMethodConfig());
			res && toast.success('Swap Success');
			return res;
		} catch (e) {
			/* error */
		} finally {
			this.loading--;
			this.inputValue = '';
			this.outputValue = '';
		}
	}

	setSendMode() {
		this.recipient = '';
	}
	setRecipient(value) {
		this.recipient = value;
	}
	setSwapMode() {
		this.recipient = null;
	}
	@computed get isSendMode() {
		return this.recipient !== null;
	}

	@observable rateMode = true;
	changeMode() {
		this.rateMode = !this.rateMode;
	}

	@computed get exchangeRate() {
		const { input, output } = this;
		if (!input || !output) {
			return NULL_TEXT;
		}

		const { name: inputName } = input;
		const { name: outputName } = output;

		const { inputValue, outputValue } = this;

		if (!inputValue || !outputValue || !inputName || !outputName) {
			return NULL_TEXT;
		}

		return this.rateMode
			? `${toDownFixed((inputValue as any) / (outputValue as any), 4)} ${inputName} per ${outputName}`
			: `${toDownFixed((outputValue as any) / (inputValue as any), 4)} ${outputName} per ${inputName} `;
	}

	// TODO 计算方式待确认...
	@computed get baseRate() {
		return 0;
	}

	@computed get priceImpact() {
		return '';
	}

	@computed get limitNum() {
		if (!this.input || !this.output) {
			return NULL_TEXT;
		}

		if (
			(this.input.name === NATIVE_TOKEN && this.outputValue && this.output.name && this.output.balance) ||
			(this.output.name === NATIVE_TOKEN && this.inputValue && this.input.name && this.input.balance) ||
			(this.input.name &&
				this.input.balance &&
				this.inputValue &&
				this.output.name &&
				this.output.balance &&
				this.outputValue)
		) {
			return (this.focusType === TOKEN_MODE.INPUT
				? +this.outputValue * setting.downSlippageRate
				: +this.inputValue * setting.upSlippageRate
			).toFixed(4);
		} else return NULL_TEXT;
	}

	@computed get isSelectedToken() {
		return !!this.output && !!this.input;
	}

	@computed get isInvalid() {
		return Big(this.inputValue || 0).lte(0);
	}

	@computed get isEnough() {
		return Big(this.inputValue || 0).lte(user.balance[this.input.name] || 0);
	}

	@computed get isAbove() {
		if (!this.output) {
			return false;
		}

		const inToken = this.input;
		const outToken = this.output;

		const native = inToken.name === NATIVE_TOKEN ? inToken : outToken.name === NATIVE_TOKEN ? outToken : null;
		let balance = 0;
		if (native) {
			balance = outToken === native ? inToken.nativeBalance : outToken.balance;
		} else {
			balance = outToken.balance;
		}
		if (!balance) {
			return true;
		}
		return Big(this.outputValue || 0).gt(balance);
	}

	@observable tokenWarningShow = false;
	@observable warningToken = tokensModule.allCoins[0];
}
