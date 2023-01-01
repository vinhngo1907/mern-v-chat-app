import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showErrMsg, showSuccessMsg } from "../../components/alert/Message";
import { postDataAPI } from "../../utils/fetchData";

const Auth = () => {
    const { id } = useParams();
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (id) {
            postDataAPI('auth/activate-account', { active_token: id })
                .then(res => setSuccess(res.data.msg))
                .catch(err => setErr(err.response?.data?.msg || err))
        }
    }, [id])
    return (
        <div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
        </div>
    )
}

export default Auth;