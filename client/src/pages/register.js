import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { register } from "../redux/actions/authAction";

const Register = () => {
    const { auth, alert } = useSelector(state => state);
    const initialState = {
        username: "",
        email: "",
        fullname: "",
        gender: "male",
        password: "",
        cf_password: ""
    }
    const [userData, setUserData] = useState(initialState);
    const { username, fullname, email, cf_password, password } = userData;

    const handleChangeInput = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }

    const [typePass, setTypePass] = useState(false);
    const [typeCfPass, setTypeCfPass] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (auth.token) history.push("/");
    }, [history, auth.token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(userData))
    }

    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-center text-uppercase mb-4">V Chat App</h3>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" className="form-control" id="email" name="email" value={email} onChange={handleChangeInput}
                        style={{ background: `${alert.email ? '#fd2d6a14' : ''}` }}
                    />
                    <small className="form-text text-danger">
                        {alert.email ? alert.email : ''}
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text" className="form-control" id="username" name="username" value={username} onChange={handleChangeInput}
                        style={{ background: `${alert.username ? '#fd2d6a14' : ''}` }}
                    />
                    <small className="form-text text-danger">
                        {alert.username ? alert.username : ''}
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="fullname">Fullname</label>
                    <input
                        type="text" className="form-control" id="fullname" name="fullname" value={fullname} onChange={handleChangeInput}
                        style={{ background: `${alert.fullname ? '#fd2d6a14' : ''}` }}
                    />
                    <small className="form-text text-danger">
                        {alert.fullname ? alert.fullname : ''}
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="pass">
                        <input type={typePass ? "text" : "password"} className="form-control" id="password" value={password}
                            name="password" onChange={handleChangeInput}
                            style={{ background: `${alert.password ? '#fd2d6a14' : ''}` }}
                        />
                        <small onClick={() => setTypePass(!typePass)}>{typePass ? 'hide' : 'show'}</small>
                    </div>
                    <small className="form-text text-danger">
                        {alert.password ? alert.password : ''}
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="cf_password">Confirm Password</label>
                    <div className="pass">
                        <input type={typeCfPass ? "text" : "password"}
                            className="form-control" onChange={handleChangeInput}
                            id="cf_password"
                            name="cf_password"
                            value={cf_password} style={{ background: `${alert.cf_password ? '#fd2d6a14' : ''}` }}
                        />
                        <small onClick={() => setTypeCfPass(!typeCfPass)}>{typeCfPass ? 'hide' : 'show'}</small>
                    </div>
                    <small className="form-text text-danger">
                        {alert.cf_password ? alert.cf_password : ''}
                    </small>
                </div>
                <div className="row justify-content-between mx-0 mb-1">
                    <label htmlFor="male">
                        Male: <input type="radio" id="male" name="gender"
                            value="male" defaultChecked onChange={handleChangeInput} />
                    </label>

                    <label htmlFor="female">
                        Female: <input type="radio" id="female" name="gender"
                            value="female" onChange={handleChangeInput} />
                    </label>

                    <label htmlFor="other">
                        Other: <input type="radio" id="other" name="gender"
                            value="other" onChange={handleChangeInput} />
                    </label>
                </div>
                <button type="submit" className="btn btn-dark w-100">Submit</button>
                <p className="my-2">
                    Already have an account? <Link to="/" style={{ color: "crimson" }}>Login Now</Link>
                </p>
            </form>
        </div>
    )
}

export default Register;
