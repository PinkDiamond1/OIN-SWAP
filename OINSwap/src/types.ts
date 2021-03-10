/**
 * Created by buddy on 2020-08-05.
 */

export interface Token {
	name: string;
	symbol: string;
	logo: string;
	hash: string;
	address: string;
	decimal: number;
	factor: number;

	balance?: number;
	nativeBalance?: number;
	value?: string;
}

export interface PoolToken extends Token {
	liquidity?: string | number;
	myLiquidity?: string | number;
	nativeValue?: string | number;
	tokenValue?: string | number;
	position?: {
		native: any;
		token: any;
	};
}
