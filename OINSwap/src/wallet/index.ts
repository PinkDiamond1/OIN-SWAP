/**
 * Created by buddy on 2020-08-05.
 */
import * as ontDapi from 'ontology-dapi';
import { byteArrayReverse, storage2Value, toDownFixed } from '@/utils';
import { OntParamType, Tips } from '@/constants';
import user from '@/modules/user';
import Big from 'big.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import wallet from '@/modules/wallet';
import Toast from 'light-toast';

const withParam = types => (x, i) => {
	let type = types[i];
	let value = x;

	if (type === OntParamType.Integer) {
		value *= 1;
	}

	if (type === OntParamType.Address) {
		value = ontDapi.client.api.utils.addressToHex(value);
		type = OntParamType.ByteArray;
	}

	if (type === OntParamType.Time) {
		value += Math.floor(Date.now() / 1000);
		type = OntParamType.Integer;
	}

	return {
		type,
		value,
	};
};

const withMap = (args, types) => {
	const res = args.map(withParam(types));
	return res;
};

let isInit = false;
export const init = () => {
	ontDapi.client.registerClient({});
	isInit = true;
};

export const isInstalled = async () => {
	try {
		const walletInfo = await ontDapi.client.api.provider.getProvider();
		return walletInfo;
	} catch (e) {
		return false;
	}
};

export const getNetWork = async () => ontDapi.client.api.network.getNetwork();

export const getStorage = (contract, key) => ontDapi.client.api.network.getStorage({ contract, key });

export const getAccount = () => ontDapi.client.api.asset.getAccount();

export const getIdentity = () => ontDapi.client.api.identity.getIdentity();

export const callContract = async (scriptHash, operation, args) => {
	console.log('post', scriptHash, operation, args);
	try {
		const res = await ontDapi.client.api.smartContract.invoke({
			scriptHash,
			operation,
			args,
			gasPrice: 2500,
			gasLimit: 80000000,
		});
		console.log('received', scriptHash, operation, args, res);
		return res;
	} catch (e) {
		if (e === 'CANCELED' || e === 'TIMEOUT' || e === 'OTHER') {
			return;
		}
		toast.warning(`The system is busy, please try again later`);
	}
};

export const callRead = async (scriptHash, operation, args) => {
	console.log('read-post', scriptHash, operation, args);
	try {
		const res = await ontDapi.client.api.smartContract.invokeRead({
			scriptHash,
			operation,
			args,
		});
		console.log('read-received', scriptHash, operation, args, res);
		return res;
	} catch (e) {}
};

export const getExchange = async hash => {
	const x = await ontDapi.client.api.network.getStorage({
		contract: wallet.factory,
		key: ontDapi.client.api.utils.strToHex('tokenToEx') + hash,
	});

	if (x === '') {
		throw new Error(Tips.NoExchange);
	}
	return byteArrayReverse(x);
};

/*
	success res
	failed false
* * */
export const getBalance = async address => {
	const res = await axios.get(`${wallet.rpcDomain}/v2/addresses/${address}/native-oep4/balances`);
	const result: any = {};
	const { msg } = res.data;

	if (msg !== 'SUCCESS') {
		throw new Error(`Get Native balance error ${msg}`);
	}

	res.data.result.forEach(x => {
		if (['ong', 'ont'].includes(x.asset_name)) {
			result[x.asset_name.toUpperCase()] = x.balance;
		}
	});

	return result;
};

const balanceOf = async (token, owner) => {
	const balance = await getStorage(token.hash, '01' + byteArrayReverse(owner));
	if (balance === '') {
		return 0;
	}
	const value = storage2Value(balance);

	return token.factor === 0 ? value : toDownFixed(new Big(value).div(token.factor), token.decimal);
};

export const getNativeBalance = async hash => {
	const x = await Promise.all([
		getBalance(hash),
		balanceOf(wallet.nativeToken, byteArrayReverse(ontDapi.client.api.utils.addressToHex(hash))),
	]);
	const [{ ONT, ONG }, ONTD] = x;
	return { ONT, ONG, ONTD };
};

export const balanceOfAddress = (token, owner) =>
	balanceOf(token, byteArrayReverse(ontDapi.client.api.utils.addressToHex(owner)));

export const getExchangeBalance = async token => {
	const exHash = await getExchange(token.hash);
	return Promise.all([balanceOf(token, exHash), balanceOf(wallet.nativeToken, exHash)]);
};

export const getExchangeBalanceByExhash = (token, exHash) =>
	Promise.all([balanceOf(token, exHash), balanceOf(wallet.nativeToken, exHash)]);

export const approve = async (tokenHash, amount, th?: string) => {
	const exchange = await getExchange(tokenHash);

	const contract = th || tokenHash;

	let allowance = await callRead(
		contract,
		'allowance',
		withMap([user.address, byteArrayReverse(exchange)], [OntParamType.Address, OntParamType.ByteArray])
	);

	allowance = allowance ? storage2Value(allowance) : 0;
	if (allowance > amount) {
		return true;
	}

	const x = await callContract(
		contract,
		'approve',
		withMap(
			[user.address, byteArrayReverse(exchange), amount],
			[OntParamType.Address, OntParamType.ByteArray, OntParamType.Integer]
		)
	);
	if (!x) {
		return;
	}
	return true;
};

// error return undefined
export const swapTokens = async (tokenHash, operation, args, type) => {
	const exHash = await getExchange(tokenHash);

	let approveArgs;

	if (
		['ontToTokenTransferInput', 'ontToTokenSwapInput', 'ontToTokenTransferOutput', 'ontToTokenSwapOutput'].includes(
			operation
		)
	) {
		approveArgs = [tokenHash, args[args.length - 1], wallet.nativeToken.hash];
	} else {
		approveArgs = [tokenHash, args[operation.includes('Output') ? 1 : 0]];
	}

	const x = await approve.apply(approve, approveArgs);
	if (!x) {
		return;
	}

	return callContract(exHash, operation, withMap(args, type));
};

// addLiquidity error do nothing
const liquidityType = [
	OntParamType.Integer,
	OntParamType.Integer,
	OntParamType.Time,
	OntParamType.Address,
	OntParamType.Integer,
];
export const addLiquidity = async (tokenHash, args) => {
	const exchange = await getExchange(tokenHash);

	const x = await approve(tokenHash, args[1]);
	if (!x) {
		return;
	}

	return callContract(exchange, 'addLiquidity', withMap(args, liquidityType));
};

// removeLiquidity error do nothing
const delLiquidityType = [
	OntParamType.Integer,
	OntParamType.Integer,
	OntParamType.Integer,
	OntParamType.Time,
	OntParamType.Address,
];
export const removeLiquidity = async (tokenHash, args) => {
	const exchange = await getExchange(tokenHash);
	return callContract(exchange, 'removeLiquidity', withMap(args, delLiquidityType));
};

const getExchangeTotalSupply = async exchange => {
	const x = await getStorage(exchange, ontDapi.client.api.utils.strToHex('totalSupply'));

	if (!x) {
		return 0;
	}
	return storage2Value(x) / wallet.nativeToken.factor;
};

const getExchangeOfBalance = async exchange => {
	const x = await getStorage(
		exchange,
		ontDapi.client.api.utils.strToHex('balance') + ontDapi.client.api.utils.addressToHex(user.address)
	);
	if (!x) {
		return 0;
	}
	return storage2Value(x) / wallet.nativeToken.factor;
};

// getError do nothing
export const getLiquidity = async hash => {
	const exchange = await getExchange(hash);
	return Promise.all([getExchangeTotalSupply(exchange), getExchangeOfBalance(exchange)]);
};

export const getLiquidityByExhash = exchange =>
	Promise.all([getExchangeTotalSupply(exchange), getExchangeOfBalance(exchange)]);

export const nativeChange = async (contract, method, from, amount) => {
	return callContract(contract, method, withMap([from, amount], [OntParamType.Address, OntParamType.Integer]));
};

export const login = () => {
	Toast.info('Please import private key into CyanoWallet');
};

const cacheKey = {};
export const getTokenInfo = async (hash, cancelToken) => {
	if (cacheKey[hash]) {
		return cacheKey[hash];
	}

	const res: any = await axios.get(`${wallet.rpcDomain}/v2/tokens/oep4/${hash}`, { cancelToken });
	if (res.data.msg !== 'SUCCESS') {
		throw new Error(res.data.msg);
	}
	const { result } = res.data;
	const token = {
		name: result.symbol,
		symbol: result.name,
		logo: result.logo,
		decimals: result.decimals,
		hash: result.contract_hash,
		factor: 10 ** result.decimals,
		address: byteArrayReverse(hash),
		isOut: true,
	};
	cacheKey[hash] = token;
	return token;
};

export const createExchange = token =>
	callContract(wallet.factory, 'createExchange', withMap([token.hash], [OntParamType.ByteArray])).then(res => {
		res && toast.success(`Create ${token.name} Pool Success`);
		return res;
	});
