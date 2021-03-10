/**
 * Created by buddy on 2020-07-23.
 */
import Big from 'big.js';

export default class {
	getInputPrice(_inputAmount: any, _inputReserve: any, _outputReserve: any): Big {
		const inputAmount = Big(_inputAmount);
		const inputReserve = Big(_inputReserve);
		const outputReserve = Big(_outputReserve);

		const inputAmountWithFee = inputAmount.mul(9975);
		const numerator = inputAmountWithFee.mul(outputReserve);
		const denominator = inputReserve.mul(10000).add(inputAmountWithFee);
		return numerator.div(denominator);
	}

	getOutputPrice(_outputAmount: any, _inputReserve: any, _outputReserve: any, factor = 10 ** -8): Big {
		const outputAmount = Big(_outputAmount);
		const inputReserve = Big(_inputReserve);
		const outputReserve = Big(_outputReserve);
		const numerator = inputReserve.mul(outputAmount).mul(10000);
		const denominator = outputReserve.sub(outputAmount).mul(9975);

		if (denominator.eq(0)) {
			return inputReserve;
		}
		return numerator.add(denominator).sub(factor).div(denominator);
	}
}
