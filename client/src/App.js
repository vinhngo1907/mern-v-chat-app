import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/home';
import PrivateRouter from "./customRouter/PrivateRouter";
import PageRender from "./customRouter/PageRender";
import Login from './pages/login';
import Register from "./pages/register";
import { useEffect } from 'react';

import Alert from "./components/alert/Alert";
import { refreshToken } from './redux/actions/authAction';

function App() {
	const { auth, status, modal } = useSelector(state => state);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(refreshToken())

	}, [dispatch]);

	return (
		<Router>
			<Alert />
			<input type="checkbox" id="theme" />
			<div className={`App ${(status || modal) && 'mode'}`}>
				<div className="main">
					<Switch>
						<Route exact path="/" component={auth.token ? Home : Login} />
						<Route exact path="/register" component={Register} />
						<PrivateRouter exact path="/:page" component={PageRender} />
						<PrivateRouter exact path="/:page/:id" component={PageRender} />
					</Switch>
				</div>
			</div>
		</Router>
	)
}

export default App
