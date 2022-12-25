import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { login } from "../redux/actions/authAction";

const Login = () => {
    const { auth } = useSelector(state => state);
    const history = useHistory();
    const dispatch = useDispatch();
    const initialState = {
        account: "",
        password: ""
    }

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

    useEffect(() => {
        if (auth.token) {
            history.push("/");
        }
    }, [auth.token, history])

    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">V-Chat-App</h3>
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
                <button type="submit" className="btn btn-dark w-100">Submit</button>
                <p className="my-2">
                    Have not an account? <Link to="/" style={{ color: "crimson" }}>Register Now</Link>
                </p>
            </form>
        </div>
    )
}

export default Login;