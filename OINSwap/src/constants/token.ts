/**
 * Created by buddy on 2020-08-05.
 */
import { byteArrayReverse } from '@/utils';

interface BaseToken {
	name: string;
	symbol: string;
	decimal: number;
	hash: string;
	logo?: string;
}

interface Token extends BaseToken {
	factor: number;
	address: string;
}

const createToken = (baseInfo: BaseToken): Token => ({
	...baseInfo,
	factor: 10 ** baseInfo.decimal,
	address: byteArrayReverse(baseInfo.hash),
	logo: baseInfo.logo || require('@/assets/icon/default.png'),
});

export const NATIVE_TOKEN = 'ONTD';

const baseToken = {
	Ont: {
		name: 'ONT',
		symbol: 'ontology',
		decimal: 0,
		hash: '0000000000000000000000000000000000000001',
		logo: require('@/assets/icon/ont.png'),
	},
	Ong: {
		name: 'ONG',
		symbol: 'ontology gas',
		decimal: 8,
		hash: '0000000000000000000000000000000000000002',
		logo: require('@/assets/icon/ong.png'),
	},
	Native: {
		name: NATIVE_TOKEN,
		symbol: NATIVE_TOKEN,
		decimal: 9,
		hash: '41ad2ef4767a835b88b22d2120d0ba7f0b596322',
	},
	Ongd: {
		name: 'ONGD',
		symbol: 'ONGD',
		decimal: 8,
		hash: '6cf0c3464f25603310e9f9efa60c66cfb1365e17',
	},
	TestNative: {
		name: NATIVE_TOKEN,
		symbol: NATIVE_TOKEN,
		decimal: 9,
		hash: '2e0de81023ea6d32460244f29c57c84ce569e7b7',
	},
	TestOngd: {
		name: 'ONGD',
		symbol: 'ONGD',
		decimal: 8,
		hash: '738d49a0ff986df6b223024bd5cce22d364cd287',
	},
};

export const OntToken = createToken(baseToken.Ont);

export const OngToken = createToken(baseToken.Ong);

const sortToken = (a, b) => {
	if (b.name > a.name) {
		return -1;
	} else if (b.name < a.name) {
		return 1;
	} else {
		return 0;
	}
};

export const EnvConfig = {
	MAIN: {
		factory: '250c23da4b3e2f20dddf471e7e92f8f2ea69c73d',
		nativeToken: createToken(baseToken.Native),
		tokens: [
			baseToken.Native,
			baseToken.Ongd,
			{
				name: 'MBL',
				symbol: 'MovieBloc',
				logo: require('@/assets/icon/mbl.png'),
				decimal: 8,
				hash: 'e5a49d7fd57e7178e189d3965d1ee64368a1036d',
			},
		]
			.map(x => createToken(x))
			.sort(sortToken),
		changeTokens: [baseToken.Ong, baseToken.Ont, baseToken.Native, baseToken.Ongd]
			.map(x => createToken(x))
			.sort(sortToken),
	},
	TEST: {
		factory: '6f1a3ee4c1c6af430898c9f85df6d68f433dca7a',
		nativeToken: createToken(baseToken.TestNative),
		tokens: [
			baseToken.TestNative,
			baseToken.TestOngd,
			{
				name: 'QTM',
				symbol: 'QTMSKY',
				decimal: 8,
				hash: '9ab893c7db9a5685efb8a74fab1b078fa857ddab',
			},
			{
				name: 'TM',
				symbol: 'TimingEx',
				decimal: 8,
				hash: '366607cfd96742f1a06dfdbf3f8a150f52de8586',
			},
			{
				name: 'OO',
				symbol: 'OrangeO',
				decimal: 8,
				hash: 'f87833ddfe97f4118f77bb3647acac5e91fd4262',
			},
		]
			.map(x => createToken(x))
			.sort(sortToken),
		changeTokens: [baseToken.Ong, baseToken.Ont, baseToken.TestNative, baseToken.TestOngd]
			.map(x => createToken(x))
			.sort(sortToken),
	},
};

export enum TOKEN_MODE {
	INPUT = 'input',
	OUTPUT = 'output',
}
