/**
 * Created by buddy on 2020-04-06.
 */
import hex from '@47ng/codec/dist/hex';
import { TOKEN_MODE } from '@/constants';
import utf8 from '@47ng/codec/dist/utf8';
import Decimal from 'decimal.js-light';
import Big from 'big.js';
import { client } from 'ontology-dapi';
import axios from 'axios';

// @ts-nocheck
const UA = window.navigator.userAgent.toLocaleLowerCase();

export const isIos = () => /iphone|ipad|ipod/.test(UA);

export const isAndroid = () => /Android/.test(UA);

export const isWx = () => /micromessenger/.test(UA);

export const getEtherscanLink = () => {};
export const withTimeout = (promise, time = 800) => {
	try {
		return Promise.race([
			promise,
			new Promise(reject => {
				setTimeout(reject, time);
			}),
		]);
	} catch (e) {
		/* error */
	}
};

export const getBackMode = type => (type === TOKEN_MODE.INPUT ? TOKEN_MODE.OUTPUT : TOKEN_MODE.INPUT);

export const byteArrayReverse = hexstring => {
	const uint8Array = hex.decode(hexstring);
	uint8Array.reverse();
	return hex.encode(uint8Array);
};

export const storage2Value = x => {
	return parseInt(byteArrayReverse(x), 16);
};

export const strToHex = str => {
	const uint8Array = utf8.encode(str);
	return hex.encode(uint8Array);
};

export const withFactor = (value, factor) => +toDownFixed(Big(value).mul(factor));

export const withFixedDown = (value, dits) => {
	Decimal.rounding = Decimal.ROUND_DOWN;
	const x = new Decimal(+value + '');
	return +x.toDecimalPlaces(dits).toNumber();
};

export const isNull = x => x === undefined || x === null || x === '';

export const toDownFixed = (value: string | number | Big, dits = 0) => {
	const x = Big(value);
	Big.RM = 0;
	return Big(x.toFixed(dits)).toFixed();
};

export const withBalance = balance => balance || 0;

export const withLimitFn = fn => {
	let lock = false;
	return async (...args) => {
		if (lock) {
			return;
		}
		if (!lock) {
			lock = true;
		}
		try {
			const x = await fn(...args);
			lock = false;
			return x;
		} catch (e) {
			lock = false;
		}
	};
};

export const isAddress = address => client.api.utils.isAddress(address);

export const crateCancelToken = () => axios.CancelToken.source();

export const sortToken = (a, b) => {
	if (b.name > a.name) {
		return -1;
	} else if (b.name < a.name) {
		return 1;
	} else {
		return 0;
	}
};
