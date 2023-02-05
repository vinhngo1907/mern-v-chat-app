import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import LoginPass from "../components/auth/LoginPass";
import SocialLogin from "../components/auth/SocialLogin";

const Login = () => {
    const { auth } = useSelector(state => state);
    const history = useHistory();

    useEffect(() => {
        if (auth.token) {
            history.push("/");
        }
    }, [auth.token, history])

    return (
        <div className="auth_page">
            <div className="auth_box">
                <h3 className="text-uppercase text-center mb-4">V Chat App</h3>
                <LoginPass />
                <div className="hr">Or Login With</div>

                <div className="social">
                    <SocialLogin />
                </div>
                <div className="my-2">
                    <small className="row my-2 text-primary" style={{ cursor: 'pointer' }}>
                        <span className="col-6">
                            <Link to='/forgot-password'>
                                Forgot password?
                            </Link>
                        </span>
                    </small>
                </div>
                <p className="my-2">
                    Have not an account? <Link to="/register" style={{ color: "crimson" }}>Register Now</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;