import React, { useState } from "react";

function LoginSMS() {
    const [phone, setPhone] = useState('');
    const handleSubmit = (e)=>{
        e.preventDefault();
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label htmlFor="phone" className="form-label">Phone number</label>

                <input type="text" className="form-control" id="phone"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+84374481936" />
            </div>

            <button type="submit" className="btn btn-dark w-100"
                disabled={phone ? false : true}>
                Login
            </button>
        </form>
    )
}

export default LoginSMS;