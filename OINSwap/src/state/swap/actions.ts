/**
 * Created by buddy on 2020-07-20.
 */
import { createAction } from '@reduxjs/toolkit';

export const updateTradeMode = createAction<{ tradeMode: any }>('updateTradeMode');

/* 只有确定交易对，我们才能去获取对应的数据 */
class Token {
	name: string;
	logo: string;
	amount: number;
	reserver: number;
}
/*
	TODO 还存在反转的问题
* * */

/*
	TODO 两个 token 汇兑，我们要先确定一个 token
		如果当前 token 是 iost，则不作操作，否则要获取对应合约里面的数据
		然后翻转的时候界面显示变了，也就是对应的 执行操作不变
		变化的方法又取决于
* * */

export const updateTokenInput = createAction('updateTokenInput');
export const updateTokenOutput = createAction('updateTokenOutput');
