import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
    const { auth } = useSelector(state => state);


    const history = useHistory();

    useEffect(() => {
        if (auth.token) history.push("/");
    }, [history, auth.token]);



    return (
        <div className="auth_page">
            <div className="auth_box">
                <h3 className="text-center text-uppercase mb-4">V Chat App</h3>
                {/* <h3 className="text-uppercase text-center mb-4">Register</h3> */}
                <RegisterForm />
                <p className="my-2">
                    Already have an account? <Link to="/" style={{ color: "crimson" }}>Login Now</Link>
                </p>
            </div>
        </div>
    )
}

export default Register;
