import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { login } from "../../redux/actions/authAction";

const LoginPass = () => {
	const initialState = {
		account: "",
		password: ""
	}
	const dispatch = useDispatch();
	const [userData, setUserData] = useState(initialState);
	const [typePass, setTypePass] = useState(false);
	const { account, password } = userData;

	const handleChangeInput = (e) => {
		setUserData({ ...userData, [e.target.name]: e.target.value })
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(login(userData));
	}

	return (
		<form className='form-group mb-3' onSubmit={handleSubmit}>
			<div className="form-group">
				<label htmlFor="exampleInputEmail1">Account</label>
				<input className="form-control" type="text" id="exampleInputEmail1" name="account"
					onChange={handleChangeInput} value={account}
				/>
			</div>
			<div className="form-group">
				<label htmlFor="exampleInputPassword1">Password</label>
				<div className="pass">
					<input type={typePass ? 'text' : 'password'}
						className="form-control" id="exampleInputPassword1" name="password"
						onChange={handleChangeInput} value={password}
					/>
					<small onClick={() => setTypePass(!typePass)}>{typePass ? 'hide' : 'show'}</small>
				</div>
			</div>
			<button type="submit" className="btn btn-dark w-100" disabled={(account && password) ? false : true}>Submit</button>
		</form>
	)
}

export default LoginPass;
