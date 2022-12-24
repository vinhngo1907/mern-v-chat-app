import React from "react";

const Register = () => {
    <div className="auth_page">
        <form >
            <h3 className="text-uppercase">V-Chat-App</h3>
            <div className="form-group">
                <label htmlFor="account">Account</label>
                <input type="text" className="form-control" id="account" name="account" />
            </div>
            <div className="form-group">
                <label htmlFor="account">Password</label>
                <input type="password" className="form-control" id="password" name="password" />
            </div>
        </form>
    </div>
}

export default Register;
