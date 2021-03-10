/**
 * Created by buddy on 2020-07-20.
 */

/*
 TRX 4338049.3085
 sTRX 4337146.2023
* * */

const TRX = 4338049.3085;
const sTRX = 4337146.2023;

const getOutputPrice = (outputAmount, outputReserve, inputReserve) => {
	const numerator = inputReserve * outputAmount * 1000;
	const denominator = (outputReserve - outputAmount) * 997;

	return numerator / denominator + 1;
};

const getInputPrice = (inputAmount, inputReserve, outputReserve) => {
	const inputAmountWithFee = inputAmount * 997;

	const numerator = inputAmountWithFee * outputReserve;
	const denominator = inputReserve * 1000 + inputAmountWithFee;
	return numerator / denominator;
};

console.log(getInputPrice(1, TRX, sTRX));

console.log(getOutputPrice(0.9967, sTRX, TRX));
