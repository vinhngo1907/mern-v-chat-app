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
import io from 'socket.io-client'
import SocketClient from "./SocketClient";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import CallModal from './components/messages/CallModal'
import Peer from 'peerjs'
import ForgotPassword from "./pages/forgot-password";
import ResetPasword from "./pages/reset-password/[id]";
import Active from "./pages/active/[id]";
import { getNotifies } from './redux/actions/notifyAction';
// import { apiUrl } from "./utils/constants";

function App() {
	const { auth, status, modal, call } = useSelector(state => state);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(refreshToken())
		const socket = io('https://mern-v-chat-app.onrender.com');
		// const socket = io();
		dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
		return () => socket.close()

	}, [dispatch]);

	useEffect(() => {
		if (auth.token) {
			dispatch(getNotifies(auth.token))
		}
	}, [dispatch, auth.token])

	useEffect(() => {
		const newPeer = new Peer(undefined, {
			path: '/', secure: true
		});

		dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
	}, [dispatch]);

	useEffect(() => {
		if (!("Notification" in window)) {
			alert("This browser does not support desktop notification");
		}
		else if (Notification.permission === "granted") { }
		else if (Notification.permission !== "denied") {
			Notification.requestPermission().then(function (permission) {
				if (permission === "granted") { }
			});
		}
	}, [])

	return (
		<Router>
			<Alert />
			<input type="checkbox" id="theme" />
			<div className={`App ${(status || modal) && 'mode'}`}>
				<div className="main">
					{auth.token && <SocketClient />}
					{call && <CallModal />}
					<Switch>
						<Route exact path="/" component={auth.token ? Home : Login} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/forgot-password" component={ForgotPassword} />
						<Route exact path="/reset-password/:id" component={ResetPasword} />
						<Route exact path="/active/:id" component={Active} />
						<PrivateRouter exact path="/:page" component={PageRender} />
						<PrivateRouter exact path="/:page/:id" component={PageRender} />
					</Switch>
				</div>
			</div>
		</Router>
	)
}

export default App
