/**
 * Created by buddy on 2020-07-21.
 */
import iostSdk from 'iost';
import { MAIN_SEED, MainSeed } from '@/constants';
import error from '@/modules/error';
import wallet from '@/modules/wallet';

export const getCurrentRpc = () => new iostSdk.RPC(new iostSdk.HTTPProvider(MAIN_SEED[MainSeed.Main].http));
// export const getCurrentRpc = () => new iostSdk.RPC(new iostSdk.HTTPProvider('http://127.0.0.1:30001'));

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const iWalletJs = window['IWalletJS'];

export const iWalletInstalled = () => !!iWalletJs;

export const getIWalletIost = async () => {
	const iWalletJs = window['IWalletJS'];
	if (!iWalletJs) {
		throw new Error('Please use Chrome, And install iWallet extension. ');
	}
	let account;
	try {
		account = await iWalletJs.enable();
	} catch (e) {
		throw new Error('The iWallet locked. Before do it, unlock iWallet. ');
	}
	if (!account) {
		throw new Error('Please login before do sth with iWallet');
	}

	const x = iWalletJs.newIOST(iostSdk);
	// @ts-ignore
	x.config.gasLimit = 160000;
	return x;
};

const withCatch = fn => async (...args) => {
	try {
		const x: any = await fn(...args);
		return x;
	} catch (e) {
		return null;
	}
};

export const getTokenBalanceWithAcc = withCatch(async (account, token = 'iost') => {
	const { balance } = await getCurrentRpc().blockchain.getBalance(account, token, true);
	return balance;
});

export const getTokenBalanceWithContract = withCatch(async contract => {
	const { data } = await getCurrentRpc().blockchain.getContractStorage(contract, 'balance', true);
	const res = JSON.parse(data);
	const { iost, token } = res;
	return [iost, token];
});

export const getLiquidityInfo = withCatch(async contract => {
	const { data } = await getCurrentRpc().blockchain.getContractStorage(contract, 'balance', true);
	const res = JSON.parse(data);
	const { iost, token, totalSupply, singleSupply } = res;
	return [iost, token, totalSupply, singleSupply[wallet.account] || 0];
});

const mergeTokens = tokens => Array.from(new Set([...tokens, 'iost']));

const callABI = async (contract, method, args, payable = []) => {
	try {
		const ins: any = await getIWalletIost();
		const tx = ins.callABI(contract, method, args);

		payable.forEach(token => {
			tx.addApprove(token, 10000);
		});
		const x = await new Promise((resolve, reject) => {
			ins
				.signAndSend(tx)
				.on('pending', res => {
					alert('Submit success, please waiting for it back...');
				})
				.on('success', result => {
					resolve(true);
				})
				.on('failed', result => {
					if (result === 'User rejected the signature request') {
						return;
					}
					reject(result);
				});
		});
		return x;
	} catch (e) {
		error.setMessage(JSON.stringify(e.message || e));
	}
};

export const addLiduidity = async (contract, token, args) =>
	callABI(contract, 'addLiquidity', args, mergeTokens([token]));

export const removeLiquidity = async (contract, token, args) =>
	callABI(contract, 'removeLiquidity', args, mergeTokens([token]));

export const swapTokes = async (tokens, params) => {
	const [contract, method, args] = params;
	return callABI(contract, method, args, mergeTokens(tokens));
};

export const getDeadline = () => Date.now() + 1200 * 60;
