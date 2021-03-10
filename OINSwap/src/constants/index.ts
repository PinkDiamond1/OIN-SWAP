/**
 * Created by buddy on 2020-04-06.
 */
export const NULL_TEXT = '--';

/*
	input 1
	output 0

	swap 1
	transfer 0

	ong 1
	token 0
* * */

export enum SWAP_METHOD_CODE {
	ONT_TO_TOKEN_TRANSFER_INPUT = '1001',
	ONT_TO_TOKEN_SWAP_INPUT = '1011',
	ONT_TO_TOKEN_TRANSFER_OUTPUT = '1000',
	ONT_TO_TOKEN_SWAP_OUTPUT = '1010',

	TOKEN_TO_ONT_TRANSFER_INPUT = '0101',
	TOKEN_TO_ONT_SWAP_INPUT = '0111',
	TOKEN_TO_ONT_TRANSFER_OUTPUT = '0100',
	TOKEN_TO_ONT_SWAP_OUTPUT = '0110',

	TOKEN_TO_TOKEN_TRANSFER_INPUT = '0001',
	TOKEN_TO_TOKEN_SWAP_INPUT = '0011',
	TOKEN_TO_TOKEN_TRANSFER_OUTPUT = '0000',
	TOKEN_TO_TOKEN_SWAP_OUTPUT = '0010',
}

export const SWAP_METHOD = {
	'1001': 'ontToTokenTransferInput',
	'1011': 'ontToTokenSwapInput',
	'1000': 'ontToTokenTransferOutput',
	'1010': 'ontToTokenSwapOutput',

	'0101': 'tokenToOntTransferInput',
	'0111': 'tokenToOntSwapInput',
	'0100': 'tokenToOntTransferOutput',
	'0110': 'tokenToOntSwapOutput',

	'0001': 'tokenToTokenTransferInput',
	'0011': 'tokenToTokenSwapInput',
	'0000': 'tokenToTokenTransferOutput',
	'0010': 'tokenToTokenSwapOutput',
};

export enum Tips {
	NoValue = 'Enter a value',
	InvalidValue = 'Invalid value',
	NoEnoughBalance = 'Insufficient balance',
	NoLiquidity = 'Insufficient Liquidity',
	SelectToken = 'Select a token',
	NoExchange = 'No Exchange',
}

export enum OntParamType {
	ByteArray = 'ByteArray',
	Struct = 'Struct',
	Map = 'Map',
	String = 'String',
	Array = 'Array',
	Boolean = 'Boolean',
	Integer = 'Integer',
	IntegerAmount = 'IntegerAmount',
	Address = 'Address',
	Time = 'Time',
}

export const WithoutTokenError = (name, hash) => `Please add OEP-4 Token, the ${name}'s address is ${hash}.`;

export const FACTOR = 10 ** 8;

export * from './iost';
export * from './ont';
export * from './token';
export * from './wallet';

export * from './count';
