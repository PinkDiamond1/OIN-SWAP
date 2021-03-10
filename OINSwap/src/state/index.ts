/**
 * Created by buddy on 2020-07-20.
 */

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import reduxLogger from 'redux-logger';
import user from './user/reducer';
import transactions from './transactions/reducer';
import swap from './swap/reducer';
import application from './application/reducer';
import wallet from './wallet/reducer';

const PERSISTED_KEYS: string[] = ['user', 'transactions'];

const store = configureStore({
	reducer: {
		user,
		transactions,
		swap,
		application,
		wallet,
	},
	middleware: [...getDefaultMiddleware(), save({ states: PERSISTED_KEYS }), reduxLogger],
	preloadedState: load({ states: PERSISTED_KEYS }),
});

// store.dispatch({ type: '@redux/init' });

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
