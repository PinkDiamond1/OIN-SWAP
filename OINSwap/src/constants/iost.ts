/**
 * Created by buddy on 2020-08-05.
 */

export const IOST = 'iost';

export enum ChainId {
	MAINNET = 1024,
	TESTNET = 1020,
}

export enum MainSeed {
	Main,
	US,
	Korea,
	UK,
}

export enum TestSeed {
	Main,
	US,
}

/*
  iwallet -s ${GRPC-URL}  state
  curl ${HTTP-URL}/xxx/xx/x
* *  */
export const MAIN_SEED: Record<string, { grpc: string; http: string }> = {
	[MainSeed.Main]: {
		grpc: 'api.iost.io',
		http: 'http://api.iost.io',
	},
	[MainSeed.US]: {
		grpc: '18.209.137.246:30002',
		http: 'http://18.209.137.246:30001',
	},
	[MainSeed.Korea]: {
		grpc: '54.180.196.80:30002',
		http: 'http://54.180.196.80:30001',
	},
	[MainSeed.UK]: {
		grpc: '35.176.24.11:30002',
		http: 'http://35.176.24.11:30001',
	},
};

export const TEST_SEED = {
	[TestSeed.Main]: {
		grpc: 'test.api.iost.io',
		http: 'https://test.api.iost.io',
	},
	[TestSeed.US]: {
		grpc: '13.52.105.102:30002',
		http: 'https://13.52.105.102:30001',
	},
};

//
// export const TOKENS = [
// 	{
// 		name: 'iost',
// 		logo: 'iost',
// 		contract: '',
// 	},
// 	{
// 		name: 'qtmq',
// 		logo: 'qtmq',
// 		contract: 'Contract7pJwDBnVHHUqNcf4spssHmyzQa8hksizWscR946HU556',
// 		// contract: 'ContractFtVn49DQrw1qGT6ogtSt5wqCNn8okMvJa5gpPdhftX7p',
// 	},
// 	{
// 		name: 'qtm',
// 		logo: 'qtm',
// 		contract: 'ContractEmBHPbvgZoMp8n3uB5RVFsfQJWd5t3CcLrKQGknD9Wjk',
// 		// contract: 'ContractFNFmUgHbhyzTTHjQ5xjRzLDcxG4AT5iBFithz19wUjuy',
// 	},
// ];
