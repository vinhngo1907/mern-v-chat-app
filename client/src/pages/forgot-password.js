import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../redux/actions/authAction";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    }
    return (
        <div className="auth_page">
            <div className="my-4">
                <h2>Forgot Password?</h2>

                <form className="form-group" onSubmit={handleSubmit}>
                    <label htmlFor="account">Email / Phone Number</label>

                    <div className="d-flex align-items-center">
                        <input type="text" className="form-control" id="account"
                            name="account" value={email} onChange={e => setEmail(e.target.value)} />

                        <button className="btn btn-primary mx-2 d-flex align-items-center"
                            type="submit">
                            <i className="fas fa-paper-plane me-2" /> Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword