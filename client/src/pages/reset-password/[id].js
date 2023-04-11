import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../../redux/actions/authAction";

const ResetPasword = () => {
    const { alert } = useSelector(state => state);
    const token = useParams().id;

    const dispatch = useDispatch();
    const [password, setPassword] = useState("");
    const [cf_password, setCfPassword] = useState("");
    const [typePass, setTypePass] = useState(false);
    const [typeCfPass, setTypeCfPass] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword(password, cf_password, token));
    }

    return (
        <div className="auth_page">
            <form className="auth_box" onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">
                    Reset Password
                </h3>

                <div className="form-group my-2">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="pass">
                        <input type={typePass ? "text" : "password"}
                            className="form-control"
                            id="password"
                            name="password" value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ background: `${alert.password ? '#fd2d6a14' : ''}` }}
                        />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>
                    </div>
                    <small className="form-text text-danger">
                        {alert.password ? alert.password : ''}
                    </small>
                </div>

                <div className="form-group my-2">
                    <label htmlFor="password" className="form-label">Confirm Password</label>
                    <div className="pass">
                        <input type={typeCfPass ? "text" : "password"}
                            className="form-control"
                            id="cf_password"
                            name="cf_password" value={cf_password}
                            onChange={e => setCfPassword(e.target.value)}
                            style={{ background: `${alert.cf_password ? '#fd2d6a14' : ''}` }}
                        />
                        <small onClick={() => setTypeCfPass(!typeCfPass)}>
                            {typeCfPass ? 'Hide' : 'Show'}
                        </small>
                    </div>
                    <small className="form-text text-danger">
                        {alert.cf_password ? alert.cf_password : ''}
                    </small>
                </div>
                <p className="my-2">
                    Don't wanna reset new passowrd? <Link to="/login" style={{ color: "crimson" }}>Login Now</Link>
                </p>
                <button type="submit" className="btn btn-dark w-100 mt-2">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default ResetPasword;