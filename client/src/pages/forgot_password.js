import React, { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleChangeInput = (e) => {
        setEmail(e.target.value)
    }
    const forgotPassword = () => {

    }
    return (
        <div className="fg_pass">
            <h2>Forgot Your Password?</h2>

            <div className="row">
                {/* {err && showErrMsg(err)}
                {success && showSuccessMsg(success)} */}

                <label htmlFor="email">Enter your email address</label>
                <input type="email" name="email" id="email" value={email}
                    onChange={handleChangeInput} />
                <button onClick={forgotPassword}>Verify your email</button>
            </div>
        </div>
    )
}

export default ForgotPassword