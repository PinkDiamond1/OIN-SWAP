import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'inter-ui';
import './i18n';
import App from '@/pages/App';
import store from './state';
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from '@/theme';
import './index.scss';
import { BalanceUpdater, WalletUpdater } from '@/updater';
import * as iWallet from '@/wallet';
// import 'react-confirm-alert/src/react-confirm-alert.css';

iWallet.init();

function Updaters() {
	return (
		<>
			<WalletUpdater />
			<BalanceUpdater />
			{/*<BalanceUpdater />*/}
			{/*<UserUpdater />*/}
			{/*<ApplicationUpdater />*/}
			{/*<TransactionUpdater />*/}
			{/*<MulticallUpdater />*/}
		</>
	);
}

ReactDOM.render(
	<>
		<FixedGlobalStyle />
		<Provider store={store}>
			<Updaters />
			<ThemeProvider>
				<>
					<ThemedGlobalStyle />
					<App />
				</>
			</ThemeProvider>
		</Provider>
	</>,
	document.getElementById('root')
);
