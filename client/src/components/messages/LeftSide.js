import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { getConversations, MESSAGE_TYPES } from "../../redux/actions/messageAction";
import { getDataAPI } from "../../utils/fetchData";
// import Header from "../header/Header";
import UserCard from "../UserCard";

const LeftSide = () => {
	const { auth, message, online } = useSelector(state => state);
	const dispatch = useDispatch();
	const history = useHistory();
	const { id } = useParams();

	const [search, setSearch] = useState("");
	const [searchUsers, setSearchUsers] = useState([]);
	const [load, setLoad] = useState(false);

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!search) return;

		try {
			setLoad(true);
			const res = await getDataAPI(`user/search?username=${search}`, auth.token);
			setSearchUsers(res.data.users);
			setLoad(false);
		} catch (err) {
			dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } })
		}
	}
	const isActive = (user) => {
		return (id === user._id) ? 'active' : ''
	}

	useEffect(() => {
		if (message.firstLoad) return;
		dispatch(getConversations({ auth }))
	}, [dispatch, auth, message.firstLoad]);

	const handleAddUser = (user) => {
		setSearch('');
		setSearchUsers([]);
		dispatch({ type: MESSAGE_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
		dispatch({ type: MESSAGE_TYPES.CHECK_ONLINE_OFFLINE, payload: online })
		return history.push(`/messages/${user._id}`)
	}

	useEffect(() => {
		if (message.firstLoad) {
			dispatch({ type: MESSAGE_TYPES.CHECK_ONLINE_OFFLINE, payload: online })
		}
	}, [online, message.firstLoad, dispatch])

	return (
		<>
			{/* <Header /> */}
			<form className="message_header" onSubmit={handleSearch} >
				<input type="text" value={search}
					placeholder="Enter to Search..."
					onChange={e => setSearch(e.target.value)} />

				{
					load
						? <div className="spinner-border text-info" role="status">
							<span className="sr-only">Loading...</span>
						</div>
						: <i className="fas fa-search" />
				}
				<button type="submit" style={{ display: 'none' }}>Search</button>
			</form>
			<div className="message_chat_list">
				{
					searchUsers.length !== 0
						? <>
							{searchUsers.map(user => (
								<div key={user._id} className={`message_user ${isActive(user)}`}
									onClick={() => handleAddUser(user)}
								>
									<UserCard user={user} />
								</div>
							))}
						</>
						: <>
							{
								message.users.map(user => (
									<div key={user._id} className={`message_user ${isActive(user)}`}
										onClick={() => handleAddUser(user)}
									>
										<UserCard user={user} msg={true}>
											{
												user.online
													? <i className="fas fa-circle text-success" />
													: auth.user.following.find(item =>
														item._id === user._id
													) && <i className="fas fa-circle" />
											}
										</UserCard>
									</div>
								))
							}
						</>
				}
			</div>
		</>
	)
}

export default LeftSide;