/**
 * Created by buddy on 2020-07-22.
 */
import iostSdk from 'iost';
import { MAIN_SEED, MainSeed } from '@/constants';

export const getCurrentRpc = () => new iostSdk.RPC(new iostSdk.HTTPProvider(MAIN_SEED[MainSeed.Main].http));

export const getTokenBalanceWithAcc = async (account, token = 'iost') => {
	const { balance } = await getCurrentRpc().blockchain.getBalance(account, token, true);
	return balance;
};
