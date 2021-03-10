import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter';
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader';
import Change from './change';
import { RedirectPath } from '@/pages/Swap/redirects';
import AppBody from '@/pages/AppBody';
import { SwapPoolTabs } from '@/components/NavigationTabs';
import { ToastContainer } from 'react-toastify';
import Header from '@/components/Header';

const AppWrapper = styled.div`
	display: flex;
	flex-flow: column;
	align-items: flex-start;
	overflow-x: hidden;
`;

const HeaderWrapper = styled.div`
	${({ theme }) => theme.flexRowNoWrap}
	width: 100%;
	justify-content: space-between;
	padding: 20px;
`;

const BodyWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding-top: 80px;
	align-items: center;
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	z-index: 10;

	${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 16px;
  `};

	z-index: 1;
`;

const Marginer = styled.div`
	margin-top: 5rem;
`;

export default function App() {
	return (
		<HashRouter>
			{/*<Route component={GoogleAnalyticsReporter} />*/}
			<Route component={DarkModeQueryParamReader} />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				pauseOnFocusLoss={false}
				hideProgressBar={false}
				newestOnTop
				rtl={false}
			/>
			<AppWrapper>
				<HeaderWrapper>
					<Header />
				</HeaderWrapper>
				<BodyWrapper>
					{/*<Popups />*/}
					<AppBody>
						<SwapPoolTabs />
						<Switch>
							<Route exact strict path="/change" component={Change} />
							<RedirectPath to="change" />
						</Switch>
					</AppBody>
					<Marginer />
				</BodyWrapper>
			</AppWrapper>
		</HashRouter>
	);
}
